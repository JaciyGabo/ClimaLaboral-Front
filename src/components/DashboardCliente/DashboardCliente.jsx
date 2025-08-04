import React from 'react';
import AreaCard from '../AreaCard/AreaCard';

// Componente principal del dashboard
const DashboardCliente = () => {
  // Datos de ejemplo - reemplaza con tus datos reales
  const [areas] = React.useState([
    { id: 1, nombre: 'Recursos Humanos' },
    { id: 2, nombre: 'Ventas' },
    { id: 3, nombre: 'Marketing' },
    { id: 4, nombre: 'Desarrollo' },
    { id: 5, nombre: 'Administración' },
    { id: 6, nombre: 'Atención al Cliente' }
  ]);

  const nombreEmpresa = 'TechCorp Solutions'; // Reemplaza con el nombre real de la empresa

  const handleGenerarAnalisis = (nombreArea) => {
    console.log(`Generando análisis para el área: ${nombreArea}`);
    // Aquí implementarías la lógica para generar el análisis
    // Por ejemplo, navegar a otra página o abrir un modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-cyan-200 to-white pb-8 px-4">
      {/* Header del dashboard */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          {nombreEmpresa}
        </h1>
      </div>

      {/* Grid de cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-15 px-15">
          {areas.map((area) => (
            <AreaCard
              key={area.id}
              nombreArea={area.nombre}
              nombreEmpresa={nombreEmpresa}
              onGenerarAnalisis={handleGenerarAnalisis}
            />
          ))}
        </div>
      </div>
 
    </div>
  );
};

export default DashboardCliente;