
import React, { useState, useRef, useEffect } from 'react';
import { getAIRecommendation } from '../services/geminiService';
import { Phone, ChatMessage } from '../types';
import { UI_TEXT } from '../config';

interface ChatAssistantProps {
  catalog: Phone[];
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ catalog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: UI_TEXT.chat.welcome }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const recommendation = await getAIRecommendation(userMsg, catalog);
    
    setMessages(prev => [...prev, { role: 'model', text: recommendation }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[110]">
      {isOpen ? (
        <div className="glass w-80 md:w-96 h-[550px] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-[#2b4a70]/40 animate-in slide-in-from-bottom-10">
          <div className="bg-[#0c0e12] p-6 flex justify-between items-center border-b border-[#2b4a70]/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2b4a70]/20 flex items-center justify-center border border-[#2b4a70]/40">
                <i className="fas fa-microchip text-[#2b4a70] text-xs"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold uppercase tracking-widest">{UI_TEXT.chat.label}</span>
                <span className="text-[8px] text-[#2b4a70] uppercase mono">{UI_TEXT.chat.subLabel}</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white transition-colors">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-[#2b4a70] text-white rounded-tr-none' 
                  : 'bg-[#1a1f26] text-slate-400 rounded-tl-none border border-[#2b4a70]/10'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a1f26] p-4 rounded-2xl rounded-tl-none flex gap-1.5 border border-[#2b4a70]/10">
                  <span className="w-1.5 h-1.5 bg-[#2b4a70] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#2b4a70] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#2b4a70] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#0c0e12]/80 border-t border-[#2b4a70]/20">
            <div className="flex gap-3">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={UI_TEXT.chat.inputPlaceholder}
                className="flex-1 bg-[#1a1f26] border border-[#2b4a70]/20 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-[#2b4a70]/60 transition-colors placeholder:text-slate-700"
              />
              <button 
                onClick={handleSend}
                className="bg-[#2b4a70] hover:bg-[#375e8c] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#0c0e12] border border-[#2b4a70]/40 rounded-full shadow-[0_0_25px_rgba(43,74,112,0.3)] flex items-center justify-center text-[#2b4a70] text-xl hover:scale-110 transition-transform group relative"
        >
          <i className="fas fa-robot"></i>
          <div className="absolute inset-0 rounded-full border border-[#2b4a70]/20 animate-ping opacity-20"></div>
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
