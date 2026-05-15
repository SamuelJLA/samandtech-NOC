import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { 
  Building2, AlertTriangle, CheckCircle2, 
  Server, ShieldAlert, ChevronRight, Activity 
} from 'lucide-react';

const DashboardGlobal = ({ onSelectCompany }) => {
  const [companiesHealth, setCompaniesHealth] = useState([]);
  const [globalStatus, setGlobalStatus] = useState('green');

  const fetchGlobalStatus = async () => {
    // 1. Traemos empresas y assets en paralelo
    const [resCompanies, resAssets] = await Promise.all([
      supabase.from('companies').select('id, name'),
      supabase.from('assets').select('*')
    ]);

    if (resCompanies.data && resAssets.data) {
      const assets = resAssets.data;
      
      // 2. Mapeamos salud por empresa
      const processed = resCompanies.data.map(company => {
        const companyAssets = assets.filter(a => a.company_id === company.id);
        
        // Lógica de criticidad
        const hasCritical = companyAssets.some(a => a.status === 'offline' && a.is_critical);
        const hasWarning = companyAssets.some(a => a.status === 'offline' && !hasCritical);

        let status = 'green';
        if (hasCritical) status = 'red';
        else if (hasWarning) status = 'yellow';

        return { ...company, assets: companyAssets, status };
      });

      // 3. 🚀 ORDEN DE PRIORIDAD: Rojo > Amarillo > Verde
      const priorityOrder = { red: 1, yellow: 2, green: 3 };
      const sorted = processed.sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status]);

      setCompaniesHealth(sorted);

      // 4. Determinar estado global para el Banner
      if (sorted.some(c => c.status === 'red')) setGlobalStatus('red');
      else if (sorted.some(c => c.status === 'yellow')) setGlobalStatus('yellow');
      else setGlobalStatus('green');
    }
  };

  useEffect(() => {
    fetchGlobalStatus();
    const sub = supabase.channel('global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, fetchGlobalStatus)
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#020617] overflow-hidden">
      
      {/* 🚩 BANNER DE PÁNICO / ESTADO GLOBAL */}
      <div className={`py-3 px-8 flex items-center justify-between transition-colors duration-500 ${
        globalStatus === 'red' ? 'bg-rose-600' : globalStatus === 'yellow' ? 'bg-amber-600' : 'bg-emerald-600/20 border-b border-emerald-500/10'
      }`}>
        <div className="flex items-center gap-3">
          {globalStatus === 'red' ? <ShieldAlert className="animate-bounce text-white" /> : <CheckCircle2 className="text-emerald-400" />}
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
            {globalStatus === 'red' ? 'Atención: Fallas Críticas Detectadas' : globalStatus === 'yellow' ? 'Advertencia: Intermitencia en Red' : 'Sistemas Protegidos - Samandtech'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-white/60 uppercase">Estado Global en Tiempo Real</div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
            Centro de<span className="text-cyan-400"> Control</span>
          </h1>
        </header>

        {/* 🗂️ GRID DE EMPRESAS ORDENADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {companiesHealth.map((company) => (
            <CompanySquare 
              key={company.id} 
              company={company} 
              onClick={() => onSelectCompany(company.id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CompanySquare = ({ company, onClick }) => {
  const themes = {
    red: { border: 'border-rose-500', bg: 'bg-rose-500/10', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]', text: 'text-rose-400', label: 'CRÍTICO' },
    yellow: { border: 'border-amber-500/40', bg: 'bg-amber-500/5', glow: '', text: 'text-amber-400', label: 'ADVERTENCIA' },
    green: { border: 'border-slate-800', bg: 'bg-slate-900/40', glow: '', text: 'text-emerald-400', label: 'ESTABLE' }
  };

  const theme = themes[company.status];

  return (
    <div 
      onClick={onClick}
      className={`group relative p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:scale-[1.03] ${theme.border} ${theme.bg} ${theme.glow}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-black/40 ${theme.text}`}>
          <Building2 size={24} />
        </div>
        <div className={`text-[8px] font-black px-2 py-1 rounded border uppercase tracking-tighter ${theme.text} ${theme.border}`}>
          {theme.label}
        </div>
      </div>

      <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight mb-4 group-hover:text-cyan-400 transition-colors">
        {company.name}
      </h3>

      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-white/5 pt-4">
        <span>{company.assets.length} Activos</span>
        <div className="flex items-center gap-1 text-cyan-400">
          Gestionar <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default DashboardGlobal;