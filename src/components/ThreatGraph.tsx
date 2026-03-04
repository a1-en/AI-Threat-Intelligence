'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with ForceGraph
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface ThreatGraphProps {
    results: {
        query: string;
        queryType: string;
        relatedData?: {
            resolutions?: any[];
            subdomains?: any[];
            communicating_files?: any[];
        };
    };
}

export function ThreatGraph({ results }: ThreatGraphProps) {
    const graphData = useMemo(() => {
        const nodes: any[] = [{ id: results.query, label: results.query, group: 'main', val: 20 }];
        const links: any[] = [];

        // Add Resolutions (IPs or Hostnames)
        if (results.relatedData?.resolutions) {
            results.relatedData.resolutions.forEach((res: any) => {
                const id = res.attributes.ip_address || res.attributes.host_name;
                if (id) {
                    nodes.push({ id, label: id, group: 'resolution', val: 10 });
                    links.push({ source: results.query, target: id, label: 'resolved' });
                }
            });
        }

        // Add Subdomains
        if (results.relatedData?.subdomains) {
            results.relatedData.subdomains.forEach((sub: any) => {
                const id = sub.id;
                if (id) {
                    nodes.push({ id, label: id, group: 'subdomain', val: 8 });
                    links.push({ source: results.query, target: id, label: 'subdomain' });
                }
            });
        }

        // Add Communicating Files
        if (results.relatedData?.communicating_files) {
            results.relatedData.communicating_files.forEach((file: any) => {
                const id = file.id; // Usually a hash
                if (id) {
                    nodes.push({ id, label: `File: ${id.substring(0, 8)}...`, group: 'file', val: 6 });
                    links.push({ source: results.query, target: id, label: 'communicates' });
                }
            });
        }

        // Deduplicate nodes
        const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values());

        return { nodes: uniqueNodes, links };
    }, [results]);

    return (
        <div className="w-full bg-gray-900/60 rounded-3xl border border-gray-800 overflow-hidden relative" style={{ height: '500px' }}>
            <div className="absolute top-4 left-4 z-10 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Threat Network Analysis
                </h4>
                <div className="flex gap-3 text-[10px] font-bold">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span><span className="text-gray-400">TARGET</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-gray-400">DNS/RESOLUTIONS</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-gray-400">SUBDOMAINS</span></div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-gray-400">MALICIOUS FILES</span></div>
                </div>
            </div>

            <ForceGraph2D
                graphData={graphData}
                nodeLabel="label"
                nodeAutoColorBy="group"
                nodeVal={node => (node as any).val}
                linkColor={() => 'rgba(255, 255, 255, 0.1)'}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="rgba(0,0,0,0)"
                width={800} // This will be handled by container flex/width but explicit is safer for first load
                height={500}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = (node as any).label;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Inter, system-ui`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                    // Draw node circle
                    const color = (node as any).group === 'main' ? '#2563eb' :
                        (node as any).group === 'resolution' ? '#22c55e' :
                            (node as any).group === 'subdomain' ? '#eab308' : '#ef4444';

                    ctx.beginPath();
                    ctx.arc(node.x!, node.y!, (node as any).val / 2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();

                    // Draw label
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillText(label, node.x!, node.y! + (node as any).val + 2);
                }}
            />
        </div>
    );
}
