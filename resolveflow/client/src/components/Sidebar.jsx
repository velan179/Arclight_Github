import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Inbox, PlusCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { healthApi } from '../services/api';

export default function Sidebar() {
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    healthApi
      .check()
      .then((data) => setApiOnline(data.status === 'ok'))
      .catch(() => setApiOnline(false));
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'All Cases', icon: Inbox },
    { to: '/cases/new', label: 'New Request', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white min-h-screen flex flex-col justify-between select-none">
      <div>
        {/* Logo and Brand */}
        <div className="h-16 border-b border-zinc-100 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-zinc-900 tracking-tight leading-none text-base">ResolveFlow</h1>
            <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase mt-0.5">Autonomous Engine</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">Workspace</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Info */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-medium text-zinc-700">API Backend</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">{apiOnline ? '5000 OK' : 'OFFLINE'}</span>
        </div>
        <p className="text-[11px] text-zinc-400 text-center mt-3 font-medium">PS5 • Track 3 — Smart Automation</p>
      </div>
    </aside>
  );
}
