import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Database, 
  Bell, 
  Settings, 
  LogOut, 
  User 
} from 'lucide-react';
import { supabase } from '../../api/supabaseClient';

const DashboardLayout = ({ children, currentView, onNavigate, userProfile }) => {
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error al cerrar sesión:', error.message);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a]/50 backdrop-blur-xl flex flex-col">
        
        {/* BRANDING ACTUALIZADO */}
        <div className="p-6 text-center border-b border-slate-800/50 mb-4">
          <h2 className="text-xl font-black tracking-tighter text-white italic uppercase">
            SAMAND<span className="text-cyan-400">TECH</span>
            <span className="text-slate-500 text-[10px] ml-1">.NOC</span>
          </h2>
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
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
           <NavItem 
            label="Simulador (Dev)" 
            icon={<Settings size={18}/>}
            active={currentView === 'settings'} 
            onClick={() => onNavigate('settings')} 
          />
        </nav>

        {/* SECCIÓN INFERIOR: PERFIL Y LOGOUT */}
        <div className="p-4 border-t border-slate-800/50 space-y-3">
          
          {/* Tarjeta de Usuario */}
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <User size={16} className="text-cyan-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase truncate">
                {userProfile?.full_name || 'Operador'}
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                {userProfile?.role || 'Técnico'}
              </p>
            </div>
          </div>

          {/* Botón Cerrar Sesión */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 border border-transparent group"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

// Sub-componente NavItem
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