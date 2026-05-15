import React, { useState, useEffect } from 'react';
import { supabase } from './api/supabaseClient';

// Layouts & Views
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardGlobal from './views/DashboardGlobal';
import CentinelaNOC from './views/CentinelaNOC';
import IncidentLogs from './views/IncidentLogs';
import DetailsPanel from './components/layout/DetailsPanel';
import Simulator from './views/Simulator';
import Login from './views/Login'; // 🚀 La nueva puerta de entrada

function App() {
  // --- ESTADOS DE AUTENTICACIÓN ---
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE NAVEGACIÓN ---
  const [currentView, setCurrentView] = useState('global');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // 1. Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    // 2. Escuchar cambios de estado (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setSelectedCompany(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Cargar el perfil vinculado al usuario
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
      // Si el usuario es técnico de una empresa específica, se le asigna su ID
      if (data.role !== 'admin' && data.company_id) {
        setSelectedCompany(data.company_id);
        setCurrentView('noc'); // Los técnicos van directo a su mapa
      }
    }
  };

  // --- MANEJADORES DE NAVEGACIÓN ---
  const handleSelectCompany = (companyId) => {
    setSelectedCompany(companyId);
    setCurrentView('noc');
    setSelectedNode(null);
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedNode(null);
  };

  // Pantalla de carga mientras verificamos la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🛡️ SI NO HAY SESIÓN, MOSTRAR LOGIN
  if (!session) {
    return <Login />;
  }

  return (
    <DashboardLayout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      userProfile={profile} // Pasamos el perfil para mostrar nombre/rol en el sidebar
    >
      <div className="flex h-full w-full">
        
        <div className="flex-1 overflow-hidden">
          {currentView === 'global' && (
            <DashboardGlobal onSelectCompany={handleSelectCompany} />
          )}

          {currentView === 'noc' && (
            <CentinelaNOC 
              companyId={selectedCompany} 
              onNodeClick={setSelectedNode} 
              onCompanyChange={handleCompanyChange}
            />
          )}

          {currentView === 'alerts' && (
            <IncidentLogs />
          )}

          {currentView === 'inventory' && (
            <div className="p-20 text-center">
              <h2 className="text-slate-700 font-black uppercase tracking-[0.5em] animate-pulse">
                Módulo ITAM en Construcción
              </h2>
            </div>
          )}

          {currentView === 'settings' && (
            <Simulator companyId={selectedCompany} />
          )}
        </div>
        
        {currentView === 'noc' && selectedNode && (
          <DetailsPanel 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default App;