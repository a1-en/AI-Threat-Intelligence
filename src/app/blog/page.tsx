'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'threats', name: 'Threat Intelligence', count: 8 },
    { id: 'research', name: 'Security Research', count: 6 },
    { id: 'updates', name: 'Platform Updates', count: 5 },
    { id: 'guides', name: 'Security Guides', count: 5 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'New Ransomware Variant Targeting Healthcare Organizations',
      excerpt: 'Our threat intelligence team has identified a sophisticated ransomware variant specifically designed to target healthcare infrastructure...',
      category: 'threats',
      author: 'Dr. Sarah Chen',
      date: '2024-01-15',
      readTime: '5 min read',
      image: '🏥',
      featured: true
    },
    {
      id: 2,
      title: 'AI-Powered Threat Detection: Breaking Down the Technology',
      excerpt: 'Learn how our machine learning algorithms analyze millions of data points to identify emerging threats in real-time...',
      category: 'research',
      author: 'Dr. James Wilson',
      date: '2024-01-12',
      readTime: '8 min read',
      image: '🤖',
      featured: false
    },
    {
      id: 3,
      title: 'Q4 2023 Threat Landscape Report',
      excerpt: 'Comprehensive analysis of cybersecurity threats, attack vectors, and emerging trends from the final quarter of 2023...',
      category: 'research',
      author: 'Michael Rodriguez',
      date: '2024-01-10',
      readTime: '12 min read',
      image: '📊',
      featured: false
    },
    {
      id: 4,
      title: 'New API Endpoints for Advanced Threat Hunting',
      excerpt: 'We\'ve expanded our API with new endpoints that enable security teams to perform advanced threat hunting and analysis...',
      category: 'updates',
      author: 'Lisa Thompson',
      date: '2024-01-08',
      readTime: '4 min read',
      image: '🔌',
      featured: false
    },
    {
      id: 5,
      title: 'Zero-Day Exploits: How to Stay Protected',
      excerpt: 'Practical guide for organizations to implement strategies that minimize the impact of zero-day vulnerabilities...',
      category: 'guides',
      author: 'Security Team',
      date: '2024-01-05',
      readTime: '6 min read',
      image: '🛡️',
      featured: false
    },
    {
      id: 6,
      title: 'Dark Web Monitoring: What You Need to Know',
      excerpt: 'Understanding the importance of dark web monitoring and how it can help prevent data breaches before they happen...',
      category: 'guides',
      author: 'Michael Rodriguez',
      date: '2024-01-03',
      readTime: '7 min read',
      image: '🌐',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">


      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Threat Intelligence
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Insights</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Stay informed about the latest cybersecurity threats, research findings, and platform updates from our expert team.
        </p>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      {filteredPosts.filter(post => post.featured).length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Featured Article</h2>
          {filteredPosts.filter(post => post.featured).map((post) => (
            <div key={post.id} className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{post.image}</span>
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{post.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                    <span>By {post.author}</span>
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    Read Full Article
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-8xl">{post.image}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <article key={post.id} className="bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-center mb-4">
                <div className="text-4xl">{post.image}</div>
              </div>
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                  {categories.find(c => c.id === post.category)?.name}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{post.author}</span>
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{post.readTime}</span>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get the latest threat intelligence insights, security research, and platform updates delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-gray-400 mb-8">Experience the power of AI-powered threat intelligence</p>
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
  );
}
