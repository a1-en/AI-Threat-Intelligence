'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Analytics } from '@/components/Analytics';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to access the dashboard');
      router.push('/auth/login');
    }
  }, [status, router]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportDashboard = async () => {
    setIsExporting(true);
    try {
      // Fetch latest history for the report
      const res = await fetch(`/api/history?userId=${session?.user?.id}&limit=20`);
      const data = await res.json();

      const response = await fetch('/api/report/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookups: data.lookups,
          email: session?.user?.email,
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Security-Dashboard-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Dashboard report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export dashboard report');
    } finally {
      setIsExporting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user?.id) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-12">
      {/* Dashboard Header */}
      <div className="bg-gray-900/50 sticky top-[72px] z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Security Command Center
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Operational - Protecting {session.user.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportDashboard}
                disabled={isExporting}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 border border-gray-700 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isExporting ? <span className="animate-spin">◌</span> :
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                {isExporting ? 'Exporting...' : 'Export Report'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      <ThreatTicker />

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Column: Stats & System Health */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">System Status</h3>
              <div className="space-y-4">
                <StatusItem label="AI Engine" status="Online" color="bg-green-500" />
                <StatusItem label="Database" status="Connected" color="bg-green-500" />
                <StatusItem label="API Node" status="Optimized" color="bg-blue-500" />
                <StatusItem label="Threat Feeds" status="Syncing" color="bg-yellow-500" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Pro Protection</h3>
              <p className="text-gray-400 text-sm mb-4">Real-time monitoring and advanced AI analysis is active on your account.</p>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">75% of monthly lookups used</p>
            </div>
          </div>

          {/* Right Column: Main Analytics & Activity */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm">
              <Analytics userId={session.user.id} />
            </div>

            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Recent Intelligence</h2>
                  <p className="text-gray-400 text-sm">Your latest security investigations</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  View All History
                </button>
              </div>
              <div className="p-0">
                <RecentActivity userId={session.user.id} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ThreatTicker() {
  const [threats] = useState([
    { id: 1, type: 'DDoS', target: 'US-East-1', severity: 'High' },
    { id: 2, type: 'Malware', target: 'EU-West-2', severity: 'Medium' },
    { id: 3, type: 'Phishing', target: 'AS-South-1', severity: 'Low' },
    { id: 4, type: 'Botnet', target: 'SA-East-1', severity: 'High' },
    { id: 5, type: 'Exploit', target: 'AF-South-1', severity: 'Critical' },
  ]);

  return (
    <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee items-center gap-12">
        {[...threats, ...threats].map((threat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="text-blue-400 font-bold tracking-tighter">[INTEL-RECV]</span>
            <span className="text-gray-300">{threat.type} detected at {threat.target}</span>
            <span className={`font-bold ${threat.severity === 'Critical' ? 'text-red-500' :
              threat.severity === 'High' ? 'text-orange-500' :
                'text-yellow-500'
              }`}>({threat.severity})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusItem({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
        <span className="text-xs font-medium text-gray-200">{status}</span>
      </div>
    </div>
  );
}

function RecentActivity({ userId }: { userId: string }) {
  const router = useRouter();
  const [lookups, setLookups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch(`/api/history?userId=${userId}&limit=5`);
        const data = await res.json();
        setLookups(data.lookups || []);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, [userId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      <p className="text-gray-500 text-sm italic">Retrieving intelligence logs...</p>
    </div>
  );

  if (lookups.length === 0) return (
    <div className="text-center py-20 px-4">
      <div className="text-4xl mb-4">🛡️</div>
      <h3 className="text-gray-300 font-semibold">No Activity Yet</h3>
      <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
        Start by analyzing an IP or domain to see your results here.
      </p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-800/20 text-gray-500 text-xs uppercase tracking-widest">
            <th className="px-8 py-4 font-semibold">Target / Identification</th>
            <th className="px-6 py-4 font-semibold">Classification</th>
            <th className="px-6 py-4 font-semibold text-center">Threat Score</th>
            <th className="px-6 py-4 font-semibold">Timestamp</th>
            <th className="px-8 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {lookups.map((lookup) => (
            <tr key={lookup._id} className="hover:bg-blue-500/[0.02] transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xl">
                    {lookup.queryType === 'ip' ? '🌐' : lookup.queryType === 'domain' ? '🔗' : '📄'}
                  </div>
                  <div>
                    <div className="text-gray-200 font-mono text-sm font-medium">{lookup.query}</div>
                    <div className="text-xs text-gray-500">Global Scan Active</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700 uppercase">
                  {lookup.queryType}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-col items-center">
                  <span className={`text-lg font-bold ${lookup.score >= 70 ? 'text-red-500' : lookup.score >= 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {lookup.score}
                  </span>
                  <div className="w-12 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${lookup.score >= 70 ? 'bg-red-500' : lookup.score >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${lookup.score}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-gray-400 text-xs font-medium">
                {new Date(lookup.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => router.push(`/analysis/${lookup._id}`)}
                  className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
