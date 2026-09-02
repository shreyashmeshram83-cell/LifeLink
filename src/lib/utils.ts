import type { RequestStatus, TimelineStep } from '@/types';

export function generateRequestId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LL-${year}-${random}`;
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getTimeline(status: RequestStatus): TimelineStep[] {
  const steps: TimelineStep[] = [
    { label: 'Emergency', done: true },
    { label: 'Verified', done: true },
    { label: 'AI Matched', done: true },
    { label: 'Donors Notified', done: true },
    { label: 'Donor Accepted', done: true },
    { label: 'Fulfilled', done: true },
  ];

  const order: RequestStatus[] = [
    'VERIFYING',
    'VERIFIED',
    'MATCHING',
    'DONORS_NOTIFIED',
    'DONOR_RESPONDING',
    'FULFILLED',
  ];
  const currentIdx = order.indexOf(status);

  const doneMap: Record<string, boolean> = {
    'Emergency': true,
    'Verified': currentIdx >= 1,
    'AI Matched': currentIdx >= 2,
    'Donors Notified': currentIdx >= 3,
    'Donor Accepted': currentIdx >= 4,
    'Fulfilled': currentIdx >= 5,
  };

  return steps.map((s) => ({ ...s, done: doneMap[s.label] ?? false }));
}

export function getStatusColor(status: RequestStatus): string {
  const colors: Record<RequestStatus, string> = {
    VERIFYING: 'bg-amber-100 text-amber-700',
    VERIFIED: 'bg-blue-100 text-blue-700',
    MATCHING: 'bg-purple-100 text-purple-700',
    DONORS_NOTIFIED: 'bg-indigo-100 text-indigo-700',
    DONOR_RESPONDING: 'bg-teal-100 text-teal-700',
    FULFILLED: 'bg-accent-100 text-accent-700',
  };
  return colors[status] ?? 'bg-ink-100 text-ink-600';
}

export function getUrgencyColor(urgency: string): string {
  const colors: Record<string, string> = {
    Critical: 'bg-primary-100 text-primary-700',
    Urgent: 'bg-orange-100 text-orange-700',
    Normal: 'bg-blue-100 text-blue-700',
  };
  return colors[urgency] ?? 'bg-ink-100 text-ink-600';
}
