'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      price: { monthly: 29, yearly: 290 },
      features: [
        '100 threat lookups per month',
        'Basic threat scoring',
        'Email support',
        'Standard API access',
        'Basic analytics dashboard',
        'Community forum access'
      ],
      popular: false,
      cta: 'Start Free Trial',
      href: '/auth/register'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing security teams',
      price: { monthly: 99, yearly: 990 },
      features: [
        '1,000 threat lookups per month',
        'Advanced AI analysis',
        'Priority email support',
        'Full API access',
        'Advanced analytics & reporting',
        'Custom threat feeds',
        'Team collaboration tools',
        'Export capabilities'
      ],
      popular: true,
      cta: 'Start Free Trial',
      href: '/auth/register'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Unlimited threat lookups',
        'Custom AI models',
        '24/7 phone & email support',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced compliance reporting',
        'SSO & MFA support',
        'Custom SLA guarantees',
        'On-premise deployment options'
      ],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">


      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Simple, Transparent
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Pricing</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Choose the plan that fits your security needs. All plans include a 14-day free trial with no credit card required.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <span className={`mr-4 text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`ml-4 text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            Yearly
            {billingCycle === 'yearly' && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                Save 20%
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-blue-500 bg-gray-800/60 backdrop-blur-lg'
                  : 'border-gray-700 bg-gray-800/40 backdrop-blur-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price[billingCycle]}</span>
                  <span className="text-gray-400 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-400">
                    Save ${Math.round(plan.price.monthly * 12 * 0.2)} per year
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                    : 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What&apos;s included in the free trial?</h3>
                <p className="text-gray-400">The free trial includes all features of the Professional plan for 14 days with no credit card required.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do you offer custom pricing?</h3>
                <p className="text-gray-400">Yes, we offer custom pricing for enterprise customers with specific requirements.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a setup fee?</h3>
                <p className="text-gray-400">No setup fees for any plan. You only pay for the subscription.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
        <p className="text-gray-400 mb-8">Our team is here to help you choose the right plan</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          >
            Contact Sales
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
