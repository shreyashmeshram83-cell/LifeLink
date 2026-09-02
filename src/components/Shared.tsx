import type { RequestStatus } from '@/types';
import { getStatusColor, getTimeline } from '@/lib/utils';
import { Check, Clock } from 'lucide-react';

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {status === 'FULFILLED' && <Check className="w-3 h-3" />}
      {status === 'VERIFYING' && <Clock className="w-3 h-3 animate-pulse-soft" />}
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function Timeline({ status }: { status: RequestStatus }) {
  const steps = getTimeline(status);
  const currentIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step.label} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.done
                    ? isLast
                      ? 'bg-accent-500 text-white shadow-soft'
                      : 'bg-primary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-50 text-primary-600 border-2 border-primary-300 animate-pulse-soft'
                    : 'bg-ink-100 text-ink-400'
                }`}
              >
                {step.done ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-semibold text-center leading-tight ${
                  step.done ? 'text-ink-700' : 'text-ink-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-0.5 w-8 mx-0.5 -mt-4 rounded-full transition-all ${
                  step.done ? 'bg-primary-500' : 'bg-ink-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-ink-400 leading-relaxed ${className}`}>
      LifeLink is a prototype for emergency donor coordination. Blood compatibility, donor
      eligibility, transfusion decisions and medical care must be verified by authorized
      healthcare professionals.
    </p>
  );
}

export function ElapsedTime({ createdAt }: { createdAt: number }) {
  const elapsed = Date.now() - createdAt;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500">
      <Clock className="w-3 h-3" />
      {timeStr}
    </span>
  );
}
