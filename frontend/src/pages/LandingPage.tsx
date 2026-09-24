import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Zap,
  Bell,
  Lock,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Play,
  Server,
  Layers,
  Globe,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-[#182E4B] bg-[#0B1728]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">API Sentinel</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
              How it Works
            </a>
            <a href="#demo" className="hover:text-blue-400 transition-colors">
              Live Preview
            </a>
            <a href="#stats" className="hover:text-blue-400 transition-colors">
              Metrics
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Start Monitoring
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Enterprise-Grade API Observability Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Monitor Every API.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Know Before Your Users Do.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Real-time API uptime monitoring, latency phase breakdown, response validation, SSL certificate tracking, and intelligent alert automation in one sleek platform.
          </p>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start Monitoring Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-[#101F33] hover:bg-[#182E4B] text-slate-200 border border-[#182E4B] rounded-xl font-semibold text-base transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 text-blue-400 fill-blue-400" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div id="demo" className="max-w-6xl mx-auto mt-16 px-6">
          <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-4 shadow-2xl shadow-black/80 relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 to-emerald-600/30 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative rounded-xl overflow-hidden bg-[#07111F] border border-[#182E4B] p-6 space-y-6">
              {/* Fake Dashboard Top Header */}
              <div className="flex items-center justify-between border-b border-[#182E4B] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">app.sentinel.io/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 glow-healthy" />
                  99.98% System Uptime
                </div>
              </div>

              {/* Fake Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#0B1728] p-4 rounded-xl border border-[#182E4B]">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total APIs</span>
                  <p className="text-2xl font-bold text-white mt-1">24 Active</p>
                </div>
                <div className="bg-[#0B1728] p-4 rounded-xl border border-[#182E4B]">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Healthy</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">21 Services</p>
                </div>
                <div className="bg-[#0B1728] p-4 rounded-xl border border-[#182E4B]">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Avg Latency</span>
                  <p className="text-2xl font-bold text-blue-400 mt-1">112 ms</p>
                </div>
                <div className="bg-[#0B1728] p-4 rounded-xl border border-[#182E4B]">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Active Incidents</span>
                  <p className="text-2xl font-bold text-rose-400 mt-1">1 Investigating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-[#0B1728] border-y border-[#182E4B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Engineered for Modern Engineering Teams
            </h2>
            <p className="mt-4 text-slate-400">
              Everything you need to monitor, debug, and maintain 99.99% availability for your REST, GraphQL, and microservice APIs.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#101F33] p-8 rounded-2xl border border-[#182E4B] hover:border-blue-500/40 transition-all">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl w-fit mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Uptime Monitoring</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Automated HTTP health probes scheduled every 30 seconds to 1 hour across global endpoints with timeout detection.
              </p>
            </div>

            <div className="bg-[#101F33] p-8 rounded-2xl border border-[#182E4B] hover:border-blue-500/40 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Latency Decomposition</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Analyze precise DNS lookup, TCP connection, TLS handshake, TTFB server processing, and content download timing.
              </p>
            </div>

            <div className="bg-[#101F33] p-8 rounded-2xl border border-[#182E4B] hover:border-blue-500/40 transition-all">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl w-fit mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Incident Alerting</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Consecutive failure rules and cooldown timers prevent notification noise while alerting via Email, Webhooks, and In-App.
              </p>
            </div>

            <div className="bg-[#101F33] p-8 rounded-2xl border border-[#182E4B] hover:border-blue-500/40 transition-all">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl w-fit mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">SSL Certificate Auditing</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Continuous HTTPS certificate expiration tracking with automated warnings at 30, 7, and 1 day remaining thresholds.
              </p>
            </div>

            <div className="bg-[#101F33] p-8 rounded-2xl border border-[#182E4B] hover:border-blue-500/40 transition-all">
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl w-fit mb-6">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Percentile Analytics</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Interactive latency trend charts computing P50, P95, and P99 percentiles along with HTTP status code distributions.
              </p>
            </div>

            <div className="bg-[#101F33] p-8 rounded-2xl border border-[#182E4B] hover:border-blue-500/40 transition-all">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl w-fit mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Public Status Pages</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Publish hosted status pages to keep your customers informed during operational outages and maintenance windows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Statistics */}
      <section id="stats" className="py-20 bg-[#07111F]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-[#101F33] border border-[#182E4B] rounded-2xl">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.99%</span>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-400">Platform Availability</p>
              <span className="text-[10px] text-slate-500 block mt-1">(Demo Statistics)</span>
            </div>

            <div className="p-6 bg-[#101F33] border border-[#182E4B] rounded-2xl">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-400">1.2M+</span>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-400">Health Probes / Day</p>
              <span className="text-[10px] text-slate-500 block mt-1">(Demo Statistics)</span>
            </div>

            <div className="p-6 bg-[#101F33] border border-[#182E4B] rounded-2xl">
              <span className="text-3xl sm:text-4xl font-extrabold text-sky-400">120K+</span>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-400">Monitored Endpoints</p>
              <span className="text-[10px] text-slate-500 block mt-1">(Demo Statistics)</span>
            </div>

            <div className="p-6 bg-[#101F33] border border-[#182E4B] rounded-2xl">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">&lt; 150ms</span>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-400">Average Response Time</p>
              <span className="text-[10px] text-slate-500 block mt-1">(Demo Statistics)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#182E4B] bg-[#0B1728] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-slate-200">API Sentinel</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Product</a>
            <a href="#" className="hover:text-white">Documentation</a>
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
