import React from 'react';
import { ShieldCheck, UserCheck, PackageCheck, FileText, Boxes, CheckCircle, AlertOctagon } from 'lucide-react';

export default function EvidencePanel({ evidence = {}, outcome = null }) {
  const items = [
    {
      title: 'Customer Verification',
      status: evidence.customerVerified ? 'Verified' : 'Pending',
      isOk: evidence.customerVerified,
      icon: UserCheck,
      detail: 'Identity & VIP tier validated against enterprise directory',
    },
    {
      title: 'Order Status & Window',
      status: evidence.orderEligible ? 'Eligible (<30d)' : 'Pending',
      isOk: evidence.orderEligible,
      icon: PackageCheck,
      detail: 'Delivered 4 days ago. Well within 30-day resolution window',
    },
    {
      title: 'Policy Evaluation',
      status: evidence.policyMatched || 'POL-REPLACE-01',
      isOk: true,
      icon: FileText,
      detail: 'Auto-approved for hardware damage claim',
    },
    {
      title: 'Physical Inventory',
      status: evidence.inventoryAvailable ? 'In Stock' : 'Out of Stock (0 units)',
      isOk: evidence.inventoryAvailable,
      isWarning: !evidence.inventoryAvailable,
      icon: Boxes,
      detail: evidence.inventoryAvailable
        ? 'Available in central warehouse'
        : 'Triggered autonomous re-planning to 100% financial refund',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-100">
        <ShieldCheck className="w-5 h-5 text-purple-600" />
        <h3 className="text-sm font-bold text-zinc-900">Deterministic Evidence Chain</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-start gap-3 transition-colors hover:bg-zinc-50"
            >
              <div className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 shadow-2xs mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-zinc-800">{item.title}</h4>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      item.isWarning
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.isOk
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 leading-normal">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {outcome && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-900">
            <span className="font-bold">Sealed State Change: </span>
            <span>{outcome.summary}</span>
          </div>
        </div>
      )}
    </div>
  );
}
