
import React, { useState } from 'react';
import { Phone } from '../types';
import { UI_TEXT } from '../config';

interface PhoneCardProps {
  phone: Phone;
  onCompare: (phone: Phone) => void;
  isComparing: boolean;
  whatsappNumber: string;
  onOpenDetail: () => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, onCompare, isComparing, whatsappNumber, onOpenDetail }) => {
  const [imgSrc, setImgSrc] = useState(phone.image);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Olá! Gostaria de mais informações sobre o ${phone.name}.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      onClick={onOpenDetail}
      className="group cursor-pointer glass rounded-2xl md:rounded-[2.5rem] overflow-hidden flex flex-col h-full border-blue-500/5 hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]"
    >
      {/* Visual Header */}
      <div className="relative aspect-[4/5] p-6 md:p-10 flex items-center justify-center bg-gradient-to-b from-slate-900/30 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <img 
          src={imgSrc} 
          alt={phone.name} 
          onError={() => setImgSrc(UI_TEXT.images.fallback)}
          className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        />
        
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-1.5 md:gap-2">
          <span className="tech-mono text-[8px] md:text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-2 py-0.5 md:px-3 md:py-1 rounded-lg border border-blue-500/20">
            {phone.brand}
          </span>
          <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-1 h-1 rounded-full ${i < Math.floor(phone.rating) ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
             ))}
          </div>
        </div>

        <button 
          onClick={handleWhatsApp}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 md:w-10 md:h-10 rounded-full glass flex items-center justify-center text-slate-500 hover:text-green-500 hover:glow-border transition-all z-10 shadow-md"
        >
          <i className="fab fa-whatsapp text-sm md:text-base"></i>
        </button>
      </div>

      {/* Info Section */}
      <div className="p-5 md:p-8 pt-0 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3 md:mb-4">
            <div>
                <h3 className="text-lg md:text-xl font-black text-white mb-0.5 md:mb-1 uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors line-clamp-1">{phone.name}</h3>
                <p className="tech-mono text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest">Serial: #{phone.id.padStart(4, '0')}</p>
            </div>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-8">
            <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg bg-slate-900 border border-blue-500/10 tech-mono text-[8px] md:text-[9px] text-slate-400 uppercase">
                {phone.specs.processor.split(' ')[0]}
            </div>
            <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg bg-slate-900 border border-blue-500/10 tech-mono text-[8px] md:text-[9px] text-slate-400 uppercase">
                {phone.specs.ram}
            </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 md:mb-8">
            <span className="tech-mono text-[8px] md:text-[10px] text-slate-600 block mb-0.5 md:mb-1 uppercase">Price_Assessment</span>
            <span className="text-xl md:text-3xl font-black text-white italic tracking-tighter">
                <span className="text-blue-500 text-sm md:text-lg mr-1 font-bold">R$</span>
                {phone.price.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCompare(phone);
              }}
              className={`py-3 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border tech-mono ${
                isComparing 
                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                : 'bg-slate-900/50 border-blue-500/10 text-slate-400 hover:border-blue-500/40 hover:text-white'
              }`}
            >
              {isComparing ? 'Comparing' : 'Compare'}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
              className="py-3 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-blue-400 hover:text-white transition-all tech-mono"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
