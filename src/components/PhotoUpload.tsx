import React, { useRef } from 'react';
import { Camera, X, User } from 'lucide-react';

interface Props {
  photo: string;
  onChange: (photo: string) => void;
}

const PhotoUpload: React.FC<Props> = ({ photo, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="text-indigo-500" size={16} />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Profile Photo</h3>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 border-2 border-slate-200">
          {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : <User className="text-slate-400" size={28} />}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            {photo ? 'Change Photo' : 'Upload Photo'}
          </button>
          {photo && (
            <button
              onClick={() => onChange('')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <X size={12} /> Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoUpload;
