import React from 'react';
import { Handle, Position } from '@xyflow/react'; // Ajustado a la librería que instalamos
import { 
  Monitor, Laptop, Server, Cpu, Network, Router, Wifi, Radio, 
  ShieldCheck, Camera, BatteryCharging, Printer, Fingerprint, 
  Phone, Box 
} from 'lucide-react';

// --- CONFIGURACIÓN DE ICONOS INTERNA ---
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

const DeviceNode = ({ data }) => {
  // Buscamos la config según la categoría o usamos la genérica 'Box'
  const config = ICON_CONFIG[data.category] || { icon: Box, color: "text-gray-400", bg: "bg-white/5" };
  const Icon = config.icon;
  
  // 🚀 LÓGICA DE CASCADA
  const isOffline = data.status === 'offline'; 
  const isLostConnection = data.isCascadeOffline || (data.parent_id && data.parentStatus === 'offline');

  // Determinar el estilo final según el estado
  const finalStyle = isOffline 
    ? { 
        border: 'border-rose-500', 
        bg: 'bg-rose-500/10', 
        glow: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]', 
        text: 'text-rose-400', 
        label: '⚠ FALLA DETECTADA' 
      }
    : isLostConnection
      ? { 
          border: 'border-slate-700', 
          bg: 'bg-slate-900/50', 
          glow: '', 
          text: 'text-slate-500', 
          label: '⚠ CONEXIÓN PERDIDA' 
        }
      : { 
          border: 'border-white/10', 
          bg: `${config.bg}`, 
          glow: 'hover:border-white/20', 
          text: `${config.color}`, 
          label: data.category 
        };

  return (
    <div className={`p-4 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 ${finalStyle.border} ${finalStyle.bg} ${finalStyle.glow}`}>
      
      {/* Entrada de conexión (Top) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`w-3 h-3 border-2 border-white transition-colors duration-500 ${isOffline ? 'bg-rose-500' : isLostConnection ? 'bg-slate-700' : 'bg-blue-500'}`} 
      />
      
      <div className="flex items-center gap-4">
        {/* Icono dinámico */}
        <div className={`p-3 rounded-2xl border border-white/5 shadow-inner transition-colors duration-500 ${isOffline ? 'bg-rose-500/20' : isLostConnection ? 'bg-black/20' : config.bg}`}>
          <Icon className={isOffline ? 'text-rose-500' : isLostConnection ? 'text-slate-500' : config.color} size={22} />
        </div>

        <div className="flex flex-col">
          <p className={`text-[10px] font-black uppercase tracking-tighter truncate w-28 ${isOffline ? 'text-rose-200' : isLostConnection ? 'text-slate-600' : 'text-white'}`}>
            {data.label}
          </p>
          <p className={`text-[7px] font-black uppercase tracking-widest ${finalStyle.text} opacity-80`}>
            {finalStyle.label}
          </p>
          
          <div className="mt-1 flex items-center gap-1.5">
            {/* Indicador LED */}
            <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${isOffline ? 'bg-rose-500 animate-ping' : isLostConnection ? 'bg-slate-700' : 'bg-emerald-500 shadow-[0_0_5px_#10b981]'}`}></div>
            <p className={`text-[8px] font-mono font-bold tracking-tight ${isOffline ? 'text-rose-300' : isLostConnection ? 'text-slate-700' : 'text-slate-400'}`}>
              {data.ip_address || '---'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Salida de conexión (Bottom) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`w-3 h-3 border-2 border-white transition-colors duration-500 ${isOffline ? 'bg-rose-500' : isLostConnection ? 'bg-slate-700' : 'bg-blue-500'}`} 
      />
    </div>
  );
};

export default DeviceNode;