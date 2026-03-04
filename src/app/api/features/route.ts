import { NextResponse } from 'next/server';

export async function GET() {
    const features = {
        intelligence: [
            {
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning algorithms analyze threats in real-time with 99.9% accuracy',
                icon: '🧠',
                highlights: ['Real-time threat detection', 'Behavioral analysis', 'Pattern recognition', 'Predictive insights']
            },
            {
                title: 'Multi-Source Intelligence',
                description: 'Aggregate data from VirusTotal, threat feeds, and proprietary databases',
                icon: '🔍',
                highlights: ['VirusTotal integration', 'Threat feed aggregation', 'OSINT collection', 'Dark web monitoring']
            },
            {
                title: 'Threat Scoring',
                description: 'Advanced scoring system that evaluates risk levels from 0-100',
                icon: '📊',
                highlights: ['Risk assessment', 'Threat categorization', 'Severity levels', 'Trend analysis']
            }
        ],
        security: [
            {
                title: 'Real-time Monitoring',
                description: 'Continuous monitoring of IPs, domains, and files for emerging threats',
                icon: '🛡️',
                highlights: ['24/7 surveillance', 'Instant alerts', 'Threat hunting', 'Incident response']
            },
            {
                title: 'Advanced Analytics',
                description: 'Comprehensive dashboards and reporting for security teams',
                icon: '📈',
                highlights: ['Custom dashboards', 'Historical data', 'Trend analysis', 'Export capabilities']
            },
            {
                title: 'API Integration',
                description: 'RESTful API for seamless integration with existing security tools',
                icon: '🔌',
                highlights: ['REST API', 'Webhook support', 'SDK libraries', 'Custom integrations']
            }
        ],
        compliance: [
            {
                title: 'Audit Trails',
                description: 'Complete logging and compliance reporting for regulatory requirements',
                icon: '📋',
                highlights: ['Activity logging', 'Compliance reports', 'Data retention', 'GDPR compliance']
            },
            {
                title: 'Role-based Access',
                description: 'Granular permissions and access control for enterprise teams',
                icon: '👥',
                highlights: ['User management', 'Permission levels', 'SSO integration', 'MFA support']
            }
        ]
    };

    return NextResponse.json(features);
}
