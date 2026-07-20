import React, { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleInterviewModal({ isOpen, onClose }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    interviewType: 'Technical Round 1',
    dateTime: '',
    syncCalendar: true,
    sendReminder: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className="bg-[#131b26] border border-cyan-500/30 rounded-xl p-8 w-full max-w-lg shadow-[0_0_40px_rgba(34,211,238,0.1)] text-white">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">Schedule New Interview</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl">&times;</button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-5">
          
          <div>
            <label className="text-xs tracking-widest text-slate-400 uppercase mb-1 block">Candidate Name</label>
            <input 
              type="text" 
              className="w-full bg-[#0b111a] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors"
              placeholder="e.g. Sarah Perera"
              onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest text-slate-400 uppercase mb-1 block">Stage</label>
              <select 
                className="w-full bg-[#0b111a] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors"
                onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
              >
                <option>Screening Call</option>
                <option>Technical Depth</option>
                <option>System Design</option>
                <option>Culture Alignment</option>
              </select>
            </div>
            <div>
              <label className="text-xs tracking-widest text-slate-400 uppercase mb-1 block">Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full bg-[#0b111a] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors"
                onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="p-4 bg-[#1e293b] rounded-lg border border-slate-700 space-y-3 mt-4">
            <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-widest">System Integrations</span>
            
            <label className="flex items-center justify-between text-sm cursor-pointer group">
              <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">Sync to Outlook / Google Calendar</span>
              <input 
                type="checkbox" 
                checked={formData.syncCalendar}
                onChange={(e) => setFormData({...formData, syncCalendar: e.target.checked})}
                className="accent-cyan-400 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between text-sm cursor-pointer group">
              <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">Automated SMS/Email Reminder</span>
              <input 
                type="checkbox" 
                checked={formData.sendReminder}
                onChange={(e) => setFormData({...formData, sendReminder: e.target.checked})}
                className="accent-cyan-400 h-4 w-4"
              />
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold tracking-wide">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#0b111a] font-bold rounded-lg text-sm tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
              Initialize Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}