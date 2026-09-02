import { useApp } from '@/context/AppContext';
import { Droplet, Zap, MapPin, ShieldCheck, Heart, Activity, ArrowRight, Play, Bot, Stethoscope, Clock, Check } from 'lucide-react';
import { Disclaimer } from '@/components/Shared';
import type { DemoRole } from '@/types';

export function LandingPage() {
  const { setView, setRole } = useApp();

  const launchRole = (demoRole: DemoRole) => {
    setRole(demoRole);
    if (demoRole === 'patient') setView('request-form');
    else if (demoRole === 'hospital') setView('hospital-dashboard');
    else if (demoRole === 'donor') setView('donor-dashboard');
    else if (demoRole === 'admin') setView('admin-dashboard');
    else setView('landing');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-ink-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
                <span className="text-xs font-semibold text-primary-700">Emergency Blood Coordination Network</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 leading-[1.1] text-balance">
                Find the right blood donor when every second matters.
              </h1>

              <p className="mt-5 text-lg text-ink-500 leading-relaxed max-w-xl">
                LifeLink connects verified emergency requests with eligible, available donors nearby.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setRole('patient');
                    setView('request-form');
                  }}
                  className="btn-primary text-base px-6 py-3.5"
                >
                  <Droplet className="w-5 h-5" fill="white" />
                  Request Blood Now
                </button>
                <button
                  onClick={() => {
                    setRole('donor');
                    setView('donor-dashboard');
                  }}
                  className="btn-secondary text-base px-6 py-3.5"
                >
                  <Heart className="w-5 h-5" />
                  Become a Donor
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div>
                  <div className="font-display text-2xl font-bold text-ink-900">&lt; 10s</div>
                  <div className="text-xs text-ink-400 font-medium">System matching time*</div>
                </div>
                <div className="w-px h-10 bg-ink-200" />
                <div>
                  <div className="font-display text-2xl font-bold text-ink-900">47</div>
                  <div className="text-xs text-ink-400 font-medium">Potential donors</div>
                </div>
                <div className="w-px h-10 bg-ink-200" />
                <div>
                  <div className="font-display text-2xl font-bold text-ink-900">5</div>
                  <div className="text-xs text-ink-400 font-medium">Partner hospitals</div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-ink-400">*Simulated prototype result</p>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-scale-in">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          <BenefitCard
            icon={<Zap className="w-6 h-6" />}
            title="Faster Matching"
            description="AI-assisted matching identifies compatible donors in seconds, not hours."
            color="primary"
          />
          <BenefitCard
            icon={<MapPin className="w-6 h-6" />}
            title="Nearby Donors"
            description="Distance-aware ranking surfaces the closest eligible donors first."
            color="accent"
          />
          <BenefitCard
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Verified Requests"
            description="Hospital verification ensures every request is legitimate before broadcast."
            color="blue"
          />
        </div>
      </section>

      {/* Demo Mode Section */}
      <section className="bg-ink-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-4">
              <Play className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">Live workflow</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white">Experience the full workflow</h2>
            <p className="mt-3 text-ink-400 max-w-2xl mx-auto">
              Launch as any role and walk through the complete emergency coordination loop in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DemoCard role="patient" label="Patient" description="Create an emergency blood request" icon={<Droplet className="w-5 h-5" />} onClick={() => launchRole('patient')} />
            <DemoCard role="hospital" label="Hospital" description="Command center & verification" icon={<Stethoscope className="w-5 h-5" />} onClick={() => launchRole('hospital')} />
            <DemoCard role="donor" label="Donor" description="View & accept emergency requests" icon={<Heart className="w-5 h-5" />} onClick={() => launchRole('donor')} />
            <DemoCard role="admin" label="Admin" description="Full system overview" icon={<Activity className="w-5 h-5" />} onClick={() => launchRole('admin')} />
          </div>
        </div>
      </section>

      {/* Workflow Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-ink-900">From emergency to fulfilled</h2>
          <p className="mt-3 text-ink-500">The complete coordination loop in one seamless flow.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: 'Emergency', icon: Droplet, desc: 'Request created' },
            { step: 'Verify', icon: ShieldCheck, desc: 'Hospital confirms' },
            { step: 'AI Match', icon: Bot, desc: 'Donors ranked' },
            { step: 'Notify', icon: Zap, desc: 'Alerts sent' },
            { step: 'Accept', icon: Heart, desc: 'Donor responds' },
            { step: 'Fulfilled', icon: Activity, desc: 'Blood secured' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="card p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-xs font-bold text-primary-600 mb-0.5">STEP {idx + 1}</div>
                <div className="text-sm font-semibold text-ink-800">{item.step}</div>
                <div className="text-xs text-ink-400 mt-0.5">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-ink-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ink-200 mb-4">
            <ShieldCheck className="w-4 h-4 text-accent-600" />
            <span className="text-xs font-semibold text-ink-600">Healthcare Safety</span>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed">
            Designed for emergency coordination. Medical decisions remain with authorized healthcare professionals.
          </p>
          <div className="mt-6">
            <Disclaimer />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-ink-900">LifeLink</span>
            <span className="text-xs text-ink-400 ml-2">Emergency Blood Donor Network — Hackathon Prototype</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Live system mode</span>
            <span>Operational workflow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: 'primary' | 'accent' | 'blue' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="card p-6 hover:shadow-elevated transition-all hover:-translate-y-0.5">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-ink-900 mb-1.5">{title}</h3>
      <p className="text-sm text-ink-500 leading-relaxed">{description}</p>
    </div>
  );
}

function DemoCard({ label, description, icon, onClick }: { role: string; label: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 transition-all hover:border-white/20"
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <span className="text-white">{icon}</span>
      </div>
      <div className="text-white font-semibold text-sm">{label}</div>
      <div className="text-ink-400 text-xs mt-0.5">{description}</div>
      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-400 group-hover:text-primary-300">
        Launch workflow <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="card-elevated p-5 max-w-sm mx-auto">
        {/* Live matching preview */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
            <span className="text-xs font-semibold text-ink-600">LIVE MATCHING</span>
          </div>
          <span className="text-xs text-ink-400 font-mono">LL-2026-1042</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            O-
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-900">Platelets · 3 units</div>
            <div className="text-xs text-ink-500">CityCare Hospital · Critical</div>
          </div>
          <span className="badge bg-primary-100 text-primary-700">CRITICAL</span>
        </div>

        <div className="space-y-2.5">
          {[
            { name: 'Ananya S.', group: 'O+', dist: '2.4 km', score: 96, delay: '0s' },
            { name: 'Aisha K.', group: 'O+', dist: '4.1 km', score: 91, delay: '0.1s' },
            { name: 'Aman P.', group: 'O+', dist: '6.7 km', score: 84, delay: '0.2s' },
          ].map((d) => (
            <div
              key={d.name}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-ink-50 border border-ink-100 animate-fade-in"
              style={{ animationDelay: d.delay, animationFillMode: 'both' }}
            >
              <div className="w-9 h-9 rounded-full bg-ink-200 flex items-center justify-center text-xs font-bold text-ink-600">
                {d.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink-800 truncate">{d.name}</div>
                <div className="text-xs text-ink-400">{d.group} · {d.dist}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-accent-600">{d.score}%</div>
                <div className="text-[10px] text-ink-400">match</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between">
          <span className="text-xs text-ink-400">47 potential donors found</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600">
            <Check className="w-3 h-3" /> AI Matched
          </span>
        </div>
      </div>

      {/* Floating notification card */}
      <div className="absolute -bottom-4 -left-4 card-elevated p-3 max-w-[200px] animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
            <Heart className="w-4 h-4 text-accent-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-800">Donor Accepted</div>
            <div className="text-[10px] text-ink-400">Ananya S. · 2.4 km</div>
          </div>
        </div>
      </div>
    </div>
  );
}


