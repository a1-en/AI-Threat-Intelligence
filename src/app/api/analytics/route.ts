import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Lookup from '@/models/Lookup';

interface ThreatTrend {
  labels: string[];
  data: number[];
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default: // 7d
        startDate.setDate(now.getDate() - 7);
    }

    // Get lookups for the user within the date range
    const lookups = await Lookup.find({
      userId,
      createdAt: { $gte: startDate, $lte: now }
    }).sort({ createdAt: 1 });

    // Calculate analytics data
    const totalThreats = lookups.length;
    const uniqueSources = new Set(lookups.map(l => l.queryType)).size;
    
    // Calculate average risk score
    const averageRiskScore = lookups.length > 0
      ? Math.round(lookups.reduce((acc, curr) => acc + curr.score, 0) / lookups.length)
      : 0;

    // Generate threat trend data
    const threatTrend: ThreatTrend = {
      labels: [],
      data: []
    };

    // Group lookups by date
    const lookupsByDate = new Map<string, number>();
    lookups.forEach(lookup => {
      const date = lookup.createdAt.toISOString().split('T')[0];
      if (!lookupsByDate.has(date)) {
        lookupsByDate.set(date, 0);
      }
      lookupsByDate.set(date, lookupsByDate.get(date)! + 1);
    });

    // Fill in missing dates with zeros
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      threatTrend.labels.push(dateStr);
      threatTrend.data.push(lookupsByDate.get(dateStr) || 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate threat types distribution
    const threatTypes = {
      labels: ['IP', 'Domain', 'URL', 'Hash'],
      data: [0, 0, 0, 0]
    };

    lookups.forEach(lookup => {
      const index = threatTypes.labels.indexOf(lookup.queryType);
      if (index !== -1) {
        threatTypes.data[index]++;
      }
    });

    // Calculate risk distribution
    const riskDistribution = [0, 0, 0]; // [Low, Medium, High]
    lookups.forEach(lookup => {
      if (lookup.score < 30) riskDistribution[0]++;
      else if (lookup.score < 70) riskDistribution[1]++;
      else riskDistribution[2]++;
    });

    // Calculate changes from previous period
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const previousLookups = await Lookup.find({
      userId,
      createdAt: { $gte: previousStartDate, $lt: previousEndDate }
    });

    const previousTotalThreats = previousLookups.length;
    const threatChange = previousTotalThreats === 0 ? 100 :
      Math.round(((totalThreats - previousTotalThreats) / previousTotalThreats) * 100);

    const previousAverageRiskScore = previousLookups.length > 0
      ? Math.round(previousLookups.reduce((acc, curr) => acc + curr.score, 0) / previousLookups.length)
      : 0;
    const riskChange = previousAverageRiskScore === 0 ? 0 :
      Math.round(((averageRiskScore - previousAverageRiskScore) / previousAverageRiskScore) * 100);

    const previousUniqueSources = new Set(previousLookups.map(l => l.queryType)).size;
    const sourcesChange = previousUniqueSources === 0 ? 100 :
      Math.round(((uniqueSources - previousUniqueSources) / previousUniqueSources) * 100);

    return NextResponse.json({
      totalThreats,
      threatChange,
      averageRiskScore,
      riskChange,
      uniqueSources,
      sourcesChange,
      threatTrend,
      threatTypes,
      riskDistribution
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 