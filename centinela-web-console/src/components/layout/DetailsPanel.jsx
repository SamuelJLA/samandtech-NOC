import React from 'react'; // 🚀 IMPORTACIÓN CRÍTICA PARA MATAR EL ERROR
import { 
  Cpu, HardDrive, Thermometer, Wifi, 
  User, ShieldCheck, Tag, Info 
} from 'lucide-react';

const DetailsPanel = ({ node, onClose }) => {
  if (!node) return null;

  // Extraemos la data real que viene de Supabase a través del nodo
  const asset = node.data;
  const isOffline = asset.status === 'offline';

  return (
    <div className="w-96 border-l border-slate-800 bg-[#0f172a]/90 backdrop-blur-2xl flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      
      {/* Header del Panel */}
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/20">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">
            {asset.label || asset.name}
          </h3>
          <p className="text-[10px] text-cyan-400 font-mono tracking-widest">
            {asset.ip_address || 'SIN IP ASIGNADA'}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Status Quick View */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isOffline 
          ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
          : 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOffline ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {isOffline ? 'OFFLINE' : 'OPERATIONAL'}
            </span>
          </div>
        </div>

        {/* 📋 Especificaciones Técnicas (Info Real del Inventario) */}
        <section className="space-y-3">
          <SectionHeader icon={<Info size={14}/>} label="Especificaciones" />
          <div className="grid grid-cols-1 gap-2">
            <DataRow label="Categoría" value={asset.category} icon={<Tag size={12}/>} />
            <DataRow label="MAC Address" value={asset.mac_address || '---'} icon={<ShieldCheck size={12}/>} />
            <DataRow label="Último Usuario" value={asset.last_user || 'N/A'} icon={<User size={12}/>} />
            <DataRow label="Ubicación" value={asset.location || 'Oficina Central'} icon={<Wifi size={12}/>} />
          </div>
        </section>

        {/* 📊 Telemetría en Tiempo Real (Placeholder para el Agente) */}
        <section className="space-y-4 pt-4 border-t border-slate-800/50">
          <SectionHeader icon={<Cpu size={14}/>} label="Telemetría Live" />
          
          <MetricBar label="CPU Load" value="24%" width="24%" color="bg-cyan-500" />
          <MetricBar label="RAM Usage" value="4.2 GB" width="45%" color="bg-purple-500" />
          <MetricBar label="Temp" value="42°C" width="40%" color="bg-yellow-500" />
        </section>

      </div>

      {/* Footer del Panel */}
      <div className="p-4 bg-black/40 text-center">
        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.3em]">
          SAMANDTECH NOC • SECURITY AGENT v1.0
        </p>
      </div>
    </div>
  );
};

// Sub-componentes para mantener el código limpio
const SectionHeader = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-2 text-slate-500">
    {icon}
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const DataRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[9px] font-bold uppercase">{label}</span>
    </div>
    <span className="text-[10px] font-mono text-white font-bold">{value}</span>
  </div>
);

const MetricBar = ({ label, value, width, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[10px] font-bold">
      <span className="text-slate-500 uppercase">{label}</span>
      <span className="text-white font-mono">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width }}></div>
    </div>
  </div>
);

export default DetailsPanel;