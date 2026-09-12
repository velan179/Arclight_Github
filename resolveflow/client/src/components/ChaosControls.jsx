import React, { useState } from 'react';
import { Flame, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { enterpriseApi } from '../services/api';

export default function ChaosControls({ onChaosChange }) {
  const [stockout, setStockout] = useState(true);
  const [gatewayError, setGatewayError] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleToggleStockout = async () => {
    const next = !stockout;
    setStockout(next);
    await enterpriseApi.setChaos({ inventoryOutage: next, actionExecutionError: gatewayError });
    setStatusMsg(`Inventory Outage: ${next ? 'ENABLED (Forces Re-plan)' : 'DISABLED (Replacement in stock)'}`);
    if (onChaosChange) onChaosChange({ inventoryOutage: next, actionExecutionError: gatewayError });
  };

  const handleToggleGateway = async () => {
    const next = !gatewayError;
    setGatewayError(next);
    await enterpriseApi.setChaos({ inventoryOutage: stockout, actionExecutionError: next });
    setStatusMsg(`Gateway Timeout: ${next ? 'ENABLED (Forces Escalation)' : 'DISABLED'}`);
    if (onChaosChange) onChaosChange({ inventoryOutage: stockout, actionExecutionError: next });
  };

  const handleReset = async () => {
    setStockout(true);
    setGatewayError(false);
    await enterpriseApi.setChaos({ inventoryOutage: true, actionExecutionError: false });
    setStatusMsg('Chaos reset to Default Demo Scenario (Stockout active).');
    if (onChaosChange) onChaosChange({ inventoryOutage: true, actionExecutionError: false });
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Chaos Simulator</h3>
            <p className="text-[11px] text-zinc-400">Trigger failure states to observe real-time agent adaptation</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 font-medium transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-3">
        {/* Toggle 1: Inventory stockout */}
        <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 cursor-pointer hover:bg-zinc-50 transition-colors">
          <div className="pr-3">
            <span className="text-xs font-semibold text-zinc-800 block">Simulate Warehouse Stockout</span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              Forces inventory = 0, verifying autonomous re-planning to Refund
            </span>
          </div>
          <input
            type="checkbox"
            checked={stockout}
            onChange={handleToggleStockout}
            className="w-4 h-4 text-purple-600 rounded border-zinc-300 focus:ring-purple-500"
          />
        </label>

        {/* Toggle 2: Gateway error */}
        <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 cursor-pointer hover:bg-zinc-50 transition-colors">
          <div className="pr-3">
            <span className="text-xs font-semibold text-zinc-800 block">Simulate Gateway Error</span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              Forces payment timeout, verifying safe escalation to Human Tier 2
            </span>
          </div>
          <input
            type="checkbox"
            checked={gatewayError}
            onChange={handleToggleGateway}
            className="w-4 h-4 text-purple-600 rounded border-zinc-300 focus:ring-purple-500"
          />
        </label>
      </div>

      {statusMsg && (
        <p className="mt-3 text-[11px] font-mono text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
          {statusMsg}
        </p>
      )}
    </div>
  );
}
