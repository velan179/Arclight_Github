import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Plus, Search, Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { casesApi } from '../services/api';

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    casesApi
      .list()
      .then((data) => setCases(data || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const matchesSearch =
      c.caseId.toLowerCase().includes(search.toLowerCase()) ||
      c.customerGoal.toLowerCase().includes(search.toLowerCase()) ||
      c.orderId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Customer Cases</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage and inspect automated case resolution streams</p>
        </div>
        <Link
          to="/cases/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Submit New Case
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Case ID, Order, or Goal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'OPEN', 'RESOLVED', 'ESCALATED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === st
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-mono">Loading cases...</div>
        ) : filteredCases.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">No cases match the filter.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredCases.map((c) => (
              <div
                key={c.caseId}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      {c.caseId}
                    </span>
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-zinc-400 font-mono">Order: {c.orderId}</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-800">{c.customerGoal}</p>
                </div>

                <Link
                  to={`/cases/${c.caseId}`}
                  className="self-start sm:self-center px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-all shrink-0"
                >
                  Inspect Journey →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
