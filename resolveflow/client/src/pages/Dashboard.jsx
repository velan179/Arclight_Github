import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Play,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { casesApi, agentApi } from '../services/api';

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningDemo, setRunningDemo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await casesApi.list();
      setCases(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchDemo = async () => {
    setRunningDemo(true);
    try {
      const result = await agentApi.run({
        caseId: 'CASE-1001',
        customerId: 'CUST-9001',
        orderId: 'ORD-88219',
        goalText: 'My laptop arrived with a cracked screen. I need a replacement urgently.',
      });
      navigate('/cases/CASE-1001');
    } catch (e) {
      console.error(e);
      navigate('/cases/CASE-1001');
    } finally {
      setRunningDemo(false);
    }
  };

  const stats = [
    { label: 'Autonomous Resolution Rate', value: '94.2%', change: '+3.1%', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Avg Resolution Time', value: '4.2s', change: '-1.2s', icon: Clock, color: 'text-purple-600' },
    { label: 'Verified State Transitions', value: '1,280', change: '100% sealed', icon: ShieldCheck, color: 'text-indigo-600' },
    { label: 'Escalations Avoided', value: '88.7%', change: '+5.4%', icon: Sparkles, color: 'text-amber-600' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Hackathon PS5 • Autonomous Customer Resolution Engine
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Self-Healing Customer Resolutions with Real-Time Re-planning
          </h1>
          <p className="text-zinc-300 text-sm leading-relaxed mb-6">
            When hardware replacements fail due to zero warehouse stock, ResolveFlow doesn't fail or wait for humans. It observes the constraint, replans to full financial refund, validates enterprise policy, and verifies state changes deterministically.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLaunchDemo}
              disabled={runningDemo}
              className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              {runningDemo ? 'Launching Engine...' : 'Run Hackathon Demo Scenario'}
            </button>
            <Link
              to="/cases/CASE-1001"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10"
            >
              Inspect Case CASE-1001
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span className="text-xs font-semibold text-zinc-500">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-zinc-900 tracking-tight">{s.value}</div>
              <div className="text-[11px] font-medium text-emerald-600 mt-1">{s.change} vs manual handling</div>
            </div>
          );
        })}
      </div>

      {/* Active Cases Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Recent Customer Cases</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Real-time status of autonomous resolution jobs</p>
          </div>
          <Link
            to="/cases"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
          >
            View All Cases <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {cases.map((c) => (
            <div
              key={c.caseId}
              className="p-5 flex items-center justify-between hover:bg-zinc-50/80 transition-colors gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {c.caseId}
                  </span>
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-zinc-400 font-mono">• Order: {c.orderId}</span>
                </div>
                <p className="text-sm font-medium text-zinc-800 truncate">{c.customerGoal}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/cases/${c.caseId}`}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-all"
                >
                  Inspect Agent Run
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
