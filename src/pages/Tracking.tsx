import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Timeline } from '@/components/Shared';
import { Check, Clock, Heart, Droplet, Building2, MapPin, Phone, ChevronRight, Users, Zap, ShieldCheck } from 'lucide-react';

export function Tracking() {
  const { activeRequest, setView, updateRequestStatus } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [donorResponded, setDonorResponded] = useState(false);
  const [fulfilled, setFulfilled] = useState(false);

  useEffect(() => {
    if (!activeRequest) return;
    const timer = setInterval(() => {
      setElapsed(Date.now() - activeRequest.createdAt);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeRequest]);

  if (!activeRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">No active request.</p>
        <button onClick={() => setView('request-form')} className="btn-primary mt-4">Create Request</button>
      </div>
    );
  }

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleDonorResponse = () => {
    setDonorResponded(true);
    updateRequestStatus(activeRequest.id, 'DONOR_RESPONDING', {
      respondingDonors: 1,
      respondingDonorNames: ['Volunteer donor'],
    });
  };

  const handleFulfill = () => {
    setFulfilled(true);
    updateRequestStatus(activeRequest.id, 'FULFILLED', {
      respondingDonors: 3,
      respondingDonorNames: ['Volunteer donor', 'Priya N.', 'Aman P.'],
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-ink-400">{activeRequest.id}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-700">
            <Clock className="w-4 h-4 text-primary-500" />
            {timeStr}
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Request Tracking</h1>
        <p className="mt-2 text-sm text-ink-500">Time since request: {timeStr}</p>
      </div>

      {/* Request Summary */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
            {activeRequest.bloodGroup}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-900">{activeRequest.component} · {activeRequest.unitsRequired} units</div>
            <div className="text-xs text-ink-500">{activeRequest.patientName}</div>
          </div>
          <span className={`badge ${
            activeRequest.urgency === 'Critical' ? 'bg-primary-100 text-primary-700' :
            activeRequest.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {activeRequest.urgency.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-ink-600">
            <Building2 className="w-4 h-4 text-ink-400" />
            {activeRequest.hospital}
          </div>
          <div className="flex items-center gap-2 text-ink-600">
            <MapPin className="w-4 h-4 text-ink-400" />
            {activeRequest.hospitalLocation}
          </div>
          <div className="flex items-center gap-2 text-ink-600">
            <Phone className="w-4 h-4 text-ink-400" />
            {activeRequest.contactNumber}
          </div>
          <div className="flex items-center gap-2 text-ink-600">
            <Droplet className="w-4 h-4 text-ink-400" />
            {activeRequest.bloodGroup} · {activeRequest.component}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-semibold text-ink-700 mb-4">Progress Timeline</h2>
        <Timeline status={fulfilled ? 'FULFILLED' : donorResponded ? 'DONOR_RESPONDING' : 'DONORS_NOTIFIED'} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <Users className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
          <div className="font-display text-xl font-bold text-ink-900">{activeRequest.notifiedDonors}</div>
          <div className="text-xs text-ink-400">Notified</div>
        </div>
        <div className="card p-4 text-center">
          <Heart className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <div className="font-display text-xl font-bold text-ink-900">
            {fulfilled ? 3 : donorResponded ? 1 : 0}
          </div>
          <div className="text-xs text-ink-400">Responded</div>
        </div>
        <div className="card p-4 text-center">
          <Droplet className="w-5 h-5 text-accent-500 mx-auto mb-1" />
          <div className="font-display text-xl font-bold text-ink-900">
            {fulfilled ? activeRequest.unitsRequired : 0}
          </div>
          <div className="text-xs text-ink-400">Units Secured</div>
        </div>
      </div>

      {/* Fulfilled State */}
      {fulfilled ? (
        <div className="card-elevated p-6 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-accent-600" fill="currentColor" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">REQUEST FULFILLED</h2>
          <p className="text-sm text-ink-500 mb-4">All units secured. Thank you to all donors who responded.</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-ink-50">
              <div className="font-display text-lg font-bold text-ink-900">3</div>
              <div className="text-xs text-ink-400">Donors responded</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-50">
              <div className="font-display text-lg font-bold text-ink-900">{activeRequest.unitsRequired}</div>
              <div className="text-xs text-ink-400">Units secured</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-50">
              <div className="font-display text-lg font-bold text-ink-900">{timeStr}</div>
              <div className="text-xs text-ink-400">Total time</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-accent-50 border border-accent-100 mb-4">
            <div className="text-xs text-ink-500 mb-2">Responding Donors</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Volunteer donor', 'Priya N.', 'Aman P.'].map((name) => (
                <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-ink-700 border border-accent-200">
                  <Check className="w-3 h-3 text-accent-600" />
                  {name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink-400">Request metrics reflect live operational activity and response timing.</p>

          <button onClick={() => setView('hospital-dashboard')} className="btn-secondary mt-4">
            View in Command Center
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : !donorResponded ? (
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-500 animate-pulse-soft" />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-800">Waiting for donor responses</div>
              <div className="text-xs text-ink-500 mt-0.5">
                {activeRequest.notifiedDonors} donors have been notified. Simulate a donor accepting this request below.
              </div>
            </div>
          </div>
          <button onClick={handleDonorResponse} className="btn-primary w-full text-base py-3.5">
            <Heart className="w-5 h-5" />
            Simulate Donor Acceptance
          </button>
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-800">Donor responded</div>
              <div className="text-xs text-ink-500 mt-0.5">
                A volunteer donor has accepted the request. Mark the request as fulfilled once blood is secured at the hospital.
              </div>
            </div>
          </div>
          <button onClick={handleFulfill} className="btn-success w-full text-base py-3.5">
            <Check className="w-5 h-5" />
            Mark Request Fulfilled
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-ink-300" />
        <span className="text-[11px] text-ink-400">Your personal information is protected.</span>
      </div>
    </div>
  );
}
