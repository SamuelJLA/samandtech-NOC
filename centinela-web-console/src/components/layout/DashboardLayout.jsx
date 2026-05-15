import React from 'react';
import { LayoutDashboard, Network, Database, Bell, Settings } from 'lucide-react';

const DashboardLayout = ({ children, currentView, onNavigate }) => {
  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a]/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 text-center border-b border-slate-800/50 mb-4">
          <h2 className="text-xl font-black tracking-tighter text-white italic">
            SAMAND<span className="text-cyan-400">TECH</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            label="Panel Global" 
            icon={<LayoutDashboard size={18}/>}
            active={currentView === 'global'} 
            onClick={() => onNavigate('global')} 
          />
          <NavItem 
            label="Mapa de Red" 
            icon={<Network size={18}/>}
            active={currentView === 'noc'} 
            onClick={() => onNavigate('noc')} 
          />
          <NavItem 
            label="Inventario ITAM" 
            icon={<Database size={18}/>}
            active={currentView === 'inventory'} 
            onClick={() => onNavigate('inventory')} 
          />
          <NavItem 
            label="Logs de Alertas" 
            icon={<Bell size={18}/>}
            active={currentView === 'alerts'} 
            onClick={() => onNavigate('alerts')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <NavItem 
            label="Configuración" 
            icon={<Settings size={18}/>}
            active={currentView === 'settings'} 
            onClick={() => onNavigate('settings')} 
          />
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

// Sub-componente NavItem actualizado
const NavItem = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
      active 
      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]' 
      : 'hover:bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent'
    }`}
  >
    <span className={`${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
      {icon}
    </span>
    <span className="text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
      {label}
    </span>
  </button>
);

export default DashboardLayout;