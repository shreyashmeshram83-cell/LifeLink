import { useState } from 'react';
import { donors, hospitals, bloodBanks } from '@/data/mockData';
import { matchDonors, maskName, type MatchedDonor } from '@/lib/matchEngine';
import { MapPin, Droplet, Heart, Building2, X, Star, Navigation } from 'lucide-react';
import type { BloodGroup } from '@/types';

export function LiveMap() {
  const [selectedDonor, setSelectedDonor] = useState<MatchedDonor | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'donors' | 'hospitals' | 'banks'>('all');

  // Use O+ as default for match scores
  const matchedDonors = matchDonors(donors, 'O+' as BloodGroup);
  const donorMap = new Map(matchedDonors.map((d) => [d.id, d]));

  const visibleDonors = selectedType === 'all' || selectedType === 'donors';
  const visibleHospitals = selectedType === 'all' || selectedType === 'hospitals';
  const visibleBanks = selectedType === 'all' || selectedType === 'banks';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Navigation className="w-4 h-4" />
          LIVE MAP
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Live Emergency Map</h1>
        <p className="mt-1 text-sm text-ink-500">Real-time visualization of hospitals, donors, and blood banks in the network.</p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {[
          { key: 'all' as const, label: 'All', color: 'bg-ink-100 text-ink-600' },
          { key: 'donors' as const, label: 'Donors', color: 'bg-accent-50 text-accent-600' },
          { key: 'hospitals' as const, label: 'Hospitals', color: 'bg-primary-50 text-primary-600' },
          { key: 'banks' as const, label: 'Blood Banks', color: 'bg-blue-50 text-blue-600' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setSelectedType(f.key)}
            className={`chip text-xs px-3 py-1.5 ${selectedType === f.key ? 'chip-active' : 'chip-inactive'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="card-elevated overflow-hidden">
        <div className="relative w-full h-[500px] bg-gradient-to-br from-ink-50 to-ink-100">
          {/* Grid lines for map effect */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                </pattern>
                <pattern id="grid-large" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#grid-large)" />
              {/* Simulated roads */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#cbd5e1" strokeWidth="3" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="3" />
              <line x1="0" y1="25%" x2="100%" y2="30%" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="20%" y1="0" x2="25%" y2="100%" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="0" y1="75%" x2="100%" y2="70%" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="75%" y1="0" x2="80%" y2="100%" stroke="#e2e8f0" strokeWidth="2" />
            </svg>
          </div>

          {/* Blood Banks */}
          {visibleBanks && bloodBanks.map((bank) => (
            <MapMarker
              key={bank.id}
              x={bank.lng}
              y={bank.lat}
              color="bg-blue-500"
              size="md"
              label={bank.name}
            >
              <Building2 className="w-4 h-4 text-white" />
            </MapMarker>
          ))}

          {/* Hospitals */}
          {visibleHospitals && hospitals.map((hosp) => (
            <MapMarker
              key={hosp.id}
              x={hosp.lng}
              y={hosp.lat}
              color="bg-primary-600"
              size="lg"
              label={hosp.name}
              pulse
            >
              <Droplet className="w-5 h-5 text-white" fill="white" />
            </MapMarker>
          ))}

          {/* Donors */}
          {visibleDonors && donors.map((donor) => {
            const matched = donorMap.get(donor.id);
            const score = matched?.matchScore ?? 0;
            return (
              <button
                key={donor.id}
                onClick={() => setSelectedDonor(matched ?? { ...donor, matchScore: score, matchReasons: [] })}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-10"
                style={{ left: `${donor.lng}%`, top: `${donor.lat}%` }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-soft ${
                  donor.availability === 'Available' ? 'bg-accent-500' : 'bg-ink-300'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 card p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                <Droplet className="w-2.5 h-2.5 text-white" fill="white" />
              </div>
              <span className="text-ink-600 font-medium">Emergency Hospital</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-accent-500 border-2 border-white" />
              <span className="text-ink-600 font-medium">Available Donor</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-ink-300 border-2 border-white" />
              <span className="text-ink-600 font-medium">Unavailable Donor</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-md bg-blue-500 flex items-center justify-center">
                <Building2 className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-ink-600 font-medium">Blood Bank</span>
            </div>
          </div>

          {/* Stats overlay */}
          <div className="absolute top-4 right-4 card p-3 space-y-1">
            <div className="text-xs font-semibold text-ink-700">Map Summary</div>
            <div className="text-xs text-ink-500">{visibleHospitals ? hospitals.length : 0} Hospitals</div>
            <div className="text-xs text-ink-500">{visibleDonors ? donors.filter(d => d.availability === 'Available').length : 0} Available Donors</div>
            <div className="text-xs text-ink-500">{visibleBanks ? bloodBanks.length : 0} Blood Banks</div>
          </div>
        </div>
      </div>

      {/* Donor Detail Popup */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-fade-in-fast" onClick={() => setSelectedDonor(null)}>
          <div className="card-elevated p-5 m-4 max-w-sm w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-ink-200 flex items-center justify-center text-lg font-bold text-ink-600">
                  {selectedDonor.name[0]}
                </div>
                <div>
                  <div className="text-base font-bold text-ink-900">{maskName(selectedDonor.name)}</div>
                  <div className="text-xs text-ink-500">{selectedDonor.bloodGroup} · {selectedDonor.distanceKm} km away</div>
                </div>
              </div>
              <button onClick={() => setSelectedDonor(null)} className="p-1.5 rounded-lg hover:bg-ink-100">
                <X className="w-4 h-4 text-ink-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-ink-50">
                <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-1">
                  <Heart className="w-3 h-3" />
                  Availability
                </div>
                <div className={`text-sm font-bold ${selectedDonor.availability === 'Available' ? 'text-accent-600' : 'text-ink-500'}`}>
                  {selectedDonor.availability}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ink-50">
                <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-1">
                  <MapPin className="w-3 h-3" />
                  Distance
                </div>
                <div className="text-sm font-bold text-ink-800">{selectedDonor.distanceKm} km</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-50">
                <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-1">
                  <Star className="w-3 h-3" />
                  Reliability
                </div>
                <div className="text-sm font-bold text-ink-800">{selectedDonor.reliabilityScore}%</div>
              </div>
              <div className="p-3 rounded-xl bg-primary-50">
                <div className="flex items-center gap-1.5 text-xs text-primary-500 mb-1">
                  <Droplet className="w-3 h-3" />
                  Match Score
                </div>
                <div className="text-sm font-bold text-primary-700">{selectedDonor.matchScore}%</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
              Personal information protected — contact details revealed only after acceptance
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-ink-400 text-center">
        Live emergency map view using nearby hospital and donor location data for operational planning.
      </p>
    </div>
  );
}

function MapMarker({
  x,
  y,
  color,
  size,
  label,
  pulse,
  children,
}: {
  x: number;
  y: number;
  color: string;
  size: 'sm' | 'md' | 'lg';
  label: string;
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 rounded-lg',
    lg: 'w-10 h-10 rounded-xl',
  };
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {pulse && (
        <div className={`absolute inset-0 ${sizes[size]} ${color} rounded-full animate-pulse-ring opacity-30`} />
      )}
      <div className={`relative ${sizes[size]} ${color} flex items-center justify-center shadow-soft`}>
        {children}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-ink-700 shadow-soft whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </div>
    </div>
  );
}
