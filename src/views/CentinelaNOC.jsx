import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { 
  ReactFlow, Background, Controls, 
  applyEdgeChanges, applyNodeChanges, addEdge,
  Handle, Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '../api/supabaseClient';
import { useMonitoring } from '../hooks/useMonitoring';
import { 
  Monitor, Laptop, Server, Cpu, Network, Router, Wifi, Radio, 
  ShieldCheck, Camera, BatteryCharging, Printer, Fingerprint, 
  Phone, Box, X, Trash2, ChevronDown 
} from 'lucide-react';

// --- CONFIGURACIÓN DE ICONOS ---
const ICON_CONFIG = {
  "PC Escritorio": { icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
  "Laptop": { icon: Laptop, color: "text-blue-400", bg: "bg-blue-400/10" },
  "Servidor": { icon: Server, color: "text-blue-600", bg: "bg-blue-600/10" },
  "Workstation": { icon: Cpu, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  "Switch": { icon: Network, color: "text-green-500", bg: "bg-green-500/10" },
  "Router": { icon: Router, color: "text-green-600", bg: "bg-green-600/10" },
  "Router WiFi": { icon: Wifi, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "Access Point": { icon: Radio, color: "text-green-400", bg: "bg-green-400/10" },
  "Firewall": { icon: ShieldCheck, color: "text-lime-500", bg: "bg-lime-500/10" },
  "CCTV": { icon: Camera, color: "text-purple-500", bg: "bg-purple-500/10" },
  "UPS": { icon: BatteryCharging, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  "Impresora": { icon: Printer, color: "text-purple-400", bg: "bg-purple-400/10" },
  "Biométrico": { icon: Fingerprint, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  "Telefonía IP": { icon: Phone, color: "text-purple-300", bg: "bg-purple-300/10" },
};

// --- COMPONENTE DE NODO (CON LÓGICA DE CASCADA) ---
const DeviceNode = ({ data }) => {
  const config = ICON_CONFIG[data.category] || { icon: Box, color: "text-gray-400", bg: "bg-white/5" };
  const Icon = config.icon;
  
  // 🚀 LÓGICA DE ESTADOS:
  const isOffline = data.status === 'offline'; // Falla directa
  const isLostConnection = !isOffline && data.parentStatus === 'offline'; // Falla por cascada

  // Definición de estilos dinámicos
  const statusTheme = isOffline 
    ? { border: 'border-red-500', bg: 'bg-red-500/10', glow: 'shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse', text: 'text-red-400', label: '⚠ FALLA CRÍTICA' }
    : isLostConnection
      ? { border: 'border-slate-700', bg: 'bg-slate-900/50', glow: '', text: 'text-slate-500', label: '⚠ CONEXIÓN PERDIDA' }
      : { border: 'border-white/10', bg: config.bg, glow: 'hover:border-white/20', text: config.color, label: data.category };

  return (
    <div className={`p-4 rounded-[2rem] border backdrop-blur-xl shadow-2xl min-w-[180px] transition-all duration-500 ${statusTheme.border} ${statusTheme.bg} ${statusTheme.glow}`}>
      <Handle type="target" position={Position.Top} className={`w-3 h-3 border-2 border-white ${isOffline ? 'bg-red-500' : isLostConnection ? 'bg-slate-700' : 'bg-blue-500'}`} />
      
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl border border-white/5 shadow-inner ${isOffline ? 'bg-red-500/20' : isLostConnection ? 'bg-black/20' : config.bg}`}>
          <Icon className={isOffline ? 'text-red-500' : isLostConnection ? 'text-slate-500' : config.color} size={22} />
        </div>
        <div className="flex flex-col">
          <p className={`text-[10px] font-black uppercase tracking-tighter truncate w-28 ${isOffline ? 'text-red-200' : isLostConnection ? 'text-slate-600' : 'text-white'}`}>
            {data.label}
          </p>
          <p className={`text-[7px] font-black uppercase tracking-widest ${statusTheme.text} opacity-80`}>
            {statusTheme.label}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${isOffline ? 'bg-red-500 animate-ping' : isLostConnection ? 'bg-slate-700' : 'bg-emerald-500 shadow-[0_0_5px_#10b981]'}`}></div>
            <p className={`text-[8px] font-mono font-bold tracking-tight ${isOffline ? 'text-red-300' : isLostConnection ? 'text-slate-700' : 'text-slate-400'}`}>
              {data.ip_address || '---'}
            </p>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className={`w-3 h-3 border-2 border-white ${isOffline ? 'bg-red-500' : isLostConnection ? 'bg-slate-700' : 'bg-blue-500'}`} />
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function CentinelaNOC({ companyId, onNodeClick, onCompanyChange }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentCompanyName, setCurrentCompanyName] = useState("");
  const nodeTypes = useMemo(() => ({ deviceNode: DeviceNode }), []);

  // 📡 Realtime Listener (Actualiza nodos en vivo)
  useMonitoring(setNodes);

  // 🏢 Cargar lista de empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from('companies').select('id, name');
      if (data) {
        setCompanies(data);
        const current = data.find(c => c.id === companyId);
        if (current) setCurrentCompanyName(current.name);
      }
    };
    fetchCompanies();
  }, [companyId]);

  const loadTopology = useCallback(async () => {
    if (!companyId) return;

    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('company_id', companyId);

    if (error) {
      console.error("❌ Error de Supabase:", error.message);
      return;
    }

    if (assets) {
      // 🚀 CREAMOS UN MAPA DE ESTADOS PARA LA CASCADA
      const statusMap = assets.reduce((acc, a) => {
        acc[a.id.toString()] = a.status;
        return acc;
      }, {});

      // Mapear Nodos con info del padre
      setNodes(assets.map((asset, index) => ({
        id: asset.id.toString(),
        type: 'deviceNode',
        position: { 
          x: asset.topo_x || (index * 220) % 800, 
          y: asset.topo_y || Math.floor(index / 4) * 160 
        },
        data: { 
          ...asset, 
          label: asset.name,
          parentStatus: asset.parent_id ? statusMap[asset.parent_id.toString()] : 'online'
        },
      })));

      // Mapear Edges (Cables) dinámicos
      setEdges(assets.filter(a => a.parent_id).map(a => {
        const isParentOffline = statusMap[a.parent_id.toString()] === 'offline';
        
        return {
          id: `e-${a.parent_id}-${a.id}`,
          source: a.parent_id.toString(),
          target: a.id.toString(),
          animated: !isParentOffline, // 🚀 SE DETIENE SI EL PADRE CAE
          style: { 
            stroke: isParentOffline ? '#334155' : '#3b82f6', // 🚀 GRIS SI NO HAY FLUJO
            strokeWidth: isParentOffline ? 1 : 2,
            opacity: isParentOffline ? 0.4 : 1
          },
        };
      }));
    }
  }, [companyId]);

  useEffect(() => { 
    loadTopology(); 
  }, [loadTopology]);

  const onNodeDragStop = useCallback(async (event, node) => {
    await supabase
      .from('assets')
      .update({ topo_x: node.position.x, topo_y: node.position.y })
      .eq('id', node.id);
  }, []);

  return (
    <div className="h-full w-full bg-[#020617] relative">
      
      {/* 🚀 HEADER CON SELECTOR DE EMPRESA */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-6 pointer-events-auto">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            CENTINELA<span className="text-cyan-400">.NOC</span>
          </h2>
          <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.4em]">Map view</p>
        </div>

        <div className="h-10 w-[2px] bg-slate-800 ml-2" />

        <div className="relative group">
          <button className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all backdrop-blur-md">
            <div className="text-left">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Empresa Visualizada</p>
              <p className="text-xs font-bold text-white uppercase">{currentCompanyName || 'Cargando...'}</p>
            </div>
            <ChevronDown size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
          
          <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] overflow-hidden backdrop-blur-xl">
            {companies.map(c => (
              <button
                key={c.id}
                onClick={() => onCompanyChange(c.id)}
                className="w-full text-left px-5 py-4 text-[10px] font-black text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 border-b border-white/5 uppercase tracking-widest transition-colors last:border-none"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
        onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={(event, node) => onNodeClick(node)}
        onPaneClick={() => onNodeClick(null)}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1e293b" gap={25} size={1} variant="dots" />
        <Controls className="bg-slate-900 border-slate-800" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}