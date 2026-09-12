import React, { useState } from 'react';
import { useCreateCase, useRunAgent } from '../hooks/useCases';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  PlusCircle,
  Bot,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Play,
  Layers
} from 'lucide-react';

export const CreateCasePage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    customerId: 'cust_101',
    orderId: 'ord_5001',
    customerGoal: 'My laptop arrived damaged. I want a replacement.'
  });

  const [simulateFailure, setSimulateFailure] = useState(true);
  const [errors, setErrors] = useState({});
  const [successCase, setSuccessCase] = useState(null);
  const [agentRunResult, setAgentRunResult] = useState(null);

  const createCaseMutation = useCreateCase();
  const runAgentMutation = useRunAgent();

  const validate = () => {
    const newErrors = {};
    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required';
    }
    if (!formData.orderId.trim()) {
      newErrors.orderId = 'Order ID is required';
    }
    if (!formData.customerGoal.trim()) {
      newErrors.customerGoal = 'Customer goal or complaint description is required';
    } else if (formData.customerGoal.trim().length < 10) {
      newErrors.customerGoal = 'Please provide a detailed goal description (at least 10 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const created = await createCaseMutation.mutateAsync(formData);
      setSuccessCase(created);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to create case. Please try again.' });
    }
  };

  const handleTriggerAgent = async () => {
    if (!successCase) return;
    try {
      const result = await runAgentMutation.mutateAsync({
        caseId: successCase.id,
        simulateFailure
      });
      setAgentRunResult(result);
    } catch (err) {
      setErrors({ agent: err.message || 'Failed to initiate agent execution.' });
    }
  };

  const sampleGoals = [
    {
      label: 'Primary Demo: Damaged Laptop Replacement',
      goal: 'My laptop arrived damaged. I want a replacement.',
      cust: 'cust_101',
      ord: 'ord_5001'
    },
    {
      label: 'Order Not Delivered Refund Inquiry',
      goal: 'My order has not arrived past the delivery SLA window. I want a refund.',
      cust: 'cust_102',
      ord: 'ord_5002'
    },
    {
      label: 'Warranty Coverage Inquiry',
      goal: 'My screen flickering issue should be covered under 1-year warranty.',
      cust: 'cust_103',
      ord: 'ord_5003'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('/cases')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Button>
        <Badge variant="purple">POST /api/cases Contract</Badge>
      </div>

      {!successCase ? (
        <Card className="space-y-6 shadow-apple">
          <div className="border-b border-border/80 pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary-600" />
              <h1 className="text-lg font-bold tracking-tight text-dark">Create Customer Resolution Case</h1>
            </div>
            <p className="text-xs text-dark-muted">
              Submit a customer goal to initiate deterministic investigation and autonomous agent resolution.
            </p>
          </div>

          {/* Quick Preset Pickers */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-dark-secondary">
              Quick Preset Scenarios (Click to Fill):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleGoals.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setFormData({
                      customerId: sample.cust,
                      orderId: sample.ord,
                      customerGoal: sample.goal
                    })
                  }
                  className="p-2.5 rounded-card-sm border border-border bg-surface-subtle hover:bg-primary-50 hover:border-primary-200 text-left transition-all text-xs"
                >
                  <span className="font-semibold text-primary-700 block truncate">{sample.label}</span>
                  <span className="text-[11px] text-dark-muted truncate block mt-0.5">{sample.goal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-card-sm text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.form}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Select Customer"
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                error={errors.customerId}
              >
                <option value="cust_101">Sarah Connor (cust_101 • VIP Tier)</option>
                <option value="cust_102">John Doe (cust_102 • Standard)</option>
                <option value="cust_103">Enterprise User (cust_103 • Pro)</option>
              </Select>

              <Select
                label="Target Order"
                required
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                error={errors.orderId}
              >
                <option value="ord_5001">ord_5001 • MacBook Pro M3 ($1,999.00)</option>
                <option value="ord_5002">ord_5002 • iPhone 15 Pro ($1,199.00)</option>
                <option value="ord_5003">ord_5003 • iPad Pro 12.9 ($1,099.00)</option>
              </Select>
            </div>

            <Textarea
              label="Customer Goal / Complaint"
              required
              rows={4}
              value={formData.customerGoal}
              onChange={(e) => setFormData({ ...formData, customerGoal: e.target.value })}
              error={errors.customerGoal}
              helperText="Describe the exact complaint or outcome requested by the customer."
              placeholder="e.g. My laptop arrived damaged. I want a replacement."
            />

            <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={() => onNavigate('/cases')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={createCaseMutation.isPending}
                className="shadow-sm"
              >
                {createCaseMutation.isPending ? (
                  <>
                    <Bot className="w-4 h-4 animate-spin" />
                    <span>Creating Case...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Resolution Case</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* Success & Autonomous Agent Trigger Card */
        <Card className="space-y-6 shadow-apple border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-surface">
          <div className="flex items-center gap-3 border-b border-emerald-200/80 pb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-dark">Case Created Successfully!</h2>
              <p className="text-xs text-dark-muted font-mono">Case ID: {successCase.caseNumber || successCase.id}</p>
            </div>
          </div>

          <div className="p-4 bg-surface rounded-card-sm border border-border space-y-2 text-xs">
            <div className="flex justify-between text-dark-muted">
              <span>Customer: <strong className="text-dark">{successCase.customerId}</strong></span>
              <span>Order: <strong className="text-dark">{successCase.orderId}</strong></span>
            </div>
            <p className="text-dark font-medium leading-relaxed">
              "{successCase.customerGoal}"
            </p>
          </div>

          {/* Agent Trigger Section */}
          <div className="p-4 rounded-card-sm bg-purple-50/70 border border-primary-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-semibold text-dark">Trigger Autonomous Agent Execution</h3>
              </div>
              <Badge variant="purple">POST /api/agent/run</Badge>
            </div>

            <p className="text-xs text-dark-secondary leading-relaxed">
              Start closed-loop agentic tool investigation, failure detection, and autonomous replanning on this case.
            </p>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span>Simulate Inventory Stock Depletion (Triggers Replan to Refund)</span>
              </label>
            </div>

            {!agentRunResult ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleTriggerAgent}
                disabled={runAgentMutation.isPending}
                className="w-full shadow-md"
              >
                {runAgentMutation.isPending ? (
                  <>
                    <Bot className="w-4 h-4 animate-spin" />
                    <span>Initiating Agent Execution...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Autonomous Agent</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-card-sm space-y-2 text-xs text-emerald-900">
                <div className="flex items-center justify-between font-bold">
                  <span>Agent Execution Initiated!</span>
                  <Badge variant="success">Run ID: {agentRunResult.runId}</Badge>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Agent run status: <strong>{agentRunResult.status}</strong>. Live events are now streaming on the Dashboard.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate('/cases')}>
              View All Cases
            </Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
