import React, { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInterviewScheduled?: () => void; // Optional callback to refresh your dashboard list
}

export default function ScheduleInterviewModal({ isOpen, onClose, onInterviewScheduled }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '', // <-- Added email state
    candidateRole: 'Frontend Engineer', // Matches your dropdown/cards
    pipelineStage: 'Technical Depth',
    dateTime: '',
    durationMinutes: 60, // Default duration
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5016/api/Interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateName: formData.candidateName,
          candidateEmail: formData.candidateEmail,
          candidateRole: formData.candidateRole,
          pipelineStage: formData.pipelineStage,
          scheduledTime: new Date(formData.dateTime).toISOString(),
          durationMinutes: Number(formData.durationMinutes),
          status: 'Upcoming'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule interview on the backend.');
      }

      // Success! Reset and close
      setLoading(false);
      if (onInterviewScheduled) onInterviewScheduled();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className="bg-[#131b26] border border-cyan-500/30 rounded-xl p-8 w-full max-w-lg shadow-[0_0_40px_rgba(34,211,238,0.1)] text-white">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">Schedule New Interview</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl">&times;</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs tracking-widest text-slate-400 uppercase mb-1 block">Candidate Name</label>
            <input 
              type="text" 
              className="w-full bg-[#0b111a] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors"
              placeholder="e.g. Sithum Manodhara"
              value={formData.candidateName}
              onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-slate-400 uppercase mb-1 block">Candidate Email</label>
            <input 
              type="email" 
              className="w-full bg-[#0b111a] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors"
              placeholder="e.g. candidate@gmail.com"
              value={formData.candidateEmail}
              onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest text-slate-400 uppercase mb-1 block">Stage</label>
              <select 
                className="w-full bg-[#0b111a] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors"
                value={formData.pipelineStage}
                onChange={(e) => setFormData({...formData, pipelineStage: e.target.value})}
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
                value={formData.dateTime}
                onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold tracking-wide">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#0b111a] font-bold rounded-lg text-sm tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Initialize Sequence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}