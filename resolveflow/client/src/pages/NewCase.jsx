import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { casesApi } from '../services/api';

export default function NewCase() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: 'CUST-9001',
    orderId: 'ORD-88219',
    category: 'DAMAGED_ITEM',
    priority: 'HIGH',
    customerGoal: 'My laptop arrived with a cracked screen. I want a replacement or refund.',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await casesApi.create(formData);
      navigate(`/cases/${created.caseId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link
        to="/cases"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-8">
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-zinc-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Submit Customer Resolution Request</h1>
            <p className="text-xs text-zinc-500 mt-0.5">The autonomous agent will ingest, investigate, and resolve this goal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Customer ID</label>
              <input
                type="text"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Order ID</label>
              <input
                type="text"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-purple-500"
              >
                <option value="DAMAGED_ITEM">Damaged Item On Delivery</option>
                <option value="WRONG_ITEM">Wrong Item Received</option>
                <option value="NOT_RECEIVED">Item Not Received</option>
                <option value="RETURN_REQUEST">Standard Return Request</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-purple-500"
              >
                <option value="HIGH">High (VIP / Defect)</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Customer Goal / Complaint</label>
            <textarea
              rows={4}
              value={formData.customerGoal}
              onChange={(e) => setFormData({ ...formData, customerGoal: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-purple-500 leading-relaxed"
              placeholder="Describe the complaint or desired resolution in natural language..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm shadow-purple-500/20 active:scale-[0.99] disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Creating Case...' : 'Submit to Autonomous Resolution Engine'}
          </button>
        </form>
      </div>
    </div>
  );
}
