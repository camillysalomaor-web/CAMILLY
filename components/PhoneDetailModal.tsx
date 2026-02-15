
import React, { useMemo } from 'react';
import { Phone } from '../types';
import { UI_TEXT } from '../config';

interface PhoneDetailModalProps {
  phone: Phone;
  isOpen: boolean;
  onClose: () => void;
  catalog: Phone[];
  onCompare: (phone: Phone) => void;
  isComparing: boolean;
  whatsappNumber: string;
}

const PhoneDetailModal: React.FC<PhoneDetailModalProps> = ({ 
  phone, isOpen, onClose, catalog, onCompare, isComparing, whatsappNumber 
}) => {
  const similarPhones = useMemo(() => {
    return catalog
      .filter(p => p.id !== phone.id && (p.brand === phone.brand || Math.abs(p.price - phone.price) < 2000))
      .slice(0, 4);
  }, [catalog, phone]);

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const text = `Olá! Tenho interesse no ${phone.name}. Gostaria de mais detalhes.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const SpecGridItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <div className="bg-slate-900/40 border border-blue-500/5 p-5 rounded-2xl flex flex-col gap-3 group hover:border-blue-500/20 transition-all">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500">
             <i className={`fas ${icon} text-xs`}></i>
          </div>
          <span className="tech-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
       </div>
       <div className="text-white font-bold text-sm tech-mono group-hover:text-blue-400 transition-colors">{value}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative glass w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-y-auto border-blue-500/20 shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
        
        {/* Top Header Controls */}
        <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-blue-500/10 px-8 py-6 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <span className="tech-mono text-[10px] text-blue-500 uppercase tracking-[0.4em]">Unit_Diagnostic_Report</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full glass border border-blue-500/20 flex items-center justify-center text-slate-500 hover:text-white transition-all">
              <i className="fas fa-times"></i>
           </button>
        </div>

        <div className="p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Esquerda: Visual do Aparelho */}
            <div className="lg:col-span-5 flex flex-col gap-8">
               <div className="relative aspect-[4/5] glass rounded-[3rem] p-12 flex items-center justify-center bg-gradient-to-tr from-blue-600/5 to-transparent border-blue-500/10 overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                  <img 
                    src={phone.image} 
                    alt={phone.name} 
                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] scale-110 group-hover:rotate-3 transition-transform duration-700"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleWhatsApp} className="flex items-center justify-center gap-3 py-5 bg-green-600/10 border border-green-500/20 rounded-2xl text-green-500 font-black uppercase text-[10px] tracking-widest hover:bg-green-600 hover:text-white transition-all">
                     <i className="fab fa-whatsapp text-lg"></i>
                     Consultar Unidade
                  </button>
                  <button 
                    onClick={() => onCompare(phone)}
                    className={`flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all tech-mono border ${
                      isComparing 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                      : 'bg-slate-900/50 border-blue-500/10 text-slate-400 hover:border-blue-500/40 hover:text-white'
                    }`}
                  >
                     <i className="fas fa-balance-scale"></i>
                     {isComparing ? 'Na Comparação' : 'Adicionar ao VS'}
                  </button>
               </div>
            </div>

            {/* Direita: Dados Técnicos */}
            <div className="lg:col-span-7 flex flex-col">
               <div className="mb-10">
                  <span className="text-blue-500 font-bold uppercase tech-mono text-xs tracking-widest">{phone.brand} Authorized Unit</span>
                  <h2 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4 mt-2">{phone.name}</h2>
                  <div className="flex items-center gap-6">
                    <div className="text-4xl font-black text-white italic">
                        <span className="text-blue-500 text-xl mr-2">R$</span>
                        {phone.price.toLocaleString('pt-BR')}
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800"></div>
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => (
                         <i key={i} className={`fas fa-star text-[10px] ${i < Math.floor(phone.rating) ? 'text-blue-500' : 'text-slate-800'}`}></i>
                       ))}
                    </div>
                  </div>
               </div>

               <div className="mb-12">
                  <h3 className="tech-mono text-[10px] text-blue-500 uppercase tracking-widest mb-4 border-b border-blue-500/10 pb-2">Description_Field</h3>
                  <p className="text-slate-400 leading-relaxed text-lg italic">{phone.description}</p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <SpecGridItem icon="fa-desktop" label="Screen_Diag" value={phone.specs.display} />
                  <SpecGridItem icon="fa-microchip" label="Engine_Core" value={phone.specs.processor} />
                  <SpecGridItem icon="fa-memory" label="Buffer_RAM" value={phone.specs.ram} />
                  <SpecGridItem icon="fa-hdd" label="Static_Storage" value={phone.specs.storage} />
                  <SpecGridItem icon="fa-battery-full" label="Energy_Cap" value={phone.specs.battery} />
                  <SpecGridItem icon="fa-camera" label="Optic_Sensor" value={phone.specs.camera} />
               </div>
            </div>
          </div>

          {/* Seção Similares */}
          <div className="mt-24">
             <div className="flex items-center gap-6 mb-12">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Aparelhos <span className="text-blue-500">Similares</span></h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                <span className="tech-mono text-[9px] text-slate-600 uppercase tracking-[0.3em]">Related_Units_Matrix</span>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {similarPhones.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => {
                       onClose();
                       // Pequeno delay para a animação de fechar e reabrir
                       setTimeout(() => {
                         // Aqui chamamos o state de quem abriu o modal (App.tsx)
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                       }, 100);
                    }}
                    className="glass p-6 rounded-3xl border-blue-500/5 hover:border-blue-500/30 transition-all group cursor-pointer"
                  >
                    <div className="aspect-square flex items-center justify-center mb-6">
                       <img src={p.image} className="w-24 h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" alt={p.name} />
                    </div>
                    <h4 className="text-white font-black uppercase text-xs tracking-tighter italic mb-1">{p.name}</h4>
                    <p className="text-blue-500 font-bold tech-mono text-[10px]">R$ {p.price.toLocaleString('pt-BR')}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetailModal;
