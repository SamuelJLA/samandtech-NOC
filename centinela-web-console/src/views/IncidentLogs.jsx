import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Bell, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

const IncidentLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      // Nota: Necesitarás crear la tabla 'incident_logs' en Supabase
      const { data } = await supabase
        .from('incident_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setLogs(data);
    };

    fetchLogs();
    
    // Suscripción Realtime para ver nuevos logs caer en vivo
    const channel = supabase.channel('realtime-logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_logs' }, (payload) => {
        setLogs(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="p-10 bg-[#020617] min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
          <Bell className="text-cyan-400" size={32} />
          Historial de <span className="text-cyan-400">Incidentes</span>
        </h1>
        <p className="text-slate-500 text-xs font-mono tracking-[0.3em] uppercase mt-2">
          Registro cronológico de eventos críticos
        </p>
      </header>

      <div className="max-w-4xl space-y-4">
        {logs.length === 0 ? (
          <div className="p-10 border border-dashed border-slate-800 rounded-[2.5rem] text-center">
            <p className="text-slate-600 font-mono text-sm uppercase tracking-widest">No se han registrado incidentes recientes</p>
          </div>
        ) : (
          logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))
        )}
      </div>
    </div>
  );
};

const LogCard = ({ log }) => {
  const isCritical = log.event_type === 'offline';
  const time = new Date(log.created_at).toLocaleTimeString();
  const date = new Date(log.created_at).toLocaleDateString();

  return (
    <div className={`p-5 rounded-3xl border transition-all flex items-center justify-between group ${
      isCritical ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/10'
    }`}>
      <div className="flex items-center gap-6">
        <div className={`p-3 rounded-2xl ${isCritical ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500 text-white'}`}>
          {isCritical ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-tight">
            {log.asset_name} <span className="text-slate-500 mx-2">•</span> 
            <span className={isCritical ? 'text-rose-400' : 'text-emerald-400'}>
              {isCritical ? 'DESCONEXIÓN DETECTADA' : 'SISTEMA RESTABLECIDO'}
            </span>
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
            Empresa: {log.company_name} <span className="mx-2">|</span> ID: {log.asset_id.slice(0,8)}...
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center justify-end gap-2 text-slate-400 mb-1">
          <Clock size={12} />
          <span className="text-[10px] font-mono font-bold">{time}</span>
        </div>
        <p className="text-[9px] text-slate-600 font-mono font-bold uppercase">{date}</p>
      </div>
    </div>
  );
};

export default IncidentLogs;