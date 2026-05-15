import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Zap, Power, PowerOff, RefreshCw } from 'lucide-react';

const Simulator = ({ companyId }) => {
  const [assets, setAssets] = useState([]);

  const fetchAssets = async () => {
    const { data } = await supabase
      .from('assets')
      .select('*')
      .eq('company_id', companyId);
    if (data) setAssets(data);
  };

  useEffect(() => {
    fetchAssets();
  }, [companyId]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';
    
    // 1. Actualizamos el equipo
    const { error } = await supabase
      .from('assets')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      // 2. 🚀 OPCIONAL: Insertar manualmente el log para probar la vista de Incidentes
      // Si configuraste el Trigger en la DB, esto no hace falta.
      await supabase.from('incident_logs').insert([{
        asset_id: id,
        asset_name: assets.find(a => a.id === id).name,
        company_id: companyId,
        company_name: "Empresa Prueba",
        event_type: newStatus
      }]);
      
      fetchAssets(); // Refrescar lista local
    }
  };

  return (
    <div className="p-10 bg-[#020617] min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <Zap className="text-yellow-400" /> Entorno de <span className="text-yellow-400">Pruebas</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Simulación de caídas y estados</p>
        </div>
        <button onClick={fetchAssets} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white">
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-xs font-black text-white uppercase">{asset.name}</p>
              <p className="text-[9px] text-slate-500 font-mono uppercase">{asset.category}</p>
            </div>
            
            <button 
              onClick={() => toggleStatus(asset.id, asset.status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] transition-all ${
                asset.status === 'online' 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}
            >
              {asset.status === 'online' ? <Power size={14}/> : <PowerOff size={14}/>}
              {asset.status.toUpperCase()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Simulator;