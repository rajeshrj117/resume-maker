import React from 'react';
import { FontSettings, FONT_FAMILIES } from '../types';
import { Type } from 'lucide-react';

interface Props {
  settings: FontSettings;
  onChange: (settings: FontSettings) => void;
}

const FontPicker: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Type className="text-indigo-500" size={16} />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Font Settings</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-slate-600 uppercase mb-1 block">Font Family</label>
          <select
            value={settings.family}
            onChange={(e) => onChange({ ...settings, family: e.target.value })}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 bg-slate-50"
            style={{ fontFamily: settings.family }}
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-600 uppercase mb-1 block">Font Size</label>
          <div className="grid grid-cols-3 gap-1">
            {(['compact', 'normal', 'large'] as const).map(size => (
              <button
                key={size}
                onClick={() => onChange({ ...settings, size })}
                className={`text-xs font-semibold py-2 rounded-lg transition-all capitalize ${
                  settings.size === size
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontPicker;
