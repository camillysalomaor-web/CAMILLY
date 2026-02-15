
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_CATALOG } from './constants';
import { Phone, SiteSettings } from './types';
import PhoneCard from './components/PhoneCard';
import ComparisonOverlay from './components/ComparisonOverlay';
import ComparisonModal from './components/ComparisonModal';
import PhoneDetailModal from './components/PhoneDetailModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ChatAssistant from './components/ChatAssistant';
import { UI_TEXT } from './config';

const App: React.FC = () => {
  const [catalog, setCatalog] = useState<Phone[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    whatsapp: UI_TEXT.brand.whatsapp,
    instagram: "https://instagram.com/costaiphones",
    siteName: UI_TEXT.brand.name + UI_TEXT.brand.highlight,
    logo: null
  });
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [compareList, setCompareList] = useState<Phone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailPhone, setDetailPhone] = useState<Phone | null>(null);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Inicializar catálogo e configurações do localStorage
  useEffect(() => {
    const savedCatalog = localStorage.getItem('costa_iphones_catalog');
    if (savedCatalog) {
      setCatalog(JSON.parse(savedCatalog));
    } else {
      setCatalog(INITIAL_CATALOG);
      localStorage.setItem('costa_iphones_catalog', JSON.stringify(INITIAL_CATALOG));
    }

    const savedSettings = localStorage.getItem('costa_iphones_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const brands = useMemo(() => ['Todas', ...Array.from(new Set(catalog.map(p => p.brand)))], [catalog]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = selectedBrand === 'Todas' || p.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [catalog, search, selectedBrand]);

  const handleToggleCompare = (phone: Phone) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === phone.id)) {
        return prev.filter(p => p.id !== phone.id);
      }
      if (prev.length >= 2) return [prev[1], phone];
      return [...prev, phone];
    });
  };

  const updateCatalog = (newCatalog: Phone[]) => {
    setCatalog(newCatalog);
    localStorage.setItem('costa_iphones_catalog', JSON.stringify(newCatalog));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('costa_iphones_settings', JSON.stringify(newSettings));
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setShowDashboard(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Admin Floating Access */}
      {!isAdmin ? (
        <button 
          onClick={() => setShowLogin(true)}
          className="fixed bottom-6 left-6 z-[120] w-10 h-10 md:w-12 md:h-12 rounded-full glass border border-blue-500/20 flex items-center justify-center text-slate-600 hover:text-blue-400 hover:glow-border transition-all shadow-lg"
        >
          <i className="fas fa-cog text-sm md:text-base"></i>
        </button>
      ) : (
        <button 
          onClick={() => setShowDashboard(true)}
          className="fixed bottom-6 left-6 z-[120] w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all"
        >
          <i className="fas fa-terminal text-sm md:text-base"></i>
        </button>
      )}

      {/* Navbar Tech Refinada */}
      <nav className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)] overflow-hidden shrink-0">
               {settings.logo ? (
                 <img src={settings.logo} className="w-full h-full object-contain" alt="Logo" />
               ) : (
                 <i className="fab fa-apple text-blue-400 text-lg md:text-xl"></i>
               )}
            </div>
            <span className="text-sm md:text-2xl font-black tracking-tighter text-white uppercase italic whitespace-nowrap">
              {settings.siteName}
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex relative mr-2">
              <input 
                type="text" 
                placeholder={UI_TEXT.catalog.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 lg:w-64 bg-slate-900/50 border border-blue-500/10 rounded-xl px-10 py-2.5 text-xs focus:ring-2 focus:ring-blue-500/50 outline-none text-white transition-all"
              />
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500/30 text-xs"></i>
            </div>
            <button 
              onClick={() => compareList.length === 2 && setIsModalOpen(true)}
              disabled={compareList.length < 2}
              className={`px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                compareList.length === 2 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40' 
                : 'bg-slate-900 text-slate-600 border border-blue-500/5 cursor-not-allowed'
              }`}
            >
              {compareList.length === 2 ? "Comparar" : `${compareList.length}/2 Compare`}
            </button>
          </div>
        </div>
        {/* Mobile Search Row */}
        <div className="md:hidden px-4 pb-3">
            <div className="relative">
                <input 
                  type="text" 
                  placeholder={UI_TEXT.catalog.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/10 rounded-lg px-9 py-2 text-xs outline-none text-white transition-all"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/30 text-[10px]"></i>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 md:py-32 px-4 md:px-6 overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=2000&auto=format&fit=crop" 
              alt="iPhone Background" 
              className="w-full h-full object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05070a]/90 via-transparent to-[#05070a] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/40 to-[#05070a]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 md:mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            {UI_TEXT.hero.badge}
          </div>
          <h1 className="text-3xl md:text-8xl font-black text-white mb-4 md:mb-8 tracking-tighter uppercase italic leading-tight drop-shadow-2xl">
            {UI_TEXT.hero.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              {UI_TEXT.hero.highlight}
            </span>
          </h1>
          <p className="text-sm md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-lg px-2">
            {UI_TEXT.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 w-full py-8 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-6 md:gap-8 border-l-2 border-blue-500/10 pl-4 md:pl-6">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase tech-mono">catálogo de aparelhos</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {brands.map(brand => (
                <button 
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`whitespace-nowrap px-6 md:px-8 py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedBrand === brand 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                    : 'bg-slate-900/50 border-blue-500/10 text-slate-500 hover:border-blue-500/30'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:block tech-mono text-[10px] text-slate-600 font-bold uppercase tracking-widest bg-slate-900/30 px-4 py-2 rounded-lg whitespace-nowrap">
            Active_Units: {filteredCatalog.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
          {filteredCatalog.length > 0 ? (
            filteredCatalog.map(phone => (
              <PhoneCard 
                key={phone.id} 
                phone={phone} 
                onCompare={handleToggleCompare}
                isComparing={compareList.some(p => p.id === phone.id)}
                whatsappNumber={settings.whatsapp}
                onOpenDetail={() => setDetailPhone(phone)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 md:py-20 text-center glass rounded-3xl border-dashed border-slate-800">
               <i className="fas fa-box-open text-slate-800 text-4xl md:text-6xl mb-4"></i>
               <p className="tech-mono text-slate-600 uppercase font-bold text-xs md:text-sm px-4">Nenhuma unidade detectada no inventário.</p>
            </div>
          )}
        </div>
      </main>

      <ComparisonOverlay 
        phones={compareList} 
        onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onClear={() => setCompareList([])}
        onAnalyze={() => setIsModalOpen(true)}
      />

      <ComparisonModal 
        isOpen={isModalOpen} 
        phones={compareList} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Novo Modal de Detalhes */}
      {detailPhone && (
        <PhoneDetailModal 
          phone={detailPhone} 
          isOpen={!!detailPhone} 
          onClose={() => setDetailPhone(null)}
          catalog={catalog}
          onCompare={handleToggleCompare}
          isComparing={compareList.some(p => p.id === detailPhone.id)}
          whatsappNumber={settings.whatsapp}
        />
      )}

      {/* Admin Components */}
      <AdminLogin 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSuccess={handleAdminSuccess} 
      />
      
      <AdminDashboard 
        isOpen={showDashboard} 
        onClose={() => setShowDashboard(false)} 
        catalog={catalog} 
        onUpdate={updateCatalog}
        settings={settings}
        onUpdateSettings={updateSettings}
        onLogout={() => {
          setIsAdmin(false);
          setShowDashboard(false);
        }}
      />

      <ChatAssistant catalog={catalog} />

      <footer className="bg-slate-950/80 border-t border-blue-500/10 py-12 md:py-20 px-4 md:px-6 mt-12 md:mt-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center text-center md:text-left">
          <div className="flex flex-col gap-2 md:gap-3">
             <span className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase">
               {settings.siteName}
             </span>
             <p className="text-[10px] text-slate-500 uppercase tech-mono tracking-tighter">QUALIDADE E EXCELÊNCIA</p>
          </div>
          
          <div className="flex justify-center gap-4 md:gap-6">
             <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all border border-blue-500/5 hover:border-blue-500/40">
               <i className="fab fa-instagram text-base md:text-lg"></i>
             </a>
             <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-slate-500 hover:text-green-400 transition-all border border-blue-500/5 hover:border-blue-500/40">
               <i className="fab fa-whatsapp text-base md:text-lg"></i>
             </a>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-[9px] md:text-[10px] tech-mono text-slate-700 font-bold uppercase">© COSTA_IPHONES</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
