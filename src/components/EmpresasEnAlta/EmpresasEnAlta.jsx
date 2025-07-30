import React, { useState } from 'react';
import { Building2, Trash2, Calendar, Users, User, ChevronDown, ChevronUp } from 'lucide-react';

const EmpresasEnAlta = ({ companies, onDeleteCompany }) => {
  const [expandedCompany, setExpandedCompany] = useState(null);

  const toggleExpanded = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-12"> 
        <Building2 size={90} strokeWidth={2} className="mx-auto  text-orange-400 mb-4" />
        <p className="text-white/70 text-lg mb-2">No hay empresas registradas</p>
        <p className="text-white/50 text-sm">Las empresas que registres aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      {companies.map((company) => (
        <div key={company.id} className="backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden transition-all duration-300 hover:bg-black/30">
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg truncate mb-1">
                  {company.empresa.nombre}
                </h3>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{company.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{company.areas.length} área{company.areas.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => toggleExpanded(company.id)}
                  className="text-cyan-400 hover:text-cyan-600 hover:bg-white/20 !rounded-full !transition-colors "

                  title="Ver detalles"
                >
                  {expandedCompany === company.id ? 
                    <ChevronUp size={24} strokeWidth={3} /> : 
                    <ChevronDown size={24} strokeWidth={3} />
                  }
                </button>
                <button
                  onClick={() => onDeleteCompany(company.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500 !rounded-full !transition-colors"
                  title="Eliminar empresa"
                >
                  <Trash2 size={24} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            
            {/* Barra de progreso visual para áreas */}
            <div className="flex gap-1 mb-3">
              {Array.from({ length: Math.min(company.areas.length, 10) }, (_, i) => (
                <div 
                  key={i} 
                  className="h-1 flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              ))}
              {company.areas.length > 10 && (
                <span className="text-white/60 text-xs ml-2">+{company.areas.length - 10}</span>
              )}
            </div>

            {/* Estado de la empresa */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Activa
              </span>
            </div>
          </div>

          {/* Panel expandido con detalles */}
          {expandedCompany === company.id && (
            <div className="border-t border-white/20 bg-white/10 p-4">
              <div className="space-y-4">
                {/* Descripción de la empresa */}
                {company.empresa.descripcion && (
                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Descripción de la empresa
                    </h4>
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <p className="text-white/70 text-sm leading-relaxed">{company.empresa.descripcion}</p>
                    </div>
                  </div>
                )}

                {/* Información del líder */}
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Líder de la empresa
                  </h4>
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500/30 text-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                        L
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-1">{company.lider.nombre}</p>
                        <p className="text-white/70 text-sm">{company.lider.email}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30 mt-1">
                          {company.lider.tipo_usuario?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Áreas de la empresa */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Áreas de la empresa ({company.areas.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {company.areas.map((area, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-500/30 text-orange-200 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium mb-1 leading-relaxed">
                              {area.nombre}
                            </p>
                            {area.descripcion && (
                              <p className="text-white/70 text-xs leading-relaxed">
                                {area.descripcion}
                              </p>
                            )}
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                                Área activa
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="border-t border-white/20 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <div className="text-2xl font-bold text-white">{company.areas.length}</div>
                      <div className="text-xs text-white/70">Áreas totales</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <div className="text-2xl font-bold text-green-400">1</div>
                      <div className="text-xs text-white/70">Líder activo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmpresasEnAlta;