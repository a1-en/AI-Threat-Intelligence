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
    const userId = (session.user as any).id;
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
    let vtOptions = {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY || '',
      },
    };
    let vtResponse;

    if (queryType === 'url') {
      // For URLs, need to submit the URL for analysis first, then get the report
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
    } else if (queryType === 'ip') {
      vtUrl = `https://www.virustotal.com/api/v3/ip_addresses/${query}`;
      vtResponse = await axios.get(vtUrl, vtOptions);
    } else if (queryType === 'email') {
      vtUrl = `https://www.virustotal.com/api/v3/search?query=${encodeURIComponent(query)}`;
      vtResponse = await axios.get(vtUrl, vtOptions);
    } else if (queryType === 'hash') {
      vtUrl = `https://www.virustotal.com/api/v3/files/${query}`;
      vtResponse = await axios.get(vtUrl, vtOptions);
    } else {
      return NextResponse.json(
        { message: 'Unsupported query type' },
        { status: 400 }
      );
    }

    // Generate AI summary
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert. Analyze the following threat intelligence data and provide a clear, concise summary in natural language. Focus on the key findings and potential risks."
        },
        {
          role: "user",
          content: JSON.stringify(vtResponse.data)
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

    // Store lookup in database
    const lookup = await Lookup.create({
      userId,
      query,
      queryType,
      score,
      virusTotalData: vtResponse.data,
      gptSummary,
    });

    return NextResponse.json({
      score,
      virusTotalData: vtResponse.data,
      gptSummary,
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