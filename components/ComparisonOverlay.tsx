
import React from 'react';
import { Phone } from '../types';

interface ComparisonOverlayProps {
  phones: Phone[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onAnalyze: () => void;
}

const ComparisonOverlay: React.FC<ComparisonOverlayProps> = ({ phones, onRemove, onClear, onAnalyze }) => {
  if (phones.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
      <div className="glass rounded-[2rem] px-8 py-5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-blue-500/20">
        <div className="flex gap-4 items-center">
          <div className="flex -space-x-3">
            {phones.map((p) => (
              <div key={p.id} className="relative group">
                <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-slate-950 bg-slate-900 shadow-xl">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <button 
                  onClick={() => onRemove(p.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:scale-110 transition-transform shadow-lg"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            {phones.length < 2 && (
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-500/20 bg-blue-500/5 flex items-center justify-center text-blue-500/30">
                <i className="fas fa-plus text-xs"></i>
              </div>
            )}
          </div>
          <div className="hidden sm:block ml-2">
            <div className="tech-mono text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Comparison_Queue</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase italic">{phones.length}/2 Units Active</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onClear}
            className="text-slate-500 text-[10px] font-black uppercase tracking-widest tech-mono hover:text-white transition-colors"
          >
            Reset
          </button>
          <button 
            disabled={phones.length < 2}
            onClick={onAnalyze}
            className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all tech-mono ${
              phones.length === 2 
              ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500' 
              : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-blue-500/10'
            }`}
          >
            Compute_Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonOverlay;
