import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Search,
  Wrench,
  BrainCircuit,
  Zap,
  AlertTriangle,
  Eye,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const eventTypeConfig = {
  GOAL_RECEIVED: { icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  INVESTIGATION: { icon: Search, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  TOOL_SELECTION: { icon: Wrench, color: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-200' },
  TOOL_EXECUTION: { icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  DECISION: { icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ACTION_STARTED: { icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ACTION_RESULT: { icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  FAILURE: { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  OBSERVATION: { icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  REPLAN: { icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  VERIFICATION: { icon: ShieldCheck, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  RESOLUTION: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

export default function AgentJourney({ events = [], isRunning = false }) {
  if (events.length === 0 && !isRunning) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto text-purple-600 mb-3">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-800">Ready for Autonomous Execution</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-1">
          Click "Run Autonomous Agent" to trigger the live investigation, failure observation, re-planning, and verification loop.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            Live Agent Journey
            {isRunning && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                Thinking & Acting
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Transparent event stream — Autonomous tool calls, failure detection, and deterministic verification.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
          {events.length} Events
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
        <AnimatePresence>
          {events.map((ev, index) => {
            const config = eventTypeConfig[ev.type] || eventTypeConfig.TOOL_EXECUTION;
            const Icon = config.icon;
            const isFailure = ev.status === 'FAILURE' || ev.type === 'FAILURE';
            const isResolution = ev.type === 'RESOLUTION';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="relative flex items-start gap-4"
              >
                {/* Node Icon on Timeline */}
                <div
                  className={`absolute -left-6 mt-1 w-6 h-6 rounded-full border flex items-center justify-center bg-white shadow-2xs ${config.border}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                {/* Event Card */}
                <div
                  className={`flex-1 rounded-xl p-4 border transition-all ${
                    isFailure
                      ? 'bg-rose-50/60 border-rose-200'
                      : isResolution
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-zinc-50/50 border-zinc-200/80 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                        {ev.type.replace('_', ' ')}
                      </span>
                      {ev.tool && (
                        <span className="text-xs font-mono font-medium text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                          {ev.tool}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }) : ''}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-800 leading-snug">{ev.summary}</p>

                  {/* Metadata / Safe Evidence Summary */}
                  {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-200/60 flex flex-wrap gap-2 text-xs font-mono text-zinc-600">
                      {ev.metadata.actionId && (
                        <span className="bg-white px-2 py-0.5 rounded border border-zinc-200">
                          Action: {ev.metadata.actionId}
                        </span>
                      )}
                      {ev.metadata.amount && (
                        <span className="bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold text-emerald-700">
                          ${ev.metadata.amount} USD
                        </span>
                      )}
                      {ev.metadata.policyId && (
                        <span className="bg-white px-2 py-0.5 rounded border border-zinc-200">
                          Policy: {ev.metadata.policyId}
                        </span>
                      )}
                      {ev.metadata.alternativeAction && (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-semibold">
                          Fallback: {ev.metadata.alternativeAction}
                        </span>
                      )}
                      {ev.metadata.verificationPassed !== undefined && (
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                          Verified: Passed
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isRunning && (
          <div className="relative flex items-center gap-3 pt-2 text-xs text-purple-600 font-medium">
            <div className="absolute -left-6 w-6 h-6 rounded-full border border-purple-300 bg-purple-50 flex items-center justify-center animate-spin">
              <RefreshCw className="w-3 h-3 text-purple-600" />
            </div>
            <span>Agent orchestrator deliberating next tool action...</span>
          </div>
        )}
      </div>
    </div>
  );
}
