import { Link } from 'react-router-dom';
import { Scale, Brain, TrendingUp, Shield, Zap, Users, Award, Globe } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: 'AI-Powered Predictions',
      description: 'Predict case outcomes with 85%+ accuracy using advanced machine learning and judge behavioral analysis.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: 'Legal Trend Forecasting',
      description: 'Stay ahead with 2-5 year regulatory forecasts and emerging legal pattern detection.',
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Risk Mitigation',
      description: 'Identify and avoid legal pitfalls before they impact your business or personal matters.',
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: 'Legal Arbitrage',
      description: 'Discover temporary legal advantages and optimization opportunities across jurisdictions.',
    },
  ];

  const userTypes = [
    { icon: <Users className="h-6 w-6" />, title: 'Individuals', desc: 'Personal legal guidance' },
    { icon: <Scale className="h-6 w-6" />, title: 'Lawyers', desc: 'Case strategy optimization' },
    { icon: <Award className="h-6 w-6" />, title: 'Businesses', desc: 'Compliance & risk management' },
    { icon: <Globe className="h-6 w-6" />, title: 'Researchers', desc: 'Legal trend analysis' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Scale className="h-10 w-10 text-blue-800" />
              <h1 className="text-2xl font-bold text-gray-900">LEGAL ORACLE</h1>
            </div>
            <Link
              to="/auth"
              className="bg-blue-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Future of
            <span className="text-blue-800 block">Legal Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to predict legal outcomes, optimize strategies, and stay ahead of regulatory changes. 
            Transform how you navigate the legal landscape with unprecedented insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/auth"
              className="border-2 border-blue-800 text-blue-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 hover:text-white transition-colors"
            >
              Try as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Revolutionary Legal Technology
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Every Legal Professional
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((type, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-blue-800">{type.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900">{type.title}</h4>
                </div>
                <p className="text-gray-600">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Legal Practice?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of legal professionals who trust LEGAL ORACLE for critical insights.
          </p>
          <Link
            to="/auth"
            className="bg-white text-blue-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Scale className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">LEGAL ORACLE</span>
          </div>
          <p className="text-gray-400 mb-4">
            Advanced AI-powered legal intelligence platform
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Legal Oracle. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
}