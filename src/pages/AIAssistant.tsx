import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { parseNaturalLanguage } from '@/lib/aiParser';
import { generateRequestId } from '@/lib/utils';
import { bloodGroups, hospitals } from '@/data/mockData';
import type { AIParseResult, BloodGroup, Component, Urgency, EmergencyRequest } from '@/types';
import { Bot, Send, Sparkles, Check, Droplet, ChevronRight, Wand2, Zap } from 'lucide-react';

const examples = [
  'I need 2 units O negative platelets urgently at CityCare Hospital',
  'Critical emergency — 3 units B positive whole blood at Apollo Medical Center',
  'Need 1 unit A negative plasma, normal urgency, Fortis Heart Institute',
];

export function AIAssistant() {
  const { setView, addRequest } = useApp();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AIParseResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleParse = (text?: string) => {
    const query = text ?? input;
    if (!query.trim()) return;
    setInput(query);
    setParsing(true);
    setResult(null);
    setConfirmed(false);

    setTimeout(() => {
      const parsed = parseNaturalLanguage(query);
      setResult(parsed);
      setParsing(false);
    }, 1200);
  };

  const handleConfirm = () => {
    if (!result) return;
    const selectedHospital = hospitals.find((h) =>
      result.hospital && h.name.toLowerCase().includes(result.hospital.toLowerCase())
    );

    const req: EmergencyRequest = {
      id: generateRequestId(),
      patientName: 'AI-Assisted Request',
      bloodGroup: (result.bloodGroup ?? 'O+') as BloodGroup,
      component: (result.component ?? 'Whole Blood') as Component,
      unitsRequired: result.units ?? 1,
      hospital: selectedHospital?.name ?? result.hospital ?? 'CityCare Hospital',
      hospitalLocation: selectedHospital?.location ?? 'Bengaluru',
      urgency: (result.urgency ?? 'Urgent') as Urgency,
      contactNumber: '+91 98450 00000',
      status: 'VERIFYING',
      createdAt: Date.now(),
      matchedDonors: 0,
      respondingDonors: 0,
      notifiedDonors: 0,
      matchedDonorNames: [],
      respondingDonorNames: [],
    };
    addRequest(req);
    setConfirmed(true);
    setTimeout(() => setView('verification'), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Bot className="w-4 h-4" />
          LIFELINK AI
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">AI Emergency Assistant</h1>
        <p className="mt-1 text-sm text-ink-500">Describe the emergency in natural language. LifeLink AI will extract the details and create a structured request.</p>
      </div>

      {/* Chat Interface */}
      <div className="card p-5 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-ink-800">LifeLink AI</div>
            <div className="text-xs text-ink-500 mt-0.5">
              Tell me about the blood emergency. I'll extract blood group, component, units, urgency, and hospital.
            </div>
          </div>
        </div>

        {/* Example chips */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-ink-500 mb-2">Try these examples:</div>
          <div className="space-y-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => handleParse(ex)}
                className="w-full text-left p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-50 transition-all text-xs text-ink-600 flex items-start gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleParse()}
            placeholder="e.g. I need 2 units O negative platelets urgently at CityCare Hospital"
            className="input-field flex-1"
          />
          <button
            onClick={() => handleParse()}
            disabled={!input.trim() || parsing}
            className="btn-primary px-4"
          >
            {parsing ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Parsing animation */}
      {parsing && (
        <div className="card p-5 text-center animate-fade-in">
          <div className="relative w-12 h-12 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full bg-indigo-100 animate-pulse-ring" />
            <div className="relative w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white animate-pulse-soft" />
            </div>
          </div>
          <div className="text-sm font-semibold text-ink-700">AI is parsing your request...</div>
          <div className="text-xs text-ink-400 mt-1">Extracting blood group, component, units, urgency & hospital</div>
        </div>
      )}

      {/* Parse Result */}
      {result && !parsing && !confirmed && (
        <div className="card-elevated p-5 animate-scale-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-accent-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink-900">Request details detected</div>
              <div className="text-xs text-ink-500">Confidence: {result.confidence}%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <ParsedField label="Blood Group" value={result.bloodGroup ?? 'Not detected'} highlight={!!result.bloodGroup} />
            <ParsedField label="Component" value={result.component ?? 'Not detected'} highlight={!!result.component} />
            <ParsedField label="Units" value={result.units ? `${result.units} units` : 'Not detected'} highlight={!!result.units} />
            <ParsedField label="Urgency" value={result.urgency ?? 'Not detected'} highlight={!!result.urgency} />
            <div className="col-span-2">
              <ParsedField label="Hospital" value={result.hospital ?? 'Not detected'} highlight={!!result.hospital} />
            </div>
          </div>

          {result.confidence < 60 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 mb-4">
              <div className="text-xs text-amber-700 font-medium">
                Some details could not be detected. You can edit them in the request form.
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setView('request-form')} className="btn-secondary flex-1">
              Edit Manually
            </button>
            <button onClick={handleConfirm} className="btn-primary flex-1">
              <Droplet className="w-4 h-4" fill="white" />
              Create Emergency Request
            </button>
          </div>
        </div>
      )}

      {/* Confirmation */}
      {confirmed && (
        <div className="card-elevated p-6 text-center animate-scale-in">
          <div className="w-14 h-14 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
            <Check className="w-7 h-7 text-accent-600" />
          </div>
          <div className="text-base font-bold text-ink-900">Emergency request created</div>
          <div className="text-xs text-ink-500 mt-1">Redirecting to hospital verification...</div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 card p-4 bg-indigo-50/30 border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-700">Operational Rule-Based Parser</div>
            <div className="text-xs text-ink-500 mt-0.5">
              LifeLink AI uses a local rule-based NLP parser for this prototype. No external API key is required. In production, this would use a trained NLP model for higher accuracy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParsedField({ label, value, highlight }: { label: string; value: string; highlight: boolean }) {
  return (
    <div className={`p-3 rounded-xl ${highlight ? 'bg-accent-50 border border-accent-100' : 'bg-ink-50 border border-ink-100'}`}>
      <div className="text-xs text-ink-500 mb-0.5">{label}</div>
      <div className={`text-sm font-bold ${highlight ? 'text-ink-900' : 'text-ink-400'}`}>{value}</div>
    </div>
  );
}
