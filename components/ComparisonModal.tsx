
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
      <div className="group py-5 border-b border-blue-500/5 hover:bg-blue-500/[0.02] transition-colors">
        <div className="flex justify-between items-center mb-3 px-4">
          <div className={`text-right w-1/3 text-sm font-bold tech-mono tracking-tighter transition-colors ${diff > 0 ? 'text-blue-400' : 'text-white'}`}>
            {v1}
            {diff > 0 && <span className="ml-2 text-[8px] bg-blue-500/20 px-1 rounded text-blue-500">ADV</span>}
          </div>
          <div className="flex flex-col items-center gap-1 w-1/4">
             <i className={`fas ${icon} text-blue-500/40 text-xs`}></i>
             <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black">{label}</span>
          </div>
          <div className={`text-left w-1/3 text-sm font-bold tech-mono tracking-tighter transition-colors ${diff < 0 ? 'text-blue-400' : 'text-white'}`}>
            {v2}
            {diff < 0 && <span className="ml-2 text-[8px] bg-blue-500/20 px-1 rounded text-blue-500">ADV</span>}
          </div>
        </div>
        <div className="flex h-1 bg-slate-900 rounded-full overflow-hidden mx-4">
           <div className={`h-full transition-all duration-1000 ${diff > 0 ? 'w-[60%] bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-1/2 bg-blue-900/30'}`}></div>
           <div className={`h-full transition-all duration-1000 ${diff < 0 ? 'w-[60%] bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'w-1/2 bg-blue-900/30'}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative glass w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[3rem] p-6 md:p-10 border-blue-500/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 scrollbar-hide">
        
        {/* Header Module */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="tech-mono text-[10px] text-blue-500 uppercase tracking-[0.5em]">Hardware_Comparison_X-Series</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full glass border border-blue-500/20 flex items-center justify-center text-slate-500 hover:text-white hover:glow-border transition-all"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Device Combat Head-to-Head */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-16 px-4">
          <div className="flex flex-col items-center">
            <div className="relative p-4 glass rounded-[2.5rem] border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.1)] group">
               <img src={p1.image} className="w-32 md:w-48 h-40 md:h-60 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white shadow-lg whitespace-nowrap">UNIT_ALPHA_01</div>
            </div>
            <h3 className="mt-8 text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter text-center">{p1.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-blue-500 tech-mono text-xs font-bold">R$ {p1.price.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full glass border-2 border-blue-500/30 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
               <span className="font-black text-2xl md:text-3xl text-white italic z-10">VS</span>
               <div className="absolute inset-0 border border-blue-500/20 animate-spin-slow rounded-full"></div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
               <span className="tech-mono text-[8px] text-slate-600 uppercase tracking-widest">Cross_Data_Analysis</span>
               <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-blue-500/10 tech-mono text-[9px] text-blue-400">
                 Diff: R$ {Math.abs(p1.price - p2.price).toLocaleString('pt-BR')}
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative p-4 glass rounded-[2.5rem] border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.1)] group">
               <img src={p2.image} className="w-32 md:w-48 h-40 md:h-60 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-400 px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white shadow-lg whitespace-nowrap">UNIT_BETA_02</div>
            </div>
            <h3 className="mt-8 text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter text-center">{p2.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-blue-400 tech-mono text-xs font-bold">R$ {p2.price.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Specification Matrix Table */}
        <div className="glass rounded-[2.5rem] overflow-hidden border-blue-500/10 mb-12">
          <div className="bg-slate-900/50 p-5 flex justify-between items-center border-b border-blue-500/10">
             <div className="flex items-center gap-2">
               <i className="fas fa-layer-group text-blue-500 text-xs"></i>
               <span className="tech-mono text-[10px] font-black text-blue-500 uppercase tracking-widest">Symmetric_Hardware_Audit</span>
             </div>
             <div className="text-[8px] text-slate-600 tech-mono font-bold uppercase">Ready_for_diagnostic</div>
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
        <div className="relative glass rounded-[2.5rem] p-8 md:p-12 border-blue-500/30 bg-gradient-to-br from-blue-600/[0.05] to-transparent overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 md:opacity-100">
             <i className="fas fa-brain text-blue-500/10 text-9xl"></i>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                 <i className="fas fa-robot text-blue-500"></i>
               </div>
               <div>
                  <h4 className="text-blue-400 font-black uppercase text-xs tracking-[0.3em] tech-mono mb-1">
                    AI_Neural_Diagnostic_Report
                  </h4>
                  <div className="flex gap-1">
                    <div className="w-2 h-1 bg-blue-500 rounded-full"></div>
                    <div className="w-8 h-1 bg-blue-500/20 rounded-full"></div>
                  </div>
               </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center py-12 gap-8">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm border border-blue-500/40 ${scanStep >= i ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-transparent'} transition-all`}></div>
                    ))}
                  </div>
                  <div className="tech-mono text-[10px] text-slate-500 uppercase tracking-widest animate-pulse mt-4">
                    EXECUTING_DEEP_HARDWARE_CROSS-REFERENCE...
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                 <div className="flex-1 space-y-6">
                    {analysis ? (
                      <div className="text-slate-300 leading-relaxed text-sm md:text-base font-medium space-y-4">
                        {analysis.split('\n').map((line, idx) => (
                          <p key={idx} className={line.includes('CONCLUSÃO') ? "text-blue-400 font-black border-t border-blue-500/20 pt-4 mt-6 text-lg tracking-tight" : "pl-6 border-l-2 border-blue-500/10"}>
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center tech-mono text-slate-600 text-xs">Aguardando gatilho de análise...</div>
                    )}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-blue-500/5">
                    <button className="flex-1 py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-blue-400 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl">
                       Reservar Melhor Unidade
                    </button>
                    <button className="px-10 py-5 glass text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl border border-blue-500/20 hover:bg-blue-500/10 transition-all tech-mono">
                       Gerar Log PDF
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ComparisonModal;
