'use client';

import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { number: '10M+', label: 'Threats Analyzed' },
    { number: '500+', label: 'Enterprise Clients' },
    { number: '99.9%', label: 'Detection Accuracy' },
    { number: '24/7', label: 'Security Monitoring' }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Technology Officer',
      bio: 'Former cybersecurity researcher with 15+ years experience in AI and threat detection.',
      image: '👩‍💻'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Security',
      bio: 'Ex-military cybersecurity specialist with expertise in nation-state threats.',
      image: '👨‍💼'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Lead AI Engineer',
      bio: 'PhD in Machine Learning with focus on anomaly detection and behavioral analysis.',
      image: '👨‍🔬'
    },
    {
      name: 'Lisa Thompson',
      role: 'VP of Operations',
      bio: '20+ years in cybersecurity operations and incident response management.',
      image: '👩‍💼'
    }
  ];

  const values = [
    {
      title: 'Innovation First',
      description: 'We continuously push the boundaries of AI and cybersecurity technology.',
      icon: '🚀'
    },
    {
      title: 'Security by Design',
      description: 'Every feature is built with security and privacy as core principles.',
      icon: '🔒'
    },
    {
      title: 'Customer Success',
      description: 'We measure our success by the security improvements of our customers.',
      icon: '🎯'
    },
    {
      title: 'Transparency',
      description: 'Open communication about our methods, capabilities, and limitations.',
      icon: '🔍'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">


      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Protecting the Digital
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Future</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-12">
          We&apos;re a team of cybersecurity experts, AI researchers, and security professionals dedicated to making the internet safer through intelligent threat detection and prevention.
        </p>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-y border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              In an increasingly connected world, cyber threats are becoming more sophisticated and frequent. Our mission is to democratize enterprise-grade threat intelligence by making AI-powered security accessible to organizations of all sizes.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that every organization deserves the same level of protection that Fortune 500 companies have, and we&apos;re committed to making that vision a reality through innovative technology and unwavering dedication to security excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-y border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Story</h2>
          <div className="space-y-6 text-gray-300">
            <p>
              Founded in 2023, AI Threat Intelligence was born from a simple observation: while large enterprises had access to sophisticated threat intelligence platforms, smaller organizations were left vulnerable to increasingly sophisticated cyber attacks.
            </p>
            <p>
              Our founders, having worked in both government cybersecurity and private sector security, recognized that the gap between enterprise and SMB security capabilities was growing wider. They set out to bridge this gap using the latest advances in artificial intelligence and machine learning.
            </p>
            <p>
              Today, we&apos;re proud to serve hundreds of organizations worldwide, from small businesses to government agencies, helping them stay one step ahead of cyber threats through intelligent, automated security solutions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Us in Securing the Future</h2>
          <p className="text-gray-400 mb-8">Be part of the solution to tomorrow&apos;s cybersecurity challenges</p>
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
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
