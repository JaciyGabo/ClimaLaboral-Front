import React, { useState, useRef } from 'react';
import { CheckCircle, X, Building2, Users, User, Mail, Key, Calendar } from 'lucide-react';
import NuevaEmpresa from "../NuevaEmpresa/NuevaEmpresa";
import EmpresasEnAlta from "../EmpresasEnAlta/EmpresasEnAlta";

const AltaEmpresas = () => {
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingCompanyData, setPendingCompanyData] = useState(null);
  
  // Crear la referencia para acceder al componente NuevaEmpresa
  const nuevaEmpresaRef = useRef();

  const handleSaveCompany = (companyData) => {
    // En lugar de guardar directamente, mostramos el modal
    setPendingCompanyData(companyData);
    setShowModal(true);
  };

  const confirmSaveCompany = () => {
    if (pendingCompanyData) {
      const newCompany = {
        id: Date.now(),
        empresa: pendingCompanyData.empresa,
        areas: pendingCompanyData.areas,
        lider: pendingCompanyData.lider,
        createdAt: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
      setSavedCompanies(prev => [newCompany, ...prev]);
      
      // Resetear el formulario después de guardar
      if (nuevaEmpresaRef.current) {
        nuevaEmpresaRef.current.resetForm();
      }
    }

    // Cerrar modal y limpiar datos pendientes
    setShowModal(false);
    setPendingCompanyData(null);
  };

  const cancelSaveCompany = () => {
    setShowModal(false);
    setPendingCompanyData(null);
  };

  const handleDeleteCompany = (companyId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta empresa?');
    if (confirmDelete) {
      setSavedCompanies(prev => prev.filter(company => company.id !== companyId));
    }
  };

  const ConfirmationModal = () => {
    if (!showModal || !pendingCompanyData) return null;

    const { empresa, areas, lider } = pendingCompanyData;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden">
          {/* Header del Modal */}
          <div className="bg-[#023047] p-6 text-white relative">
            <button
              onClick={cancelSaveCompany}
              className="!bg-transparent text-red-300 hover:!bg-transparent absolute top-4 right-4 !border-none !rounded-full border border-transparent hover:border-transparent !transition-color hover:scale-110 hover:text-red-400"
            >
              <X size={30} strokeWidth={3} />
            </button>

            <div className=" flex items-center gap-3">
              <CheckCircle size={32} />
              <div>
                <h2 className="text-2xl font-bold">Confirmar Alta de Empresa</h2>
                <p className="text-white/80">Revisa los datos antes de confirmar el registro</p>
              </div>
            </div>
          </div>

          {/* Contenido del Modal */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              {/* Información de la Empresa */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Building2 size={20} className="text-blue-600" />
                  Información de la Empresa
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <span className="ml-2 text-gray-900">{empresa.nombre}</span>
                  </div>
                  {empresa.descripcion && (
                    <div>
                      <span className="font-medium text-gray-700">Descripción:</span>
                      <span className="ml-2 text-gray-900">{empresa.descripcion}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Áreas */}
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Users size={20} className="text-orange-600" />
                  Áreas ({areas.length})
                </h3>
                <div className="space-y-3">
                  {areas.map((area, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border-l-4 border-orange-400">
                      <div className="font-medium text-gray-900">{area.nombre}</div>
                      {area.descripcion && (
                        <div className="text-sm text-gray-600 mt-1">{area.descripcion}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Líder */}
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <User size={20} className="text-green-600" />
                  Líder de la Empresa
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <span className="text-gray-900">{lider.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900">{lider.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Contraseña:</span>
                    <span className="text-gray-900 font-mono">
                      {lider.contrasena}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Fecha de registro:</span>
                    <span className="text-gray-900">
                      {new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del Modal */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={cancelSaveCompany}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmSaveCompany}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Confirmar Alta
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-t from-cyan-200 to-white">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
        {/* Sección de registro de nueva empresa */}
        <div className="w-full lg:flex-1 order-1 lg:order-2">
          <div className="bg-[#219EBC] backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
            <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-white">
              Dar de alta una empresa nueva
            </h1>
            {/* Pasar la referencia al componente NuevaEmpresa */}
            <NuevaEmpresa ref={nuevaEmpresaRef} onSaveCompany={handleSaveCompany} />
          </div>
        </div>

        {/* Sección de empresas registradas */}
        <div className="w-full lg:w-150 order-2 lg:order-1">
          <div className="bg-[#219EBC] backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 sticky top-6">
            <h1 className="text-xl lg:text-2xl font-bold text-center mb-6 text-white">
              Empresas dadas de alta
              {savedCompanies.length > 0 && (
                <span className="block text-sm font-normal text-white/70 mt-1">
                  {savedCompanies.length} empresa{savedCompanies.length !== 1 ? 's' : ''} registrada{savedCompanies.length !== 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <EmpresasEnAlta
              companies={savedCompanies}
              onDeleteCompany={handleDeleteCompany}
            />
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal />
    </div>
  );
};

export default AltaEmpresas;