import React from 'react';
import { THEME_COLORS } from '../constants/themes';
import { ThemeColor } from '../types';
import { Palette } from 'lucide-react';

interface Props {
  selected: ThemeColor;
  onSelect: (theme: ThemeColor) => void;
}

const ThemePicker: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="text-indigo-500" size={16} />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Theme Color</h3>
        <span className="text-[10px] text-slate-500 ml-auto">{selected.name}</span>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {THEME_COLORS.map(t => (
          <button
            key={t.name}
            onClick={() => onSelect(t)}
            title={t.name}
            className={`w-7 h-7 rounded-full border-2 transition-all ${selected.primary === t.primary ? 'border-slate-800 scale-110 ring-2 ring-offset-1 ring-slate-300' : 'border-white hover:scale-110'}`}
            style={{ backgroundColor: t.primary, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemePicker;
