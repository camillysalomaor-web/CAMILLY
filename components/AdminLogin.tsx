
import React, { useState } from 'react';
import { UI_TEXT } from '../config';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === UI_TEXT.admin.passcode) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        setPasscode('');
        setIsSuccess(false);
      }, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md transition-all">
      <div className="absolute inset-0 bg-slate-950/80" onClick={onClose} />
      
      <div className={`relative glass w-full max-w-sm rounded-[2.5rem] p-10 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.1)] transition-all duration-500 ${error ? 'animate-shake' : ''} ${isSuccess ? 'scale-105 border-green-500/50 shadow-green-500/20' : ''}`}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 transition-colors ${isSuccess ? 'bg-green-500/20 border-green-500/40' : 'bg-blue-600/10 border-blue-500/20'}`}>
             <i className={`fas ${isSuccess ? 'fa-check text-green-500' : 'fa-shield-halved text-blue-500'} text-2xl`}></i>
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            {isSuccess ? 'Acesso Concedido' : 'Acesso Restrito'}
          </h2>
          <p className="tech-mono text-[9px] text-slate-500 uppercase tracking-widest mt-2">
            {UI_TEXT.admin.terminalName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="tech-mono text-[9px] text-blue-500 uppercase tracking-widest block mb-2 px-1">Entrar_Passcode</label>
            <input 
              autoFocus
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`w-full bg-slate-900 border rounded-xl px-5 py-4 text-center text-xl tracking-[0.5em] text-white focus:ring-2 outline-none transition-all ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-blue-500/10 focus:ring-blue-500/50'}`}
              placeholder="****"
              disabled={isSuccess}
            />
          </div>
          
          {error && (
            <p className="text-red-500 tech-mono text-[9px] text-center uppercase animate-pulse">Falha na Autenticação</p>
          )}

          <button 
            type="submit"
            disabled={isSuccess}
            className={`w-full py-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg ${isSuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40'}`}
          >
            {isSuccess ? 'Iniciando Sessão...' : 'Autenticar_Sessão'}
          </button>
        </form>

        <button 
          onClick={onClose}
          className="w-full mt-4 py-2 text-slate-600 hover:text-slate-400 tech-mono text-[9px] uppercase transition-colors"
        >
          Cancelar_Operação
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
