import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './index.css';

/**
 * App.jsx — Application shell
 *
 * Member 1 (feature/member-1-ui) owns the complete frontend.
 * Add new pages/routes here as the application grows.
 *
 * Current routes (foundation):
 *   /  → Dashboard placeholder
 *
 * Planned routes (Member 1 to implement):
 *   /cases          → Case list
 *   /cases/:id      → Case detail + Agent Journey
 *   /cases/new      → New case creation form
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary-200">404</p>
        <p className="mt-2 text-zinc-500">Page not found</p>
        <a href="/" className="mt-4 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
