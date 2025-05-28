'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ThreatResultsProps {
  results: {
    virusTotalData: any;
    gptSummary: string;
    score: number;
  };
}

export function ThreatResults({ results }: ThreatResultsProps) {
  const { data: session } = useSession();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const chartRef = useRef<any>(null);
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
        } else if (chartInstance?.chart?.toBase64Image) {
          chartImage = chartInstance.chart.toBase64Image();
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
      a.download = 'threat-report.pdf';
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
    <div className="space-y-8 max-w-4xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-100">Threat Analysis Results</h3>
          <p className="text-sm text-gray-400 mt-1">Comprehensive security assessment</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1 select-none">
            <input
              type="checkbox"
              checked={includeRawData}
              onChange={e => setIncludeRawData(e.target.checked)}
              className="accent-blue-600 w-4 h-4 rounded"
            />
            Include Raw Data
          </label>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-700/30 rounded-2xl p-8 border border-gray-600/30 flex flex-col items-center text-center">
          <h4 className="text-lg font-medium text-gray-200 mb-2">Threat Score</h4>
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="h-64 w-64 flex items-center justify-center">
              <Doughnut 
                ref={chartRef}
                data={chartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-bold" style={{ color: results.score >= 70 ? '#ef4444' : results.score >= 30 ? '#eab308' : '#22c55e' }}>
                  {results.score}%
                </div>
                <div className="text-base text-gray-400 mt-1">
                  {results.score >= 70 ? 'High Risk' : results.score >= 30 ? 'Medium Risk' : 'Low Risk'}
                </div>
              </div>
            </div>
          </div>
          {/* Legend - always below the chart, visually separated */}
          <div className="flex flex-row items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#22c55e] inline-block"></span>
              <span className="text-gray-300 text-sm">Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#eab308] inline-block"></span>
              <span className="text-gray-300 text-sm">Suspicious</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#ef4444] inline-block"></span>
              <span className="text-gray-300 text-sm">Malicious</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/30 rounded-2xl p-8 border border-gray-600/30 mt-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">AI Analysis</h4>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{results.gptSummary}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-200">Raw Data</h4>
          <button 
            onClick={() => {
              const pre = document.querySelector('pre');
              if (pre) {
                const text = pre.textContent;
                navigator.clipboard.writeText(text || '');
              }
            }}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre className="bg-gray-900/50 p-4 rounded-lg overflow-auto max-h-96 text-sm text-gray-300 font-mono">
          {JSON.stringify(results.virusTotalData, null, 2)}
        </pre>
      </div>
    </div>
  );
} 