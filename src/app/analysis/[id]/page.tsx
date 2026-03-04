'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ThreatResults } from '@/components/ThreatResults';
import { toast } from 'sonner';

export default function AnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/threat/lookup/${params.id}`);
                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({}));
                    console.error('API Error:', response.status, errorBody);
                    throw new Error(`Failed to load analysis: ${response.status}`);
                }
                const data = await response.json();
                console.log('Received data:', data);
                if (data) {
                    // Check if virusTotalData contains the nested structure (new format)
                    const hasNestedData = data.virusTotalData && typeof data.virusTotalData === 'object' && 'virusTotalData' in data.virusTotalData;

                    const finalData = hasNestedData ? {
                        ...data.virusTotalData,
                        lookupId: data._id
                    } : {
                        virusTotalData: data.virusTotalData,
                        gptSummary: data.gptSummary,
                        score: data.score,
                        queryType: data.queryType,
                        query: data.query,
                        relatedData: data.virusTotalData?.relatedData,
                        lookupId: data._id
                    };
                    console.log('Final formatted results:', finalData);
                    setResults(finalData);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                toast.error(err instanceof Error ? err.message : 'Error loading report');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchResults();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-400 font-bold uppercase tracking-widest animate-pulse">Decrypting Intel...</p>
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>
                <ThreatResults results={results} />
            </div>
        </div>
    );
}
