import { useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

export const useMonitoring = (setNodes) => {
  useEffect(() => {
    // 1. Creamos el canal de escucha para la tabla 'assets'
    const channel = supabase
      .channel('realtime-assets')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'assets' },
        (payload) => {
          console.log('🔄 Cambio detectado en DB:', payload.new);
          
          // 2. Actualizamos solo el nodo que cambió
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === payload.new.id.toString()) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    status: payload.new.status, // 'online' u 'offline'
                  },
                };
              }
              return node;
            })
          );
        }
      )
      .subscribe();

    // Limpieza al desmontar el componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setNodes]);
};