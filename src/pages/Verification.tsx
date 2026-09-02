import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Building2, Check, ChevronRight, Droplet, MapPin, Phone, Clock } from 'lucide-react';

export function Verification() {
  const { activeRequest, setView, updateRequestStatus } = useApp();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!activeRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">No active request. Create one to begin.</p>
        <button onClick={() => setView('request-form')} className="btn-primary mt-4">Create Request</button>
      </div>
    );
  }

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      updateRequestStatus(activeRequest.id, 'VERIFIED');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Request Summary */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-ink-400">{activeRequest.id}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
            <Clock className="w-3 h-3" /> Pending Verification
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100 mb-4">
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

      {/* Verification Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            verified ? 'bg-accent-100' : 'bg-amber-50'
          }`}>
            <ShieldCheck className={`w-6 h-6 ${verified ? 'text-accent-600' : 'text-amber-500'}`} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">Hospital Verification</h2>
            <p className="text-xs text-ink-500">Operational verification flow for authorized hospital staff</p>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="space-y-3 mb-6">
          <VerificationStep
            label="Hospital Verified"
            done={verified}
            loading={verifying}
          />
          <VerificationStep
            label="Request Verified"
            done={verified}
            loading={verifying}
          />
          <VerificationStep
            label="Ready for donor matching"
            done={verified}
            loading={verifying}
          />
        </div>

        {!verified ? (
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn-primary w-full text-base py-3.5"
          >
            {verifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying request...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Verify Request
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setView('ai-matching')}
            className="btn-success w-full text-base py-3.5"
          >
            <Check className="w-5 h-5" />
            Proceed to AI Matching
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-400 text-center">
        This workflow represents authenticated hospital staff verification before donor matching proceeds.
      </p>
    </div>
  );
}

function VerificationStep({ label, done, loading }: { label: string; done: boolean; loading: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
        done ? 'bg-accent-500' : loading ? 'bg-amber-100' : 'bg-ink-100'
      }`}>
        {done ? (
          <Check className="w-4 h-4 text-white" />
        ) : loading ? (
          <span className="w-3 h-3 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-ink-300" />
        )}
      </div>
      <span className={`text-sm font-medium ${done ? 'text-ink-800' : 'text-ink-400'}`}>
        {label}
      </span>
    </div>
  );
}
