'use client';

import { CheckIcon, Zap } from 'lucide-react';

interface SpecRow {
  label: string;
  value: string;
  unit?: string;
}

interface TechnicalSpecsProps {
  title?: string;
  specs: SpecRow[];
}

export function TechnicalSpecs({ title = 'Technical Specifications', specs }: TechnicalSpecsProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="glass-premium overflow-hidden rounded-[2.5rem] border-white/5 bg-white/[0.01]">
       <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <Zap className="size-4 text-brand" />
             <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">{title}</h4>
          </div>
       </div>
       <div className="divide-y divide-white/5">
          {specs.map((spec, i) => (
             <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 hover:bg-white/[0.02] transition-colors group gap-4">
                <div className="flex items-center gap-3">
                   <CheckIcon className="size-3 text-brand/40 group-hover:text-brand transition-colors" />
                   <span className="text-sm font-medium text-[var(--color-text-secondary)] opacity-80">{spec.label}</span>
                </div>
                <div className="sm:text-right">
                   <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                      {spec.value}
                      {spec.unit && <span className="ml-1 text-[10px] opacity-40 font-normal">{spec.unit}</span>}
                   </span>
                </div>
             </div>
          ))}
       </div>
       <div className="p-6 bg-brand/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-center opacity-40">
             Certified Industrial Grade Accuracy
          </p>
       </div>
    </div>
  );
}
