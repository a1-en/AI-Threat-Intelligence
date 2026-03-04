import { NextResponse } from 'next/server';

export async function GET() {
    const plans = [
        {
            name: 'Free',
            description: 'Essential security tools for individual researchers',
            price: { monthly: 0, yearly: 0 },
            features: [
                '10 threat lookups per day',
                'Basic threat scoring',
                'Community forum support',
                'Web interface access',
                'Public threat database access'
            ],
            popular: false,
            cta: 'Get Started Free',
            href: '/auth/register'
        },
        {
            name: 'Pro',
            description: 'Advanced features for professional security teams',
            price: { monthly: 49, yearly: 470 },
            features: [
                'Unlimited threat lookups',
                'Advanced AI-powered analysis',
                'Priority email & chat support',
                'Full API access (1000 requests/min)',
                'Custom dashbaords & reporting',
                'Dark web monitoring alerts',
                'White-label reports'
            ],
            popular: true,
            cta: 'Start 14-Day Free Trial',
            href: '/auth/register'
        }
    ];

    return NextResponse.json(plans);
}
