import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardGlobal from './views/DashboardGlobal';
import CentinelaNOC from './views/CentinelaNOC';
import IncidentLogs from './views/IncidentLogs';
import DetailsPanel from './components/layout/DetailsPanel';
import Simulator from './views/Simulator'; // 🚀 IMPORTANTE: Importa el simulador

function App() {
  const [currentView, setCurrentView] = useState('global');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("adaacefa-8576-4071-bb4d-54e52f38cb2a");

  const handleSelectCompany = (companyId) => {
    setSelectedCompany(companyId);
    setCurrentView('noc'); 
    setSelectedNode(null);
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedNode(null); 
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={setCurrentView}>
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

          {/* 🚀 AQUÍ COLOCAMOS EL SIMULADOR EN LUGAR DEL PLACEHOLDER */}
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