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
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
        Select Layout Template
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
        {TEMPLATE_INFO.map((t, i) => {
          const isSelected = selectedId === i;

          return (
            <button
  key={i}
  onClick={() => onSelect(i)}
  className={`relative rounded-xl overflow-hidden border transition-all bg-white ${
    isSelected
      ? 'border-indigo-500 ring-4 ring-indigo-500/20'
      : 'border-slate-200 hover:shadow-lg hover:-translate-y-1'
  }`}
>
  {/* IMAGE CONTAINER (FIXED RATIO) */}
  <div className="w-full h-52 bg-slate-100 flex items-center justify-center overflow-hidden">
    <img
      src={t.image}
      alt={t.name}
      className="h-full object-contain"
    />
  </div>

  {/* TEXT BELOW IMAGE */}
  <div className="p-2">
    <p className="text-xs font-semibold text-slate-800 truncate">
      {t.name}
    </p>
    <p className="text-[10px] text-slate-500">
      {t.category}
    </p>
  </div>

  {/* SELECTED TAG */}
  {isSelected && (
    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded">
      ✓
    </div>
  )}
</button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;
