import React from 'react';
import { TemplateId } from '../types';
import { TEMPLATE_INFO } from '../constants/themes';

interface Props {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const TemplatePicker: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Select Layout Template (20)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
        {TEMPLATE_INFO.map((t, i) => {
          const isSelected = selectedId === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all relative ${
                isSelected ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{i + 1}</span>
                <h4 className="font-bold text-slate-900 text-xs">{t.name}</h4>
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed">{t.description}</p>
              <span className="text-[9px] text-indigo-500 font-semibold mt-1">{t.category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;
