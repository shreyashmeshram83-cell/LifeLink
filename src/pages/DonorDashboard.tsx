import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { donorRequestsForDashboard } from '@/data/mockData';
import { Heart, Droplet, MapPin, Zap, Check, X, Star, TrendingUp, Bell, ShieldCheck, Clock } from 'lucide-react';
import type { BloodGroup, Component, Urgency } from '@/types';

interface DonorRequest {
  id: string;
  bloodGroup: BloodGroup;
  component: Component;
  units: number;
  distanceKm: number;
  hospital: string;
  urgency: Urgency;
  patientName: string;
}

export function DonorDashboard() {
  const { currentDonor, updateDonorAvailability, notifications, user } = useApp();
  const [available, setAvailable] = useState(true);
  const [respondedRequests, setRespondedRequests] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

  const donor = currentDonor;
  const displayName = user?.name?.split(' ')[0] ?? donor.name.split(' ')[0];

  const handleAccept = (reqId: string) => {
    setRespondedRequests((prev) => [...prev, reqId]);
    setShowConfirmation(reqId);
    setTimeout(() => setShowConfirmation(null), 3000);
  };

  const handleDecline = (reqId: string) => {
    setRespondedRequests((prev) => [...prev, reqId]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">
          Good morning, {displayName} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-500">Here are your nearby emergency requests and donor stats.</p>
      </div>

      {/* Donor Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<Droplet className="w-5 h-5" />} label="Blood Group" value={donor.bloodGroup} color="primary" />
        <StatCard icon={<Heart className="w-5 h-5" />} label="Donations" value={String(donor.donations)} color="accent" />
        <StatCard icon={<Star className="w-5 h-5" />} label="Reliability" value={`${donor.reliabilityScore}%`} color="blue" />
        <StatCard icon={<Bell className="w-5 h-5" />} label="Nearby Requests" value={String(donorRequestsForDashboard.length)} color="indigo" />
      </div>

      {/* Availability Toggle */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              available ? 'bg-accent-100' : 'bg-ink-100'
            }`}>
              <Heart className={`w-6 h-6 ${available ? 'text-accent-600' : 'text-ink-400'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-ink-900">Available for Emergency Requests</div>
              <div className="text-xs text-ink-500">
                {available ? 'You will receive emergency alerts' : 'Emergency alerts are paused'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setAvailable(!available);
              updateDonorAvailability(donor.id, available ? 'Unavailable' : 'Available');
            }}
            className={`relative w-14 h-8 rounded-full transition-all ${
              available ? 'bg-accent-500' : 'bg-ink-200'
            }`}
          >
            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-soft transition-all ${
              available ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {showConfirmation && (
        <div className="card-elevated p-4 mb-6 border-accent-200 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink-900">Thank you. Your response has been sent to the hospital.</div>
              <div className="text-xs text-ink-500">Your status is now "Responded". The hospital will contact you with next steps.</div>
            </div>
          </div>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ink-800">Community alerts</h3>
            <span className="text-[10px] uppercase tracking-wide text-ink-400">Live</span>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-xl border border-ink-100 bg-ink-50 p-3">
                <div className="text-xs font-semibold text-primary-600">{item.title}</div>
                <div className="text-xs text-ink-500 mt-1">{item.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Request Cards */}
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-ink-900 mb-1">Nearby Emergency Requests</h2>
        <p className="text-xs text-ink-500 mb-4">Requests matching your blood group and location</p>
      </div>

      <div className="space-y-4">
        {donorRequestsForDashboard.map((req) => {
          const isResponded = respondedRequests.includes(req.id);
          const isAccepted = showConfirmation === req.id || (isResponded && !showConfirmation);

          return (
            <div key={req.id} className="card p-5">
              {/* Urgency Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink-400">{req.id}</span>
                </div>
                <span className={`badge ${
                  req.urgency === 'Critical' ? 'bg-primary-100 text-primary-700' :
                  req.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {req.urgency === 'Critical' && <Zap className="w-3 h-3" />}
                  {req.urgency.toUpperCase()}
                </span>
              </div>

              {/* Request Details */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  {req.bloodGroup}
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-ink-900">{req.component} · {req.units} units</div>
                  <div className="flex items-center gap-2 text-xs text-ink-500 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {req.distanceKm} km · {req.hospital}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isResponded ? (
                <div className={`p-3 rounded-xl text-center text-sm font-semibold ${
                  isAccepted ? 'bg-accent-50 text-accent-700' : 'bg-ink-50 text-ink-500'
                }`}>
                  {isAccepted ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Responded — Hospital notified
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <X className="w-4 h-4" /> Marked as not available
                    </span>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="btn-secondary py-3"
                  >
                    <X className="w-4 h-4" />
                    Not Available
                  </button>
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="btn-success py-3"
                  >
                    <Heart className="w-4 h-4" />
                    I Can Donate
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Donor Stats Detail */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent-600" />
            <span className="text-xs font-semibold text-ink-600">Donation History</span>
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{donor.donations}</div>
          <div className="text-xs text-ink-400">Total donations</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-ink-600">Last Donation</span>
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{donor.lastDonationMonths}mo</div>
          <div className="text-xs text-ink-400">Eligible: {donor.eligible ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div className="mt-6 card p-4 bg-ink-50/50">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-ink-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-ink-700">Your personal information is protected</div>
            <div className="text-xs text-ink-500 mt-0.5">
              Your phone number and full name are only shared with the verifying hospital after you accept a request. Other donors and requesters cannot see your contact details.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: 'primary' | 'accent' | 'blue' | 'indigo' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <div className="card p-4">
      <div className={`w-9 h-9 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="font-display text-xl font-bold text-ink-900">{value}</div>
      <div className="text-xs text-ink-400">{label}</div>
    </div>
  );
}
