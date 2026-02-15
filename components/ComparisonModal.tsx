
import React, { useState, useEffect } from 'react';
import { Phone } from '../types';
import { comparePhonesAI } from '../services/geminiService';

interface ComparisonModalProps {
  phones: Phone[];
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ phones, isOpen, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    if (isOpen && phones.length === 2) {
      const fetchAnalysis = async () => {
        setLoading(true);
        setAnalysis('');
        const steps = setInterval(() => setScanStep(s => (s + 1) % 4), 800);
        
        try {
          const result = await comparePhonesAI(phones[0], phones[1]);
          setAnalysis(result);
        } catch (err) {
          setAnalysis("Ocorreu um erro na conexão neural. Tente novamente.");
        } finally {
          clearInterval(steps);
          setLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [isOpen, phones]);

  if (!isOpen || phones.length < 2) return null;

  const [p1, p2] = phones;

  // Função auxiliar para tentar extrair valores numéricos e comparar
  const compareSpecs = (v1: string, v2: string) => {
    const n1 = parseFloat(v1.replace(/[^0-9.]/g, ''));
    const n2 = parseFloat(v2.replace(/[^0-9.]/g, ''));
    if (isNaN(n1) || isNaN(n2)) return 0;
    return n1 - n2;
  };

  const SpecItem = ({ label, icon, v1, v2 }: { label: string, icon: string, v1: string, v2: string }) => {
    const diff = compareSpecs(v1, v2);
    return (
      <div className="group py-4 md:py-5 border-b border-blue-500/5 hover:bg-blue-500/[0.02] transition-colors">
        <div className="flex justify-between items-center mb-2 md:mb-3 px-4">
          <div className={`text-right w-[40%] text-xs md:text-sm font-bold tech-mono tracking-tighter transition-colors ${diff > 0 ? 'text-blue-400' : 'text-white'}`}>
            {v1}
            {diff > 0 && <span className="hidden xs:inline ml-2 text-[7px] bg-blue-500/20 px-1 rounded text-blue-500">ADV</span>}
          </div>
          <div className="flex flex-col items-center gap-1 w-[20%]">
             <i className={`fas ${icon} text-blue-500/40 text-[10px] md:text-xs`}></i>
             <span className="hidden md:inline text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black text-center">{label}</span>
          </div>
          <div className={`text-left w-[40%] text-xs md:text-sm font-bold tech-mono tracking-tighter transition-colors ${diff < 0 ? 'text-blue-400' : 'text-white'}`}>
            {v2}
            {diff < 0 && <span className="hidden xs:inline ml-2 text-[7px] bg-blue-500/20 px-1 rounded text-blue-500">ADV</span>}
          </div>
        </div>
        <div className="flex h-1 bg-slate-900 rounded-full overflow-hidden mx-4">
           <div className={`h-full transition-all duration-1000 ${diff > 0 ? 'w-[60%] bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-1/2 bg-blue-900/30'}`}></div>
           <div className={`h-full transition-all duration-1000 ${diff < 0 ? 'w-[60%] bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'w-1/2 bg-blue-900/30'}`}></div>
        </div>
        <div className="md:hidden text-center mt-1">
            <span className="text-[7px] text-slate-600 uppercase tracking-widest tech-mono font-bold">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative glass w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] p-5 md:p-10 border-blue-500/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 no-scrollbar">
        
        {/* Header Module */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="tech-mono text-[8px] md:text-[10px] text-blue-500 uppercase tracking-[0.4em]">Hardware_Comparison_X-Series</span>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full glass border border-blue-500/20 flex items-center justify-center text-slate-500 hover:text-white hover:glow-border transition-all"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Device Combat Head-to-Head */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-12 md:mb-16 px-2">
          <div className="flex flex-col items-center flex-1">
            <div className="relative p-4 glass rounded-[2rem] border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.1)] group w-36 md:w-48">
               <img src={p1.image} className="w-full h-36 md:h-60 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest text-white shadow-lg whitespace-nowrap">ALPHA_01</div>
            </div>
            <h3 className="mt-5 md:mt-8 text-base md:text-2xl font-black text-white uppercase italic tracking-tighter text-center">{p1.name}</h3>
            <span className="text-blue-500 tech-mono text-[10px] md:text-xs font-bold mt-1">R$ {p1.price.toLocaleString('pt-BR')}</span>
          </div>

          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full glass border-2 border-blue-500/30 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
               <span className="font-black text-lg md:text-2xl text-white italic z-10">VS</span>
               <div className="absolute inset-0 border border-blue-500/20 animate-spin-slow rounded-full"></div>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="relative p-4 glass rounded-[2rem] border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.1)] group w-36 md:w-48">
               <img src={p2.image} className="w-full h-36 md:h-60 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-400 px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest text-white shadow-lg whitespace-nowrap">BETA_02</div>
            </div>
            <h3 className="mt-5 md:mt-8 text-base md:text-2xl font-black text-white uppercase italic tracking-tighter text-center">{p2.name}</h3>
            <span className="text-blue-400 tech-mono text-[10px] md:text-xs font-bold mt-1">R$ {p2.price.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* Specification Matrix Table */}
        <div className="glass rounded-[2rem] overflow-hidden border-blue-500/10 mb-8 md:mb-12">
          <div className="bg-slate-900/50 p-4 flex justify-between items-center border-b border-blue-500/10">
             <div className="flex items-center gap-2">
               <i className="fas fa-layer-group text-blue-500 text-[10px]"></i>
               <span className="tech-mono text-[9px] font-black text-blue-500 uppercase tracking-widest">Symmetric_Hardware_Audit</span>
             </div>
             <div className="hidden xs:block text-[8px] text-slate-600 tech-mono font-bold uppercase">Ready_for_diagnostic</div>
          </div>
          <div className="flex flex-col">
            <SpecItem icon="fa-desktop" label="Display_Tech" v1={p1.specs.display} v2={p2.specs.display} />
            <SpecItem icon="fa-microchip" label="Engine_Model" v1={p1.specs.processor} v2={p2.specs.processor} />
            <SpecItem icon="fa-memory" label="Dynamic_Memory" v1={p1.specs.ram} v2={p2.specs.ram} />
            <SpecItem icon="fa-battery-full" label="Energy_Buffer" v1={p1.specs.battery} v2={p2.specs.battery} />
            <SpecItem icon="fa-camera" label="Optics_Matrix" v1={p1.specs.camera} v2={p2.specs.camera} />
          </div>
        </div>

        {/* AI Neural Analysis Section */}
        <div className="relative glass rounded-[2rem] p-6 md:p-12 border-blue-500/30 bg-gradient-to-br from-blue-600/[0.05] to-transparent overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 md:opacity-20">
             <i className="fas fa-brain text-blue-500/10 text-7xl md:text-9xl"></i>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                 <i className="fas fa-robot text-blue-500 text-xs md:text-base"></i>
               </div>
               <div>
                  <h4 className="text-blue-400 font-black uppercase text-[10px] md:text-xs tracking-[0.3em] tech-mono">
                    AI_Neural_Diagnostic_Report
                  </h4>
                  <div className="flex gap-1 mt-1">
                    <div className="w-1.5 h-1 bg-blue-500 rounded-full"></div>
                    <div className="w-6 h-1 bg-blue-500/20 rounded-full"></div>
                  </div>
               </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center py-8 md:py-12 gap-6 md:gap-8">
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="tech-mono text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest animate-pulse text-center px-4">
                    EXECUTING_DEEP_HARDWARE_CROSS-REFERENCE...
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 md:gap-10">
                 <div className="flex-1 space-y-4 md:space-y-6">
                    {analysis ? (
                      <div className="text-slate-300 leading-relaxed text-xs md:text-base font-medium space-y-3 md:space-y-4">
                        {analysis.split('\n').map((line, idx) => (
                          <p key={idx} className={line.includes('CONCLUSÃO') ? "text-blue-400 font-black border-t border-blue-500/20 pt-4 mt-6 text-sm md:text-lg tracking-tight" : "pl-4 md:pl-6 border-l-2 border-blue-500/10"}>
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center tech-mono text-slate-600 text-[10px]">Aguardando gatilho de análise...</div>
                    )}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-8 border-t border-blue-500/5">
                    <button className="flex-1 py-4 md:py-5 bg-white text-black font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-xl md:rounded-2xl hover:bg-blue-400 hover:text-white transition-all shadow-xl">
                       Reservar Melhor Unidade
                    </button>
                    <button onClick={onClose} className="px-6 md:px-10 py-4 md:py-5 glass text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-xl md:rounded-2xl border border-blue-500/20 hover:bg-blue-500/10 transition-all tech-mono">
                       Fechar_Log
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ComparisonModal;
