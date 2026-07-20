import React, { useState } from 'react';
import { Target, Server, Users, MessageSquare } from 'lucide-react';

export default function EvaluationForm() {
  const [scores, setScores] = useState({
    technical: 75,
    systemDesign: 60,
    communication: 80,
    cultureFit: 90,
  });

  const [comments, setComments] = useState('');

  const totalScore = Math.round(
    (scores.technical * 0.4) + 
    (scores.systemDesign * 0.3) + 
    (scores.communication * 0.2) + 
    (scores.cultureFit * 0.1)
  );

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'from-cyan-500 to-cyan-300';
    return 'from-slate-500 to-slate-400';
  };

  const renderIndicator = (label: string, key: keyof typeof scores, weight: number, Icon: any) => (
    <div className="mb-5 group">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <label className="text-[11px] tracking-widest text-slate-300 uppercase font-bold">
            {label} <span className="text-slate-500 lowercase tracking-normal font-normal">({weight * 100}%)</span>
          </label>
        </div>
        <span className="text-sm font-bold text-white bg-[#0b111a] px-2 py-0.5 rounded border border-slate-700">{scores[key]}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={scores[key]}
        onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value) })}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
      />
      <div className="w-full bg-[#0b111a] h-1 rounded-full mt-2 overflow-hidden border border-slate-800/50">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(scores[key])} transition-all duration-300 ease-out`}
          style={{ width: `${scores[key]}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#131b26] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" /> Evaluation Matrix
        </h3>
        
        <div className="flex items-center gap-3 bg-[#0b111a] px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Match Score</div>
            <div className="text-xl font-bold text-white">{totalScore}%</div>
          </div>
          <svg className="w-10 h-10 transform -rotate-90">
             <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
             <circle 
                cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 16}`} 
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - totalScore / 100)}`}
                className={`${totalScore >= 70 ? 'text-cyan-400' : 'text-slate-500'} transition-all duration-1000 ease-out`} 
             />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        {renderIndicator('Technical Depth', 'technical', 0.4, Server)}
        {renderIndicator('System Design', 'systemDesign', 0.3, Target)}
        {renderIndicator('Communication', 'communication', 0.2, MessageSquare)}
        {renderIndicator('Culture Alignment', 'cultureFit', 0.1, Users)}
      </div>

      <div className="mt-6">
        <label className="text-[11px] tracking-widest text-slate-400 uppercase font-bold mb-2 block">Executive Summary</label>
        <textarea 
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full bg-[#0b111a] border border-slate-700 rounded-xl p-4 text-sm text-slate-300 focus:border-cyan-400 outline-none transition-colors resize-none"
          placeholder="Detail the candidate's core strengths..."
        />
      </div>

      <button className="w-full mt-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-[#0b111a] font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
        Submit Official Evaluation
      </button>
    </div>
  );
}