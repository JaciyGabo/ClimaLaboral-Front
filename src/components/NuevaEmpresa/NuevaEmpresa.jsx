import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Plus, X, Edit3, Save, Building2, Users, User, Eye, EyeOff } from 'lucide-react';

const NuevaEmpresa = forwardRef(({ onSaveCompany }, ref) => {
  const [empresa, setEmpresa] = useState({
    nombre: '',
    descripcion: ''
  });

  const [areas, setAreas] = useState([]);
  const [editingArea, setEditingArea] = useState(null);
  
  const [liderEmpresa, setLiderEmpresa] = useState({
    nombre: '',
    email: '',
    contrasena: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Función para resetear el formulario
  const resetForm = () => {
    setEmpresa({
      nombre: '',
      descripcion: ''
    });
    setAreas([]);
    setLiderEmpresa({
      nombre: '',
      email: '',
      contrasena: ''
    });
    setEditingArea(null);
    setShowPassword(false);
    setIsSaving(false);
  };

  // Exponer la función resetForm a través de la ref
  useImperativeHandle(ref, () => ({
    resetForm
  }));

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setLiderEmpresa(prev => ({ ...prev, contrasena: password }));
  };

  const updateEmpresa = (field, value) => {
    setEmpresa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLider = (field, value) => {
    setLiderEmpresa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArea = () => {
    const newArea = {
      id: Date.now(),
      nombre: '',
      descripcion: ''
    };
    setAreas([...areas, newArea]);
    setEditingArea(newArea.id);
  };

  const updateArea = (id, field, value) => {
    setAreas(areas.map(area =>
      area.id === id ? { ...area, [field]: value } : area
    ));
  };

  const removeArea = (id) => {
    setAreas(areas.filter(area => area.id !== id));
    if (editingArea === id) {
      setEditingArea(null);
    }
  };

  const handleSaveCompany = async () => {
    if (!empresa.nombre.trim()) {
      alert('Por favor, ingresa el nombre de la empresa');
      return;
    }

    if (!liderEmpresa.nombre.trim()) {
      alert('Por favor, ingresa el nombre del líder de la empresa');
      return;
    }

    if (!liderEmpresa.email.trim()) {
      alert('Por favor, ingresa el email del líder de la empresa');
      return;
    }

    if (!liderEmpresa.contrasena.trim()) {
      alert('Por favor, genera una contraseña para el líder');
      return;
    }

    if (areas.length === 0) {
      alert('Por favor, agrega al menos una área a la empresa');
      return;
    }

    const areasInvalidas = areas.filter(area => !area.nombre.trim());
    if (areasInvalidas.length > 0) {
      alert('Todas las áreas deben tener un nombre');
      return;
    }

    setIsSaving(true);

    // Simulamos un delay para mostrar el loading
    setTimeout(() => {
      const datosCompletos = {
        empresa: {
          ...empresa,
          activo: true
        },
        areas: areas.map(area => ({
          nombre: area.nombre,
          descripcion: area.descripcion || null
        })),
        lider: {
          nombre: liderEmpresa.nombre,
          email: liderEmpresa.email,
          contrasena: liderEmpresa.contrasena,
          tipo_usuario: 'lider_empresa',
          activo: true
        }
      };

      // Ya no reseteamos aquí, lo haremos después de confirmar en el modal
      onSaveCompany(datosCompletos);
      setIsSaving(false);
    }, 500);
  };

  const renderAreaEditor = (area) => {
    if (editingArea !== area.id) {
      return (
        <div className="p-4 rounded-xl bg-white/20 shadow-md border-l-4 border-orange-500 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">
                {area.nombre || 'Área sin nombre'}
              </h3>
              <p className="text-sm text-white/70">
                {area.descripcion || 'Sin descripción'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingArea(area.id)}
                className="p-2 !bg-white  text-blue-300 hover:!bg-blue-200 !rounded-full transition-colors"
              >
                <Edit3 size={20} strokeWidth={3} />
              </button>
              <button
                onClick={() => removeArea(area.id)}
                className="p-2 !bg-white  text-red-300 hover:!bg-red-200 !rounded-full transition-colors"
              >
                <X size={20} strokeWidth={4} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 rounded-xl bg-white/10 shadow-lg border-l-4 border-[#FEB703] backdrop-blur-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nombre del área *
            </label>
            <input
              type="text"
              value={area.nombre}
              onChange={(e) => updateArea(area.id, 'nombre', e.target.value)}
              placeholder="Ej: Recursos Humanos, Ventas, Producción..."
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descripción del área
            </label>
            <textarea
              value={area.descripcion}
              onChange={(e) => updateArea(area.id, 'descripcion', e.target.value)}
              placeholder="Describe las funciones principales de esta área"
              rows="3"
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditingArea(null)}
            className="px-4 py-2 !bg-white text-green-400 rounded-lg hover:!bg-green-200 transition-colors"
          >
            <Save size={18} strokeWidth={2.5} className="inline mr-1" />
            Guardar
          </button>
          <button
            onClick={() => removeArea(area.id)}
            className="px-4 py-2 !bg-white text-red-400 rounded-lg hover:!bg-red-200 transition-colors"
          >
            <X size={18} strokeWidth={4} className="inline mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Información de la Empresa */}
      <div className="p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/30">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <Building2 size={24} className='text-[#FEB703]' />
          Información de la Empresa
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Nombre de la empresa *
            </label>
            <input
              type="text"
              value={empresa.nombre}
              onChange={(e) => updateEmpresa('nombre', e.target.value)}
              placeholder="Nombre de la empresa"
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Descripción de la empresa
            </label>
            <textarea
              value={empresa.descripcion}
              onChange={(e) => updateEmpresa('descripcion', e.target.value)}
              placeholder="Describe brevemente a qué se dedica la empresa"
              rows="3"
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Áreas de la Empresa */}
      <div className="rounded-xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/30">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users size={24} strokeWidth={2} className='text-[#FEB703]' />
            Áreas de la Empresa
          </h2>
          <button
            onClick={addArea}
            className="flex items-center gap-2 p-3 !bg-white/10 !rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-200 group text-white focus:!outline-none"
          >
            <Plus size={20} strokeWidth={4} className="group-hover:scale-110 transition-transform text-orange-400" />
          
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {areas.map((area) => (
            <div key={area.id}>
              {renderAreaEditor(area)}
            </div>
          ))}
          
          {areas.length === 0 && (
            <div className="text-center py-8 text-white/70">
              <Users size={48} className="mx-auto mb-2 opacity-50" />
              <p>No hay áreas registradas aún.</p>
              <p className="text-sm">Agrega al menos una área para continuar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Información del Líder de la Empresa */}
      <div className="p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/30">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <User size={24} strokeWidth={3} className='text-[#FEB703]' />
          Líder de la Empresa
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Nombre completo del líder *
            </label>
            <input
              type="text"
              value={liderEmpresa.nombre}
              onChange={(e) => updateLider('nombre', e.target.value)}
              placeholder="Nombre completo del líder de la empresa"
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Email *
            </label>
            <input
              type="email"
              value={liderEmpresa.email}
              onChange={(e) => updateLider('email', e.target.value)}
              placeholder="correo@empresa.com"
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Contraseña *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={liderEmpresa.contrasena}
                  onChange={(e) => updateLider('contrasena', e.target.value)}
                  placeholder="Contraseña para acceso al sistema"
                  className="w-full p-3 pr-10 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:!border-transparent  hover:bg-transparent !bg-transparent focus:!outline-none"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5} className='text-[#FEB703] hover:!text-orange-500 !transition-colors' /> : <Eye size={18} strokeWidth={2.5} className='text-[#FEB703] hover:!text-orange-500 !transition-colors' />}
                </button>
              </div>
              <button
                type="button"
                onClick={generateSecurePassword}
                className="px-4 py-2 !bg-[#FEB703] text-white !rounded-xl hover:!bg-orange-500 !transition-colors !whitespace-nowrap"
              >
                Generar
              </button>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Esta contraseña será utilizada por el líder para acceder al dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-green-500 to-blue-500">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold">¿Listo para registrar la empresa?</h3>
            <p className="text-white/80 text-sm">
              {empresa.nombre ? `"${empresa.nombre}"` : 'Empresa'}  {areas.length} área{areas.length !== 1 ? 's' : ''} • 1 líder
            </p>
          </div>
          <button
            onClick={handleSaveCompany}
            disabled={isSaving || !empresa.nombre.trim() || !liderEmpresa.nombre.trim() || !liderEmpresa.email.trim() || !liderEmpresa.contrasena.trim() || areas.length === 0}
            className="flex items-center gap-2 px-6 py-3 !bg-white text-green-600 !rounded-xl font-semibold hover:!bg-gray-100 !transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Registrar Empresa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default NuevaEmpresa;