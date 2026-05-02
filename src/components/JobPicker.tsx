import React from 'react';
import { JOB_PROFILES } from '../constants/jobProfiles';
import { Sparkles, CheckCircle } from 'lucide-react';

interface Props {
  onApplyProfile: (profileId: string) => void;
}

const JobPicker: React.FC<Props> = ({ onApplyProfile }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-1.5 rounded-lg">
          <Sparkles size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Instant AI Pre-Fill</h3>
        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold ml-auto">30 Roles</span>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed mb-3">
        Pick from 30 professional roles to instantly populate your resume with industry-specific content, skills & metrics.
      </p>
      <select
        onChange={(e) => e.target.value && onApplyProfile(e.target.value)}
        defaultValue=""
        className="w-full text-sm px-3 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 bg-white shadow-sm"
      >
        <option value="" disabled>-- Select Your Target Job Role --</option>
        <optgroup label="Tech & Engineering">
          {['software_engineer', 'frontend_developer', 'backend_developer', 'fullstack_developer', 'devops_engineer', 'cloud_architect', 'qa_engineer', 'mechanical_engineer'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Data & AI">
          {['data_scientist', 'data_analyst', 'ml_engineer'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Security">
          {['cybersecurity_analyst'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Product & Design">
          {['product_manager', 'project_manager', 'ui_ux_designer', 'graphic_designer'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Marketing & Sales">
          {['digital_marketer', 'content_writer', 'social_media_manager', 'sales_executive'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Business & Finance">
          {['business_analyst', 'financial_analyst', 'accountant', 'operations_manager'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Healthcare & Education">
          {['teacher', 'nurse', 'doctor'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
        <optgroup label="Other Professions">
          {['lawyer', 'hr_manager', 'customer_support'].map(id => (
            <option key={id} value={id}>{JOB_PROFILES[id].title}</option>
          ))}
        </optgroup>
      </select>
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-3 font-semibold">
        <CheckCircle size={12} /> Includes summary, experience bullets, skills & projects
      </div>
    </div>
  );
};

export default JobPicker;
