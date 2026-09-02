import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { bloodGroups, hospitals } from '@/data/mockData';
import { generateRequestId } from '@/lib/utils';
import type { BloodGroup, Component, Urgency, EmergencyRequest } from '@/types';
import { Droplet, ChevronRight, AlertCircle, Phone, MapPin, User, Building2, Heart, Bot } from 'lucide-react';

export function RequestForm() {
  const { setView, addRequest } = useApp();
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '' as BloodGroup | '',
    component: '' as Component | '',
    unitsRequired: '',
    hospital: '',
    hospitalLocation: '',
    urgency: '' as Urgency | '',
    contactNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const components: Component[] = ['RBC', 'Platelets', 'Plasma', 'Whole Blood'];
  const urgencies: Urgency[] = ['Critical', 'Urgent', 'Normal'];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = 'Patient/attendant name is required';
    if (!form.bloodGroup) e.bloodGroup = 'Select a blood group';
    if (!form.component) e.component = 'Select a component';
    if (!form.unitsRequired || parseInt(form.unitsRequired) < 1) e.unitsRequired = 'Enter valid units (1+)';
    if (!form.hospital) e.hospital = 'Select a hospital';
    if (!form.contactNumber.trim()) e.contactNumber = 'Contact number is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(form.contactNumber)) e.contactNumber = 'Enter a valid phone number';
    if (!form.urgency) e.urgency = 'Select urgency level';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const selectedHospital = hospitals.find((h) => h.name === form.hospital);
    const req: EmergencyRequest = {
      id: generateRequestId(),
      patientName: form.patientName,
      bloodGroup: form.bloodGroup as BloodGroup,
      component: form.component as Component,
      unitsRequired: parseInt(form.unitsRequired),
      hospital: form.hospital,
      hospitalLocation: selectedHospital?.location ?? form.hospitalLocation,
      urgency: form.urgency as Urgency,
      contactNumber: form.contactNumber,
      status: 'VERIFYING',
      createdAt: Date.now(),
      matchedDonors: 0,
      respondingDonors: 0,
      notifiedDonors: 0,
      matchedDonorNames: [],
      respondingDonorNames: [],
    };
    addRequest(req);
    setView('verification');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
          EMERGENCY REQUEST
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Create Emergency Blood Request</h1>
        <p className="mt-2 text-sm text-ink-500">Fill in the details below. This will be verified by the hospital before donor matching begins.</p>
      </div>

      <button
        onClick={() => setView('ai-assistant')}
        className="w-full mb-6 flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-soft transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-ink-800">Use AI Assistant</div>
          <div className="text-xs text-ink-500">Describe the emergency in natural language</div>
        </div>
        <ChevronRight className="w-5 h-5 text-ink-400" />
      </button>

      <div className="card p-6 space-y-5">
        {/* Patient Name */}
        <div>
          <label className="label-field">
            <User className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Patient / Attendant Name
          </label>
          <input
            type="text"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            placeholder="e.g. Suresh Kumar"
            className="input-field"
          />
          {errors.patientName && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.patientName}</p>}
        </div>

        {/* Blood Group */}
        <div>
          <label className="label-field">
            <Droplet className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Blood Group
          </label>
          <div className="grid grid-cols-4 gap-2">
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setForm({ ...form, bloodGroup: bg })}
                className={`chip ${form.bloodGroup === bg ? 'chip-active' : 'chip-inactive'}`}
              >
                {bg}
              </button>
            ))}
          </div>
          {errors.bloodGroup && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.bloodGroup}</p>}
        </div>

        {/* Component */}
        <div>
          <label className="label-field">
            <Heart className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Component
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {components.map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, component: c })}
                className={`chip ${form.component === c ? 'chip-active' : 'chip-inactive'}`}
              >
                {c}
              </button>
            ))}
          </div>
          {errors.component && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.component}</p>}
        </div>

        {/* Units + Urgency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Units Required</label>
            <input
              type="number"
              min="1"
              value={form.unitsRequired}
              onChange={(e) => setForm({ ...form, unitsRequired: e.target.value })}
              placeholder="e.g. 3"
              className="input-field"
            />
            {errors.unitsRequired && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.unitsRequired}</p>}
          </div>
          <div>
            <label className="label-field">Urgency</label>
            <div className="flex gap-2">
              {urgencies.map((u) => (
                <button
                  key={u}
                  onClick={() => setForm({ ...form, urgency: u })}
                  className={`chip flex-1 ${form.urgency === u ? 'chip-active' : 'chip-inactive'}`}
                >
                  {u}
                </button>
              ))}
            </div>
            {errors.urgency && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.urgency}</p>}
          </div>
        </div>

        {/* Hospital */}
        <div>
          <label className="label-field">
            <Building2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Hospital
          </label>
          <select
            value={form.hospital}
            onChange={(e) => {
              const h = hospitals.find((h) => h.name === e.target.value);
              setForm({ ...form, hospital: e.target.value, hospitalLocation: h?.location ?? '' });
            }}
            className="input-field"
          >
            <option value="">Select hospital</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.name}>{h.name}</option>
            ))}
          </select>
          {errors.hospital && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.hospital}</p>}
        </div>

        {/* Hospital Location */}
        {form.hospital && (
          <div>
            <label className="label-field">
              <MapPin className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Hospital Location
            </label>
            <input
              type="text"
              value={form.hospitalLocation}
              onChange={(e) => setForm({ ...form, hospitalLocation: e.target.value })}
              placeholder="Area, City"
              className="input-field"
            />
          </div>
        )}

        {/* Contact */}
        <div>
          <label className="label-field">
            <Phone className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Contact Number
          </label>
          <input
            type="tel"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="e.g. +91 98450 12345"
            className="input-field"
          />
          {errors.contactNumber && <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.contactNumber}</p>}
        </div>

        <button onClick={handleSubmit} className="btn-primary w-full text-base py-3.5">
          <Droplet className="w-5 h-5" fill="white" />
          Create Emergency Request
        </button>
      </div>

      <p className="mt-4 text-xs text-ink-400 text-center">
        Your contact information is shared only with the verifying hospital. Donor contact details are revealed only after acceptance.
      </p>
    </div>
  );
}
