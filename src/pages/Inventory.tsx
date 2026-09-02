import { useState } from 'react';
import { bloodInventory } from '@/data/mockData';
import { Package, Droplet, Filter, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import type { BloodGroup, Component } from '@/types';

export function Inventory() {
  const [groupFilter, setGroupFilter] = useState<BloodGroup | 'All'>('All');
  const [componentFilter, setComponentFilter] = useState<Component | 'All'>('All');

  const groups: (BloodGroup | 'All')[] = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const components: (Component | 'All')[] = ['All', 'RBC', 'Platelets', 'Plasma', 'Whole Blood'];

  const filtered = bloodInventory.filter((item) => {
    if (groupFilter !== 'All' && item.group !== groupFilter) return false;
    return true;
  });

  const totalUnits = bloodInventory.reduce((sum, item) => sum + item.units, 0);
  const criticalCount = bloodInventory.filter((i) => i.status === 'Critical').length;
  const lowCount = bloodInventory.filter((i) => i.status === 'Low').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Package className="w-4 h-4" />
          BLOOD INVENTORY
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Blood Inventory</h1>
        <p className="mt-1 text-sm text-ink-500">Current blood unit availability across partner facilities.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
            <Droplet className="w-5 h-5 text-blue-600" />
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{totalUnits}</div>
          <div className="text-xs text-ink-400">Total Units</div>
        </div>
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{lowCount}</div>
          <div className="text-xs text-ink-400">Low Stock</div>
        </div>
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-primary-600" />
          </div>
          <div className="font-display text-2xl font-bold text-ink-900">{criticalCount}</div>
          <div className="text-xs text-ink-400">Critical</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-ink-400" />
          <span className="text-xs font-semibold text-ink-600">Filters</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-ink-500 mb-1.5">Blood Group</div>
            <div className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupFilter(g)}
                  className={`chip text-xs px-2.5 py-1.5 ${groupFilter === g ? 'chip-active' : 'chip-inactive'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-ink-500 mb-1.5">Component</div>
            <div className="flex flex-wrap gap-2">
              {components.map((c) => (
                <button
                  key={c}
                  onClick={() => setComponentFilter(c)}
                  className={`chip text-xs px-2.5 py-1.5 ${componentFilter === c ? 'chip-active' : 'chip-inactive'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((item) => (
          <div key={item.group} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
                {item.group}
              </div>
              {item.status === 'Healthy' ? (
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
              ) : item.status === 'Low' ? (
                <TrendingDown className="w-5 h-5 text-orange-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-primary-500" />
              )}
            </div>
            <div className="font-display text-2xl font-bold text-ink-900">{item.units}</div>
            <div className="text-xs text-ink-400">units available</div>
            <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              item.status === 'Healthy' ? 'bg-accent-50 text-accent-700' :
              item.status === 'Low' ? 'bg-orange-50 text-orange-700' :
              'bg-primary-50 text-primary-700'
            }`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Bar Chart */}
      <div className="card p-5 mt-6">
        <h2 className="text-sm font-semibold text-ink-700 mb-4">Unit Distribution</h2>
        <div className="space-y-2.5">
          {bloodInventory.map((item) => {
            const maxUnits = Math.max(...bloodInventory.map((i) => i.units));
            const widthPct = (item.units / maxUnits) * 100;
            const barColor = item.status === 'Healthy' ? 'bg-accent-500' :
              item.status === 'Low' ? 'bg-orange-400' : 'bg-primary-500';
            return (
              <div key={item.group} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-ink-600 w-8">{item.group}</span>
                <div className="flex-1 h-6 rounded-lg bg-ink-100 overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-lg transition-all`}
                    style={{ width: `${Math.max(widthPct, 3)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-ink-700 w-10 text-right">{item.units}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-400 text-center">
        Inventory is presented for operational visibility. Real-time sync would connect to partner hospital blood banks.
      </p>
    </div>
  );
}
