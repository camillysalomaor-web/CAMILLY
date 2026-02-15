
import React, { useState, useRef } from 'react';
import { Phone, SiteSettings } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: Phone[];
  onUpdate: (newCatalog: Phone[]) => void;
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, catalog, onUpdate, settings, onUpdateSettings, onLogout }) => {
  const [view, setView] = useState<'list' | 'add' | 'settings'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [newPhone, setNewPhone] = useState<Partial<Phone>>({
    brand: 'Apple',
    specs: {
      display: '',
      processor: '',
      ram: '',
      storage: '',
      battery: '',
      camera: ''
    }
  });

  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Arquivo muito grande. Limite de 2MB para otimização de banco de dados local.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        handleInputChange('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("A logo deve ter menos de 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempSettings(prev => ({ ...prev, logo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Confirmar desativação permanente desta unidade do inventário?')) {
      onUpdate(catalog.filter(p => p.id !== id));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.image) {
      alert("Por favor, faça o upload de uma imagem do hardware.");
      return;
    }
    const id = Date.now().toString();
    const phoneToAdd = { ...newPhone, id } as Phone;
    onUpdate([...catalog, phoneToAdd]);
    setView('list');
    setImagePreview(null);
    setNewPhone({
      brand: 'Apple',
      specs: { display: '', processor: '', ram: '', storage: '', battery: '', camera: '' }
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    alert('Identidade visual e configurações atualizadas!');
  };

  const handleInputChange = (field: string, value: any) => {
    setNewPhone(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (spec: string, value: string) => {
    setNewPhone(prev => ({
      ...prev,
      specs: { ...prev.specs!, [spec]: value }
    }));
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" />
      
      <div className="relative glass w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden flex flex-col border-blue-500/30">
        {/* Admin Header */}
        <div className="bg-slate-900/50 p-8 border-b border-blue-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] overflow-hidden">
                {settings.logo ? (
                  <img src={settings.logo} className="w-full h-full object-contain" />
                ) : (
                  <i className="fas fa-terminal text-white"></i>
                )}
             </div>
             <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Central de Inventário</h2>
                <p className="tech-mono text-[9px] text-blue-500 uppercase tracking-[0.3em]">Hardware Management System v2.4</p>
             </div>
          </div>

          <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-blue-500/5">
             <button 
               onClick={() => setView('list')}
               className={`px-6 py-3 rounded-xl tech-mono text-[10px] uppercase font-bold transition-all ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Inventário
             </button>
             <button 
               onClick={() => setView('add')}
               className={`px-6 py-3 rounded-xl tech-mono text-[10px] uppercase font-bold transition-all ${view === 'add' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Injetar_Novo
             </button>
             <button 
               onClick={() => setView('settings')}
               className={`px-6 py-3 rounded-xl tech-mono text-[10px] uppercase font-bold transition-all ${view === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Marca_E_Links
             </button>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={onLogout} className="text-red-500 tech-mono text-[10px] uppercase hover:text-red-400 transition-colors">Log_Out</button>
             <button onClick={onClose} className="w-10 h-10 rounded-full glass border border-blue-500/20 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                <i className="fas fa-times"></i>
             </button>
          </div>
        </div>

        {/* Admin Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.03),transparent)]">
          {view === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {catalog.map(phone => (
                <div key={phone.id} className="glass p-6 rounded-3xl border-blue-500/10 flex gap-6 items-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src={phone.image} className="w-20 h-24 object-contain drop-shadow-lg" />
                  <div className="flex-1 relative z-10">
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-lg">{phone.name}</h4>
                    <p className="tech-mono text-[9px] text-blue-500 uppercase tracking-widest">{phone.brand}</p>
                    <p className="text-white font-bold mt-2 tech-mono">R$ {phone.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(phone.id)}
                    className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center relative z-10"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {view === 'add' && (
            <form onSubmit={handleAdd} className="max-w-5xl mx-auto space-y-12">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Upload Section */}
                  <div className="lg:col-span-4 space-y-6">
                    <h3 className="tech-mono text-[10px] text-blue-500 uppercase tracking-widest border-b border-blue-500/10 pb-2">Hardware_Image_Capture</h3>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-[4/5] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${imagePreview ? 'border-blue-500/40 bg-slate-900' : 'border-slate-800 hover:border-blue-500/30 bg-slate-900/30'}`}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-contain p-8 drop-shadow-2xl animate-in fade-in duration-500" />
                          <div className="absolute inset-0 bg-blue-600/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="tech-mono text-[10px] text-white bg-blue-600 px-4 py-2 rounded-full font-bold">Trocar_Arquivo</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <i className="fas fa-cloud-upload-alt text-slate-700 text-4xl mb-4"></i>
                          <p className="tech-mono text-[10px] text-slate-500 uppercase font-bold tracking-widest">Clique ou arraste o hardware</p>
                          <p className="text-[8px] text-slate-700 mt-2 uppercase">PNG, JPG (MAX 2MB)</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="tech-mono text-[10px] text-blue-500 uppercase tracking-widest border-b border-blue-500/10 pb-2">Identificação_Primária</h3>
                      <div className="space-y-4">
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Device_Name</label>
                            <input required type="text" onChange={(e) => handleInputChange('name', e.target.value)} className="admin-input" placeholder="Ex: iPhone 16 Pro Max" />
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Brand_Source</label>
                            <select onChange={(e) => handleInputChange('brand', e.target.value)} className="admin-input">
                              <option value="Apple">Apple</option>
                              <option value="Samsung">Samsung</option>
                              <option value="Xiaomi">Xiaomi</option>
                              <option value="Google">Google</option>
                              <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Unit_Price (BRL)</label>
                            <input required type="number" onChange={(e) => handleInputChange('price', Number(e.target.value))} className="admin-input" placeholder="8500" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="tech-mono text-[10px] text-blue-500 uppercase tracking-widest border-b border-blue-500/10 pb-2">Hardware_Specs_Matrix</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Display_Panel</label>
                            <input required type="text" onChange={(e) => handleSpecChange('display', e.target.value)} className="admin-input" placeholder="6.7 OLED" />
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Process_Unit</label>
                            <input required type="text" onChange={(e) => handleSpecChange('processor', e.target.value)} className="admin-input" placeholder="A18 Pro" />
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Buffer_RAM</label>
                            <input required type="text" onChange={(e) => handleSpecChange('ram', e.target.value)} className="admin-input" placeholder="8GB" />
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Storage_Drive</label>
                            <input required type="text" onChange={(e) => handleSpecChange('storage', e.target.value)} className="admin-input" placeholder="256GB" />
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Energy_Cell</label>
                            <input required type="text" onChange={(e) => handleSpecChange('battery', e.target.value)} className="admin-input" placeholder="4500 mAh" />
                        </div>
                        <div>
                            <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Optic_Sensor</label>
                            <input required type="text" onChange={(e) => handleSpecChange('camera', e.target.value)} className="admin-input" placeholder="48MP" />
                        </div>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="pt-10 border-t border-blue-500/10 flex justify-end">
                  <button type="submit" className="px-12 py-5 bg-blue-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                     Protocolo_Injeção_Confirmar
                  </button>
               </div>
            </form>
          )}

          {view === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-4xl mx-auto space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="tech-mono text-[10px] text-blue-500 uppercase tracking-widest border-b border-blue-500/10 pb-2">Identidade_Visual</h3>
                    
                    <div className="space-y-6">
                      <div>
                          <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Nome_Principal_Site</label>
                          <input 
                            required 
                            type="text" 
                            value={tempSettings.siteName}
                            onChange={(e) => setTempSettings({...tempSettings, siteName: e.target.value})}
                            className="admin-input" 
                            placeholder="Ex: COSTA iPhones" 
                          />
                      </div>

                      <div>
                          <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Upload_Logo_Marca</label>
                          <div 
                            onClick={() => logoInputRef.current?.click()}
                            className="relative w-full h-32 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/50 flex items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all overflow-hidden"
                          >
                            {tempSettings.logo ? (
                              <img src={tempSettings.logo} className="h-full w-full object-contain p-4" />
                            ) : (
                              <div className="text-center">
                                <i className="fas fa-image text-slate-700 text-2xl mb-2"></i>
                                <p className="tech-mono text-[8px] text-slate-500 uppercase tracking-widest">Selecionar Logo</p>
                              </div>
                            )}
                            <input 
                              type="file" 
                              ref={logoInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleLogoChange}
                            />
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="tech-mono text-[10px] text-blue-500 uppercase tracking-widest border-b border-blue-500/10 pb-2">Protocolos_De_Contato</h3>
                    <div className="space-y-6">
                       <div>
                          <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">WhatsApp_Contact_Number (Com DDD)</label>
                          <input 
                             required 
                             type="text" 
                             value={tempSettings.whatsapp}
                             onChange={(e) => setTempSettings({...tempSettings, whatsapp: e.target.value})}
                             className="admin-input" 
                             placeholder="Ex: 5573981629453" 
                          />
                          <p className="text-[8px] text-slate-500 mt-1 uppercase">Apenas números, incluindo o código do país (55).</p>
                       </div>
                       <div>
                          <label className="tech-mono text-[9px] text-slate-600 uppercase block mb-2">Instagram_Profile_URL</label>
                          <input 
                             required 
                             type="text" 
                             value={tempSettings.instagram}
                             onChange={(e) => setTempSettings({...tempSettings, instagram: e.target.value})}
                             className="admin-input" 
                             placeholder="https://instagram.com/seuusuario" 
                          />
                       </div>
                    </div>
                  </div>
               </div>

               <div className="pt-10 border-t border-blue-500/10 flex justify-end">
                  <button type="submit" className="px-12 py-5 bg-green-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                     Protocolo_Sync_Confirmar
                  </button>
               </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 1rem;
          padding: 1rem 1.5rem;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          outline: none;
          transition: all 0.3s;
        }
        .admin-input:focus {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
