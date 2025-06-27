import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsProps {
  userId: string;
}

type AnalyticsData = {
  threatTrend: { labels: string[]; data: number[] };
  threatTypes: { labels: string[]; data: number[] };
  riskDistribution: number[];
  totalThreats: number;
  threatChange: number;
  averageRiskScore: number;
  riskChange: number;
  uniqueSources: number;
  sourcesChange: number;
};

export function Analytics({ userId }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching analytics for user:', userId);
      
      const response = await fetch(`/api/analytics?timeRange=${timeRange}&userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch analytics');
      }
      
      const data: AnalyticsData = await response.json();
      console.log('Analytics data received:', data);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-2">Error loading analytics</div>
        <div className="text-gray-400 text-sm">{error}</div>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">No analytics data available</div>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  const threatTrendData = {
    labels: analyticsData.threatTrend.labels,
    datasets: [
      {
        label: 'Threats Detected',
        data: analyticsData.threatTrend.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const threatTypeData = {
    labels: analyticsData.threatTypes.labels,
    datasets: [
      {
        data: analyticsData.threatTypes.data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(234, 179, 8, 0.8)',  // Yellow
          'rgba(239, 68, 68, 0.8)',  // Red
        ],
      },
    ],
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: analyticsData.riskDistribution,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(234, 179, 8, 0.8)',  // Yellow
          'rgba(239, 68, 68, 0.8)',  // Red
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">Total Threats</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.totalThreats}</p>
          <p className="text-green-400 text-sm mt-2">
            {analyticsData.threatChange > 0 ? '+' : ''}{analyticsData.threatChange}% from last period
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">Average Risk Score</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.averageRiskScore}%</p>
          <p className="text-yellow-400 text-sm mt-2">
            {analyticsData.riskChange > 0 ? '+' : ''}{analyticsData.riskChange}% from last period
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">Unique Sources</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.uniqueSources}</p>
          <p className="text-blue-400 text-sm mt-2">
            {analyticsData.sourcesChange > 0 ? '+' : ''}{analyticsData.sourcesChange}% from last period
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Threat Trend</h3>
          <Line
            data={threatTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Threat Types</h3>
          {analyticsData.threatTypes.data.every((v) => v === 0) ? (
            <div className="text-gray-400 text-center py-12">No threat type data available</div>
          ) : (
            <Doughnut
              data={threatTypeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                },
              }}
            />
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Risk Distribution</h3>
          <Bar
            data={riskDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
} 