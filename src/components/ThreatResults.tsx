'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Doughnut } from 'react-chartjs-2';
import { ThreatGraph } from './ThreatGraph';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import type { Chart as ChartJSInstance } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ThreatResultsProps {
  results: {
    virusTotalData: any;
    relatedData?: any;
    gptSummary: string;
    score: number;
    queryType: string;
    query: string;
  };
}

export function ThreatResults({ results }: ThreatResultsProps) {
  const { data: session } = useSession();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const chartRef = useRef<ChartJSInstance<'doughnut'> | null>(null);
  const [includeRawData, setIncludeRawData] = useState(true);

  const chartData = {
    labels: ['Safe', 'Suspicious', 'Malicious'],
    datasets: [
      {
        data: [
          results.score < 30 ? 100 : 0,
          results.score >= 30 && results.score < 70 ? 100 : 0,
          results.score >= 70 ? 100 : 0,
        ],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      },
    ],
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      let chartImage = undefined;
      if (chartRef.current) {
        const chartInstance = chartRef.current;
        if (chartInstance?.toBase64Image) {
          chartImage = chartInstance.toBase64Image();
        }
      }
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          email: session?.user?.email,
          chartImage,
          includeRawData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `threat-report-${results.query}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl">
      <div className="flex justify-between items-center bg-gray-800/20 p-4 rounded-xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 rounded text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 20.944a11.955 11.955 0 01-8.618-3.04M12 20.944a11.955 11.955 0 008.618-3.04" />
              </svg>
            </span>
            Intel Report: <span className="font-mono text-blue-400">{results.query}</span>
          </h3>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-semibold">{results.queryType} Investigation</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-gray-300">
            <input
              type="checkbox"
              checked={includeRawData}
              onChange={e => setIncludeRawData(e.target.checked)}
              className="accent-blue-600 w-3.5 h-3.5 rounded bg-gray-800 border-gray-700"
            />
            Include Metadata
          </label>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            {isGeneratingPDF ? <span className="animate-spin text-xl">◌</span> :
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Threat Score Card */}
        <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-800 flex flex-col items-center">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Threat Intensity</h4>
          <div className="relative w-48 h-48">
            <Doughnut
              ref={chartRef}
              data={chartData}
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '80%' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${results.score >= 70 ? 'text-red-500' : results.score >= 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                {results.score}%
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Certainty Score</span>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-[10px] text-gray-500 font-bold">CLEAN</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-[10px] text-gray-500 font-bold">SUSPICIOUS</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-[10px] text-gray-500 font-bold">MALICIOUS</span></div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-800 flex flex-col">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Executive Summary</h4>
          <div className="bg-blue-500/5 border-l-4 border-blue-500 p-4 rounded-r-xl flex-1 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
            <p className="text-gray-200 text-sm leading-relaxed">{results.gptSummary}</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-blue-400 font-bold">
            <span className="animate-pulse">●</span> AI ANALYSIS ENGINE V2.1
          </div>
        </div>
      </div>

      {/* Network Relationship Graph */}
      <ThreatGraph results={results} />

      {/* Enhanced Features: Passive DNS or Community Comments */}
      {results.relatedData && (
        <div className="grid grid-cols-1 gap-8">
          {/* Resolutions (Passive DNS) */}
          {results.relatedData.resolutions && results.relatedData.resolutions.length > 0 && (
            <div className="bg-gray-800/20 rounded-3xl p-8 border border-gray-800">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Passive DNS History
              </h4>
              <div className="space-y-3">
                {results.relatedData.resolutions.map((res: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-gray-900/40 p-3 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-all">
                    <span className="font-mono text-sm text-gray-300">{res.attributes.ip_address || res.attributes.host_name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{new Date(res.attributes.date * 1000).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Comments */}
          {results.relatedData.comments && results.relatedData.comments.length > 0 && (
            <div className="bg-gray-800/20 rounded-3xl p-8 border border-gray-800">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Community Intelligence
              </h4>
              <div className="space-y-4">
                {results.relatedData.comments.map((comment: any, i: number) => (
                  <div key={i} className="bg-purple-500/[0.03] border border-purple-500/10 p-4 rounded-2xl relative">
                    <div className="text-[10px] text-purple-400 font-bold mb-2 uppercase tracking-tighter">ANONYMOUS RESEARCHER</div>
                    <p className="text-gray-400 text-xs italic line-clamp-3">"{comment.attributes.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Raw Metadata Section */}
      <div className="bg-gray-800/10 rounded-2xl p-6 border border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Extended Metadata</h4>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(results.virusTotalData, null, 2))}
            className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
          >
            Copy Object
          </button>
        </div>
        <pre className="bg-black/40 p-5 rounded-xl overflow-auto max-h-64 text-[11px] text-gray-500 font-mono scrollbar-thin scrollbar-thumb-gray-800">
          {JSON.stringify(results.virusTotalData, null, 2)}
        </pre>
      </div>
    </div>
  );
}