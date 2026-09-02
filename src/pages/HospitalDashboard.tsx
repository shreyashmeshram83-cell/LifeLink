import { useApp } from '@/context/AppContext';
import { StatusBadge, Timeline, ElapsedTime } from '@/components/Shared';
import { Activity, Users, Heart, CheckCircle2, Droplet, ChevronRight, Stethoscope, Zap } from 'lucide-react';
import type { EmergencyRequest } from '@/types';

export function HospitalDashboard() {
  const { requests, setView } = useApp();

  const activeRequests = requests.filter((r) => r.status !== 'FULFILLED');
  const fulfilledRequests = requests.filter((r) => r.status === 'FULFILLED');
  const totalMatched = requests.reduce((sum, r) => sum + r.matchedDonors, 0);
  const totalResponding = requests.reduce((sum, r) => sum + r.respondingDonors, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 mb-1">
            <Stethoscope className="w-4 h-4" />
            EMERGENCY COMMAND CENTER
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-900">Emergency Command Center</h1>
        </div>
        <button onClick={() => setView('request-form')} className="btn-primary self-start sm:self-auto">
          <Droplet className="w-4 h-4" fill="white" />
          New Emergency Request
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard icon={<Activity className="w-5 h-5" />} label="Active Requests" value={String(activeRequests.length)} color="primary" />
        <KPICard icon={<Users className="w-5 h-5" />} label="Matched Donors" value={String(totalMatched)} color="blue" />
        <KPICard icon={<Heart className="w-5 h-5" />} label="Responding Donors" value={String(totalResponding)} color="accent" />
        <KPICard icon={<CheckCircle2 className="w-5 h-5" />} label="Fulfilled Requests" value={String(fulfilledRequests.length)} color="indigo" />
      </div>

      {/* Live Emergency Requests */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink-900">Live Emergency Requests</h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
          LIVE
        </span>
      </div>

      <div className="space-y-4">
        {activeRequests.map((req) => (
          <RequestCard key={req.id} req={req} />
        ))}
      </div>

      {/* Fulfilled Requests */}
      {fulfilledRequests.length > 0 && (
        <>
          <h2 className="font-display text-xl font-bold text-ink-900 mt-8 mb-4">Fulfilled Requests</h2>
          <div className="space-y-4">
            {fulfilledRequests.map((req) => (
              <RequestCard key={req.id} req={req} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function KPICard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: 'primary' | 'blue' | 'accent' | 'indigo' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    blue: 'bg-blue-50 text-blue-600',
    accent: 'bg-accent-50 text-accent-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs text-ink-400 font-medium">{label}</div>
    </div>
  );
}

function RequestCard({ req }: { req: EmergencyRequest }) {
  const { setActiveRequest, setView } = useApp();

  const handleTrack = () => {
    setActiveRequest(req);
    setView('tracking');
  };

  return (
    <div className="card p-5 hover:shadow-soft transition-all">
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
            {req.bloodGroup}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink-900">{req.component} · {req.unitsRequired} units</span>
              {req.urgency === 'Critical' && (
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary-600">
                  <Zap className="w-3 h-3" /> CRITICAL
                </span>
              )}
            </div>
            <div className="text-xs text-ink-500 mt-0.5">
              {req.id} · {req.patientName} · {req.hospital}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={req.status} />
          <ElapsedTime createdAt={req.createdAt} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-ink-50 text-center">
          <div className="text-sm font-bold text-ink-800">{req.matchedDonors}</div>
          <div className="text-[10px] text-ink-400">Matched</div>
        </div>
        <div className="p-2.5 rounded-lg bg-ink-50 text-center">
          <div className="text-sm font-bold text-ink-800">{req.notifiedDonors}</div>
          <div className="text-[10px] text-ink-400">Notified</div>
        </div>
        <div className="p-2.5 rounded-lg bg-ink-50 text-center">
          <div className={`text-sm font-bold ${req.respondingDonors > 0 ? 'text-accent-600' : 'text-ink-400'}`}>
            {req.respondingDonors}
          </div>
          <div className="text-[10px] text-ink-400">Responding</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <Timeline status={req.status} />
      </div>

      {/* Responding Donors */}
      {req.respondingDonorNames.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-accent-50 border border-accent-100">
          <div className="text-xs text-ink-500 mb-2">Responding Donors</div>
          <div className="flex flex-wrap gap-2">
            {req.respondingDonorNames.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-ink-700 border border-accent-200">
                <Heart className="w-3 h-3 text-accent-500" />
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      {req.status !== 'FULFILLED' && (
        <button onClick={handleTrack} className="btn-ghost w-full text-sm">
          Track Request
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
