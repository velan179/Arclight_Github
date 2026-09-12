import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft, RefreshCw, User, Package, Calendar, Shield } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AgentJourney from '../components/AgentJourney';
import EvidencePanel from '../components/EvidencePanel';
import ChaosControls from '../components/ChaosControls';
import { casesApi, agentApi, enterpriseApi } from '../services/api';

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    try {
      const data = await casesApi.get(id);
      setCaseData(data);
      if (data?.activeRunId) {
        const evs = await agentApi.getEvents(data.activeRunId);
        setEvents(evs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgent = async () => {
    setIsRunning(true);
    setEvents([]);
    try {
      const result = await agentApi.run({
        caseId: id,
        customerId: caseData?.customerId || 'CUST-9001',
        orderId: caseData?.orderId || 'ORD-88219',
        goalText: caseData?.customerGoal || 'My laptop arrived damaged. I want a replacement.',
      });
      if (result?.events) {
        setEvents(result.events);
      }
      await loadCase();
    } catch (e) {
      console.error('Agent run failed', e);
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-zinc-500 font-mono">Loading case telemetry...</div>;
  }

  const currentStatus = caseData?.status || 'OPEN';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCase}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors text-xs flex items-center gap-1.5"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRunAgent}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm shadow-purple-500/20 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {isRunning ? 'Agent Processing...' : 'Run Autonomous Agent'}
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{id}</h1>
              <StatusBadge status={currentStatus} size="md" />
            </div>
            <p className="text-sm font-medium text-zinc-700 mt-1.5">{caseData?.customerGoal}</p>
          </div>
        </div>

        {/* Metadata pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2 text-zinc-600">
            <User className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Customer</span>
              <span className="font-semibold text-zinc-800">{caseData?.customerId || 'CUST-9001'} (VIP)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-600">
            <Package className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Order ID</span>
              <span className="font-semibold text-zinc-800">{caseData?.orderId || 'ORD-88219'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-600">
            <Calendar className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Delivered</span>
              <span className="font-semibold text-zinc-800">4 days ago (Eligible)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-600">
            <Shield className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Active Policy</span>
              <span className="font-semibold text-zinc-800">POL-REPLACE-01 / REFUND-01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Agent Journey; Right = Evidence & Chaos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Timeline — 2 cols */}
        <div className="lg:col-span-2">
          <AgentJourney events={events} isRunning={isRunning} />
        </div>

        {/* Evidence & Chaos — 1 col */}
        <div className="space-y-6">
          <EvidencePanel evidence={caseData?.evidence || {}} outcome={caseData?.finalOutcome} />
          <ChaosControls />
        </div>
      </div>
    </div>
  );
}
