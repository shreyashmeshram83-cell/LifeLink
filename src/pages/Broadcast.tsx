import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Zap, Check, Bell, Users, Heart, ChevronRight, Radio } from 'lucide-react';

export function Broadcast() {
  const { activeRequest, setView, updateRequestStatus } = useApp();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!activeRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">No active request.</p>
        <button onClick={() => setView('request-form')} className="btn-primary mt-4">Create Request</button>
      </div>
    );
  }

  const highPriority = 21;
  const nearby = 12;
  const available = 6;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      updateRequestStatus(activeRequest.id, 'DONORS_NOTIFIED', {
        notifiedDonors: highPriority,
      });
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
          <Radio className="w-4 h-4" />
          EMERGENCY BROADCAST
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Notify Matched Donors</h1>
        <p className="mt-2 text-sm text-ink-500">Send emergency alerts to all matched donors. In-app notifications are used for active donor communication.</p>
      </div>

      {/* Request Summary */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
            {activeRequest.bloodGroup}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-900">{activeRequest.component} · {activeRequest.unitsRequired} units</div>
            <div className="text-xs text-ink-500">{activeRequest.hospital} · {activeRequest.id}</div>
          </div>
        </div>
      </div>

      {/* Donor Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-primary-600" />
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{highPriority}</div>
          <div className="text-xs text-ink-400 font-medium">High Priority</div>
        </div>
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{nearby}</div>
          <div className="text-xs text-ink-400 font-medium">Nearby</div>
        </div>
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center mx-auto mb-2">
            <Heart className="w-5 h-5 text-accent-600" />
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{available}</div>
          <div className="text-xs text-ink-400 font-medium">Available Now</div>
        </div>
      </div>

      {/* Notification Simulation */}
      {!sent && !sending && (
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-800">Ready to broadcast</div>
              <div className="text-xs text-ink-500 mt-0.5">
                {highPriority} donors will receive an emergency alert with request details. Donor phone numbers are never exposed publicly.
              </div>
            </div>
          </div>
          <button onClick={handleSend} className="btn-primary w-full text-base py-3.5">
            <Zap className="w-5 h-5" />
            Send Emergency Alert
          </button>
        </div>
      )}

      {sending && (
        <div className="card p-8 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-primary-100 animate-pulse-ring" />
            <div className="relative w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center">
              <Radio className="w-8 h-8 text-white animate-pulse-soft" />
            </div>
          </div>
          <div className="text-sm font-semibold text-ink-800">Sending emergency alerts...</div>
          <div className="text-xs text-ink-400 mt-1">Notifying {highPriority} matched donors</div>
        </div>
      )}

      {sent && (
        <div className="card p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink-900">Emergency alert sent</div>
              <div className="text-xs text-ink-500">Donors are being notified now</div>
            </div>
          </div>

          <div className="space-y-2.5 mb-6">
            <NotificationStep icon={<Check className="w-4 h-4" />} text="Emergency alert sent" done />
            <NotificationStep icon={<Bell className="w-4 h-4" />} text={`${highPriority} donors notified`} done />
            <NotificationStep icon={<Heart className="w-4 h-4" />} text="4 donors responded" done pending />
          </div>

          <button onClick={() => setView('tracking')} className="btn-success w-full text-base py-3.5">
            <Check className="w-5 h-5" />
            Track Request Status
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-ink-400 text-center">
        Community alerts are sent in-app to verified donors. SMS and WhatsApp integrations can be added in production.
      </p>
    </div>
  );
}

function NotificationStep({ icon, text, done, pending }: { icon: React.ReactNode; text: string; done: boolean; pending?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
        done ? (pending ? 'bg-amber-100 text-amber-600' : 'bg-accent-100 text-accent-600') : 'bg-ink-100 text-ink-400'
      }`}>
        {done ? icon : <span className="w-2 h-2 rounded-full bg-ink-300" />}
      </div>
      <span className={`text-sm font-medium ${done ? 'text-ink-800' : 'text-ink-400'}`}>{text}</span>
      {pending && <span className="text-xs text-amber-500 font-semibold animate-pulse-soft">live</span>}
    </div>
  );
}
