import { useApp } from '@/context/AppContext';
import { Activity, Shield, Users, Heart, Bell, CheckCircle2, TrendingUp, Droplet, ArrowRight, UserCog } from 'lucide-react';

export function AdminDashboard() {
  const { requests, donors, hospitals, notifications, user, setView } = useApp();

  const activeRequests = requests.filter((r) => r.status !== 'FULFILLED');
  const fulfilledRequests = requests.filter((r) => r.status === 'FULFILLED');
  const availableDonors = donors.filter((d) => d.availability === 'Available').length;
  const avgReliability = Math.round(
    donors.reduce((sum, donor) => sum + donor.reliabilityScore, 0) / donors.length
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 mb-1">
            <Shield className="w-4 h-4" />
            ADMIN CONTROL PANEL
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-900">System Administration</h1>
        </div>
        <div className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-700 font-medium">
          Signed in as {user?.name ?? 'Administrator'}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard icon={<Activity className="w-5 h-5" />} label="Active Requests" value={String(activeRequests.length)} color="primary" />
        <KPICard icon={<Users className="w-5 h-5" />} label="Active Donors" value={String(availableDonors)} color="blue" />
        <KPICard icon={<Heart className="w-5 h-5" />} label="Fulfilled" value={String(fulfilledRequests.length)} color="accent" />
        <KPICard icon={<TrendingUp className="w-5 h-5" />} label="Reliability" value={`${avgReliability}%`} color="indigo" />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-ink-900">Operational Overview</h2>
            <UserCog className="w-5 h-5 text-ink-400" />
          </div>

          <div className="space-y-4">
            <OverviewRow label="Verified hospitals" value={String(hospitals.length || 5)} accent="Hospitals" />
            <OverviewRow label="Community notifications" value={String(notifications.length)} accent="Live" />
            <OverviewRow label="Pending donor responses" value={String(requests.filter((r) => r.status === 'DONOR_RESPONDING').length)} accent="Monitoring" />
            <OverviewRow label="Critical requests" value={String(requests.filter((r) => r.urgency === 'Critical').length)} accent="Priority" />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-ink-900">Admin Alerts</h2>
            <Bell className="w-5 h-5 text-accent-600" />
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl border border-ink-100 bg-ink-50 p-3">
                <div className="text-xs font-semibold text-primary-600">{item.title}</div>
                <div className="text-xs text-ink-500 mt-1">{item.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-ink-900">System Controls</h2>
          <CheckCircle2 className="w-5 h-5 text-accent-600" />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <AdminActionCard
            title="View all requests"
            text="Monitor emergency blood demand across all hospitals."
            onClick={() => setView('hospital-dashboard')}
          />
          <AdminActionCard
            title="Blood inventory"
            text="Review current inventory and shortages by blood group."
            onClick={() => setView('inventory')}
          />
          <AdminActionCard
            title="Nearby emergencies"
            text="See live geographic locations of nearby critical cases."
            onClick={() => setView('nearby-emergency')}
          />
        </div>
      </div>
    </div>
  );
}

function OverviewRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-3 py-2.5">
      <span className="text-sm text-ink-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600">{accent}</span>
        <span className="font-display text-xl font-bold text-ink-900">{value}</span>
      </div>
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
      <div className={`w-9 h-9 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs text-ink-400 font-medium">{label}</div>
    </div>
  );
}

function AdminActionCard({ title, text, onClick }: { title: string; text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left hover:shadow-soft transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
          <Droplet className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-ink-400" />
      </div>
      <div className="text-sm font-bold text-ink-900">{title}</div>
      <div className="text-xs text-ink-500 mt-1">{text}</div>
    </button>
  );
}
