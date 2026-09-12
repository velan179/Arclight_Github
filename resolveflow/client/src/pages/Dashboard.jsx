import { useState, useEffect } from 'react';

/**
 * Dashboard.jsx — Foundation placeholder
 *
 * Owner: Member 1 (feature/member-1-ui)
 * This is the shared starting point. Member 1 will replace
 * this with the full Dashboard implementation.
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ── */}
      <header className="h-[60px] border-b border-zinc-100 flex items-center px-8 gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">R</span>
        </div>
        <span className="font-semibold text-zinc-900 tracking-tight">ResolveFlow</span>
        <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-primary-50 rounded-full text-primary-600">
          Foundation
        </span>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full text-center animate-fade-in">
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.442 2.798H4.24c-1.47 0-2.441-1.798-1.442-2.798L4.2 15.3" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            ResolveFlow
          </h1>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            Autonomous Customer Resolution Agent — PS5<br />
            Foundation scaffold ready. Member 1 owns this page.
          </p>

          {/* Agent lifecycle preview */}
          <div className="card mb-8 text-left">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Agent Lifecycle
            </p>
            <div className="space-y-2">
              {[
                ['GOAL RECEIVED',  'bg-purple-50 text-purple-700'],
                ['INVESTIGATING',  'bg-amber-50  text-amber-700'],
                ['DECIDING',      'bg-blue-50   text-blue-700'],
                ['ACTION',        'bg-indigo-50 text-indigo-700'],
                ['FAILURE ⚠',    'bg-red-50    text-red-700'],
                ['REPLANNING',    'bg-orange-50 text-orange-700'],
                ['VERIFICATION',  'bg-cyan-50   text-cyan-700'],
                ['RESOLVED ✓',   'bg-green-50  text-green-700'],
              ].map(([label, cls]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* API status */}
          <ApiStatus />
        </div>
      </main>
    </div>
  );
}

function ApiStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(d.success ? 'online' : 'error'))
      .catch(() => setStatus('offline'));
  }, []);

  const colors = {
    checking: 'text-zinc-400',
    online:   'text-green-600',
    offline:  'text-red-500',
    error:    'text-amber-600',
  };

  const labels = {
    checking: 'Checking API...',
    online:   '✓ API is online — http://localhost:5000/api/health',
    offline:  '✗ API offline — run: cd resolveflow/server && npm run dev',
    error:    '⚠ API responded with an error',
  };

  return (
    <p className={`text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </p>
  );
}
