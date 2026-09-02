import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { matchDonors, maskName, type MatchedDonor } from '@/lib/matchEngine';
import { Bot, Check, ChevronRight, Droplet, MapPin, Star, Zap, Heart, ShieldCheck } from 'lucide-react';

const matchingSteps = [
  'Analyzing blood compatibility...',
  'Checking donor availability...',
  'Calculating distance...',
  'Checking donation eligibility status...',
  'Ranking potential matches...',
];

export function AIMatching() {
  const { activeRequest, donors, setView, updateRequestStatus } = useApp();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [matchedDonors, setMatchedDonors] = useState<MatchedDonor[]>([]);

  useEffect(() => {
    if (!activeRequest) return;
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= matchingSteps.length - 1) {
          clearInterval(timer);
          const results = matchDonors(donors, activeRequest.bloodGroup);
          setMatchedDonors(results);
          updateRequestStatus(activeRequest.id, 'MATCHING', {
            matchedDonors: results.length,
          });
          setTimeout(() => setDone(true), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [activeRequest, donors, updateRequestStatus]);

  if (!activeRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">No active request.</p>
        <button onClick={() => setView('request-form')} className="btn-primary mt-4">Create Request</button>
      </div>
    );
  }

  if (!done) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
        <div className="card-elevated p-8 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-primary-100 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-primary-100 animate-pulse-ring" style={{ animationDelay: '1s' }} />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-ink-900 mb-2">AI Donor Matching</h1>
          <p className="text-sm text-ink-500 mb-8">Analyzing compatible donors for {activeRequest.bloodGroup} {activeRequest.component}</p>

          <div className="space-y-3 text-left max-w-sm mx-auto">
            {matchingSteps.map((s, idx) => (
              <div
                key={s}
                className={`flex items-center gap-3 transition-all ${
                  idx <= step ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  idx < step ? 'bg-accent-500' : idx === step ? 'bg-primary-500' : 'bg-ink-200'
                }`}>
                  {idx < step ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : idx === step ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-ink-400" />
                  )}
                </div>
                <span className={`text-sm font-medium ${idx <= step ? 'text-ink-800' : 'text-ink-400'}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent-600 mb-2">
          <Check className="w-4 h-4" />
          AI MATCHING COMPLETE
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">{matchedDonors.length} potential donors found</h1>
        <p className="mt-2 text-sm text-ink-500">Ranked by blood compatibility, distance, availability, eligibility and response reliability.</p>
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
          <span className={`badge ${
            activeRequest.urgency === 'Critical' ? 'bg-primary-100 text-primary-700' :
            activeRequest.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {activeRequest.urgency.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Match Score Info */}
      <div className="card p-4 mb-6 bg-indigo-50/50 border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-800">Match Score Logic</div>
            <div className="text-xs text-ink-500 mt-0.5">
              Blood compatibility + Distance + Availability + Eligibility + Response Reliability
            </div>
          </div>
        </div>
      </div>

      {/* Donor List */}
      <div className="space-y-3 mb-6">
        {matchedDonors.slice(0, 10).map((donor, idx) => (
          <DonorMatchCard key={donor.id} donor={donor} rank={idx + 1} />
        ))}
      </div>

      <button onClick={() => setView('broadcast')} className="btn-primary w-full text-base py-3.5">
        <Zap className="w-5 h-5" />
        Notify Matched Donors
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function DonorMatchCard({ donor, rank }: { donor: MatchedDonor; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = donor.matchScore >= 90 ? 'text-accent-600 bg-accent-50' :
    donor.matchScore >= 75 ? 'text-blue-600 bg-blue-50' :
    'text-ink-600 bg-ink-50';

  return (
    <div className="card p-4 hover:shadow-soft transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-sm font-bold text-ink-500 shrink-0">
          {rank}
        </div>
        <div className="w-10 h-10 rounded-full bg-ink-200 flex items-center justify-center text-sm font-bold text-ink-600 shrink-0">
          {donor.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink-900">{maskName(donor.name)}</div>
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <span className="font-semibold text-ink-600">{donor.bloodGroup}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{donor.distanceKm} km</span>
            <span>·</span>
            <span className={`flex items-center gap-0.5 ${donor.availability === 'Available' ? 'text-accent-600' : 'text-ink-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${donor.availability === 'Available' ? 'bg-accent-500' : 'bg-ink-300'}`} />
              {donor.availability}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-center ${scoreColor}`}>
          <div className="text-lg font-bold leading-none">{donor.matchScore}%</div>
          <div className="text-[10px] font-medium">match</div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
      >
        {expanded ? 'Hide' : 'Show'} match details
        <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-100 space-y-1.5 animate-fade-in-fast">
          {donor.matchReasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-ink-500">
              <Check className="w-3 h-3 text-accent-500 shrink-0" />
              {reason}
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-ink-400 pt-1">
            <Star className="w-3 h-3" />
            Reliability Score: {donor.reliabilityScore}% · {donor.donations} donations
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-ink-300" />
        <span className="text-[11px] text-ink-400">Personal information protected</span>
      </div>
    </div>
  );
}
