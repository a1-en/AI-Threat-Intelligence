'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      title: 'Sales Inquiries',
      description: 'Get pricing information and plan recommendations',
      email: 'sales@aithreatintel.com',
      phone: '+1 (555) 123-4567',
      response: 'Response within 2 hours'
    },
    {
      title: 'Technical Support',
      description: 'Get help with platform features and integrations',
      email: 'support@aithreatintel.com',
      phone: '+1 (555) 123-4568',
      response: 'Response within 4 hours'
    },
    {
      title: 'Security Issues',
      description: 'Report security vulnerabilities or incidents',
      email: 'security@aithreatintel.com',
      phone: '+1 (555) 123-4569',
      response: 'Response within 1 hour'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '123 Security Street, San Francisco, CA 94105',
      timezone: 'PST (UTC-8)'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '456 Cyber Avenue, London, EC2A 4BX',
      timezone: 'GMT (UTC+0)'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '789 Digital Road, Singapore 018956',
      timezone: 'SGT (UTC+8)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              AI Threat Intelligence
            </a>
            <nav className="hidden md:flex space-x-8">
              <a href="/features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-blue-400 font-medium">Contact</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Get in
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Touch</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Have questions about our platform? Need help with implementation? Want to discuss enterprise solutions? We&apos;re here to help.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How Can We Help?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
              <p className="text-gray-400 mb-4">{method.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {method.email}
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {method.phone}
                </div>
                <div className="text-green-400 font-medium">{method.response}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-y border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Send Us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-center">
                                  Thank you for your message! We&apos;ll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-200 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="security">Security Issue</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Our Offices</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <div key={index} className="bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-2">{office.city}</h3>
              <p className="text-blue-400 mb-4">{office.country}</p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {office.address}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {office.timezone}
                </div>
              </div>
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
                <h3 className="text-lg font-semibold text-white mb-2">What are your response times?</h3>
                <p className="text-gray-400">We aim to respond to all inquiries within 24 hours. Priority support customers get faster response times.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do you offer custom solutions?</h3>
                <p className="text-gray-400">Yes, we work with enterprise customers to develop custom integrations and solutions.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I schedule a demo?</h3>
                <p className="text-gray-400">Absolutely! Contact our sales team to schedule a personalized demo of our platform.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do you provide training?</h3>
                <p className="text-gray-400">Yes, we offer comprehensive training for all customers and dedicated training for enterprise clients.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
