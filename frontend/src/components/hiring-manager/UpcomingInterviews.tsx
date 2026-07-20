import React, { useState } from 'react';
import { Video, Clock, ChevronRight } from 'lucide-react';

export default function UpcomingInterviews() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const interviews = [
    {
      id: 1,
      name: 'Sashik Mindaka',
      role: 'Backend Engineer',
      stage: 'System Design',
      time: '2:00 PM',
      duration: '45 min',
      platform: 'Google Meet',
    },
    {
      id: 2,
      name: 'Sithum Manodhara',
      role: 'Frontend Engineer',
      stage: 'Technical Depth',
      time: '4:30 PM',
      duration: '60 min',
      platform: 'Microsoft Teams',
    }
  ];

  return (
    <div className="bg-[#131b26] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Interview Pipeline</h3>
        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
          {interviews.length} ACTIVE
        </span>
      </div>

      <div className="flex gap-8 border-b border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-semibold tracking-wider transition-all relative ${activeTab === 'upcoming' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          UPCOMING
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-semibold tracking-wider transition-all relative ${activeTab === 'completed' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          COMPLETED
          {activeTab === 'completed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
        </button>
      </div>

      <div className="grid grid-cols-12 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3 px-4">
        <div className="col-span-5">Candidate Profile</div>
        <div className="col-span-3">Pipeline Stage</div>
        <div className="col-span-4 text-right">Schedule & Join</div>
      </div>

      <div className="space-y-3 flex-1">
        {interviews.map((interview) => (
          <div 
            key={interview.id} 
            className="group grid grid-cols-12 items-center bg-[#1e293b] hover:bg-[#253347] border border-slate-700 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="col-span-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold shadow-inner">
                {interview.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">{interview.name}</div>
                <div className="text-xs text-slate-400">{interview.role}</div>
              </div>
            </div>

            <div className="col-span-3">
              <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {interview.stage}
              </span>
            </div>

            <div className="col-span-4 flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {interview.time} <span className="text-xs text-slate-500 font-normal">({interview.duration})</span>
              </div>
              <button className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Video className="w-3 h-3" /> JOIN SESSION <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}