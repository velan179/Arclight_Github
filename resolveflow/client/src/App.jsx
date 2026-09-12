import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import NewCase from './pages/NewCase';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-zinc-50/60 font-sans antialiased text-zinc-900">
        {/* Persistent Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CaseList />} />
            <Route path="/cases/new" element={<NewCase />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-purple-200 font-mono">404</p>
        <p className="mt-3 text-sm font-semibold text-zinc-700">Page not found</p>
        <p className="text-xs text-zinc-400 mt-1">The requested route does not exist.</p>
        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition-colors"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
