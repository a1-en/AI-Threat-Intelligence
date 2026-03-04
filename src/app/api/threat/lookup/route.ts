import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Lookup from '@/models/Lookup';
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { query, queryType } = await req.json();

    // Connect to database
    await connectDB();

    // Get user and check daily limit
    const userId = (session.user as { id: string }).id;
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found in session' },
        { status: 401 }
      );
    }
    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Reset daily requests if it's a new day (atomic)
    const today = new Date().toDateString();
    const lastRequestDate = new Date(user.lastRequestDate).toDateString();
    if (today !== lastRequestDate) {
      user = await User.findByIdAndUpdate(
        userId,
        { $set: { dailyRequests: 0, lastRequestDate: new Date() } },
        { new: true }
      );
    }

    // Check daily limit (atomic increment if under limit)
    if (user.dailyRequests >= 10) {
      return NextResponse.json(
        { message: 'Daily request limit reached' },
        { status: 429 }
      );
    }

    // Atomically increment dailyRequests
    user = await User.findByIdAndUpdate(
      userId,
      { $inc: { dailyRequests: 1 } },
      { new: true }
    );

    // Fetch data from VirusTotal (v3)
    let vtUrl = '';
    const vtOptions = {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY || '',
      },
    };
    let vtResponse;
    let vtRelatedData: any = {};

    if (queryType === 'url') {
      const submitResp = await axios.post(
        'https://www.virustotal.com/api/v3/urls',
        new URLSearchParams({ url: query }),
        vtOptions
      );
      const analysisId = submitResp.data.data.id;
      vtUrl = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;
      vtResponse = await axios.get(vtUrl, vtOptions);
    } else if (queryType === 'domain') {
      vtUrl = `https://www.virustotal.com/api/v3/domains/${query}`;
      vtResponse = await axios.get(vtUrl, vtOptions);

      // Fetch passive DNS (resolutions)
      try {
        const resolutions = await axios.get(`${vtUrl}/resolutions?limit=10`, vtOptions);
        vtRelatedData.resolutions = resolutions.data.data;
      } catch (e) { console.error('Resolutions fetch failed'); }

      // Fetch subdomains
      try {
        const subdomains = await axios.get(`${vtUrl}/subdomains?limit=10`, vtOptions);
        vtRelatedData.subdomains = subdomains.data.data;
      } catch (e) { console.error('Subdomains fetch failed'); }

      // Fetch communicating files
      try {
        const files = await axios.get(`${vtUrl}/communicating_files?limit=5`, vtOptions);
        vtRelatedData.communicating_files = files.data.data;
      } catch (e) { console.error('Communicating files fetch failed'); }

    } else if (queryType === 'ip') {
      vtUrl = `https://www.virustotal.com/api/v3/ip_addresses/${query}`;
      vtResponse = await axios.get(vtUrl, vtOptions);

      // Fetch passive DNS (resolutions)
      try {
        const resolutions = await axios.get(`${vtUrl}/resolutions?limit=10`, vtOptions);
        vtRelatedData.resolutions = resolutions.data.data;
      } catch (e) { console.error('Resolutions fetch failed'); }

      // Fetch communicating files
      try {
        const files = await axios.get(`${vtUrl}/communicating_files?limit=10`, vtOptions);
        vtRelatedData.communicating_files = files.data.data;
      } catch (e) { console.error('Communicating files fetch failed'); }
    } else if (queryType === 'email') {
      vtUrl = `https://www.virustotal.com/api/v3/search?query=${encodeURIComponent(query)}`;
      vtResponse = await axios.get(vtUrl, vtOptions);
    } else if (queryType === 'hash') {
      vtUrl = `https://www.virustotal.com/api/v3/files/${query}`;
      vtResponse = await axios.get(vtUrl, vtOptions);

      // Fetch comments for hashes
      try {
        const comments = await axios.get(`${vtUrl}/comments?limit=5`, vtOptions);
        vtRelatedData.comments = comments.data.data;
      } catch (e) { console.error('Comments fetch failed'); }
    } else {
      return NextResponse.json(
        { message: 'Unsupported query type' },
        { status: 400 }
      );
    }

    // Generate AI summary - Include related data for context
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert. Analyze the following threat intelligence data (including raw reports and related entities like passive DNS or comments) and provide a clear, concise summary. Focus on if the target is safe or malicious and explain why."
        },
        {
          role: "user",
          content: JSON.stringify({ main: vtResponse.data, related: vtRelatedData })
        }
      ],
    });

    const gptSummary = gptResponse.choices[0].message.content;

    // Calculate threat score based on VirusTotal data
    let score = 0;
    if (vtResponse.data.data?.attributes?.last_analysis_stats) {
      const stats = vtResponse.data.data.attributes.last_analysis_stats;
      const total = stats.harmless + stats.suspicious + stats.malicious;
      if (total > 0) {
        score = Math.round((stats.suspicious * 0.5 + stats.malicious) / total * 100);
      }
    }

    const resultData = {
      score,
      virusTotalData: vtResponse.data,
      relatedData: vtRelatedData,
      gptSummary,
      queryType,
      query
    };

    // Store lookup in database
    const lookup = await Lookup.create({
      userId,
      query,
      queryType,
      score,
      virusTotalData: resultData, // Store the enhanced data
      gptSummary,
    });

    return NextResponse.json({
      ...resultData,
      lookupId: lookup._id,
    });
  } catch (error) {
    console.error('Threat lookup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
