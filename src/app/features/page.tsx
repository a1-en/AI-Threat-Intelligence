'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('intelligence');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">


      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Powerful Features for
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Modern Security</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Discover how our AI-powered platform revolutionizes threat intelligence with cutting-edge technology and comprehensive security solutions.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab === 'intelligence' && 'Intelligence'}
                {tab === 'security' && 'Security'}
                {tab === 'compliance' && 'Compliance'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">Join thousands of security professionals using our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
