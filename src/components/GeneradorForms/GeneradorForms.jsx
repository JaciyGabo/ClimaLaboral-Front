import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Plus, X, Edit3, Save, FileText, Building2, Users, ChevronDown, Eye } from 'lucide-react';

const GeneradorForms = forwardRef(({ onSaveForm }, ref) => {
  // Datos hardcodeados para empresas y áreas
  const empresasData = [
    {
      id: 1,
      nombre: "TechCorp Solutions",
      areas: [
        { id: 1, nombre: "Recursos Humanos" },
        { id: 2, nombre: "Desarrollo" },
        { id: 3, nombre: "Marketing" },
        { id: 4, nombre: "Ventas" }
      ]
    },
    {
      id: 2,
      nombre: "InnovateXYZ",
      areas: [
        { id: 5, nombre: "Operaciones" },
        { id: 6, nombre: "Finanzas" },
        { id: 7, nombre: "Logística" },
        { id: 8, nombre: "Calidad" }
      ]
    },
    {
      id: 3,
      nombre: "GlobalTech Industries",
      areas: [
        { id: 9, nombre: "Investigación y Desarrollo" },
        { id: 10, nombre: "Producción" },
        { id: 11, nombre: "Control de Calidad" },
        { id: 12, nombre: "Mantenimiento" }
      ]
    }
  ];

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    empresaId: '',
    areaId: ''
  });

  const [preguntas, setPreguntas] = useState([]);
  const [editingPregunta, setEditingPregunta] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Función para resetear el formulario
  const resetForm = () => {
    setFormulario({
      titulo: '',
      descripcion: '',
      empresaId: '',
      areaId: ''
    });
    setPreguntas([]);
    setEditingPregunta(null);
    setIsSaving(false);
  };

  // Exponer la función resetForm a través de la ref
  useImperativeHandle(ref, () => ({
    resetForm
  }));

  const updateFormulario = (field, value) => {
    setFormulario(prev => ({
      ...prev,
      [field]: value
    }));

    // Si cambia la empresa, resetear el área
    if (field === 'empresaId') {
      setFormulario(prev => ({
        ...prev,
        areaId: ''
      }));
    }
  };

  const addPregunta = () => {
    const newPregunta = {
      id: Date.now(),
      texto: '',
      tipo: 'texto',
      requerida: false,
      opciones: []
    };
    setPreguntas([...preguntas, newPregunta]);
    setEditingPregunta(newPregunta.id);
  };

  const updatePregunta = (id, field, value) => {
    setPreguntas(preguntas.map(pregunta =>
      pregunta.id === id ? { ...pregunta, [field]: value } : pregunta
    ));
  };

  const removePregunta = (id) => {
    setPreguntas(preguntas.filter(pregunta => pregunta.id !== id));
    if (editingPregunta === id) {
      setEditingPregunta(null);
    }
  };

  const addOpcion = (preguntaId) => {
    const pregunta = preguntas.find(p => p.id === preguntaId);
    const nuevasOpciones = [...(pregunta.opciones || []), `Opción ${(pregunta.opciones?.length || 0) + 1}`];
    updatePregunta(preguntaId, 'opciones', nuevasOpciones);
  };

  const updateOpcion = (preguntaId, index, value) => {
    const pregunta = preguntas.find(p => p.id === preguntaId);
    const nuevasOpciones = [...(pregunta.opciones || [])];
    nuevasOpciones[index] = value;
    updatePregunta(preguntaId, 'opciones', nuevasOpciones);
  };

  const removeOpcion = (preguntaId, index) => {
    const pregunta = preguntas.find(p => p.id === preguntaId);
    const nuevasOpciones = (pregunta.opciones || []).filter((_, i) => i !== index);
    updatePregunta(preguntaId, 'opciones', nuevasOpciones);
  };

  const handleSaveForm = async () => {
    if (!formulario.titulo.trim()) {
      alert('Por favor, ingresa el título del formulario');
      return;
    }

    if (!formulario.empresaId) {
      alert('Por favor, selecciona una empresa');
      return;
    }

    if (!formulario.areaId) {
      alert('Por favor, selecciona un área');
      return;
    }

    if (preguntas.length === 0) {
      alert('Por favor, agrega al menos una pregunta al formulario');
      return;
    }

    const preguntasInvalidas = preguntas.filter(pregunta => !pregunta.texto.trim());
    if (preguntasInvalidas.length > 0) {
      alert('Todas las preguntas deben tener texto');
      return;
    }

    setIsSaving(true);

    // Simulamos un delay para mostrar el loading
    setTimeout(() => {
      const datosCompletos = {
        formulario: {
          ...formulario,
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        preguntas: preguntas.map((pregunta, index) => ({
          texto: pregunta.texto,
          tipo: pregunta.tipo,
          requerida: pregunta.requerida,
          opciones: pregunta.opciones || null,
          orden: index + 1
        }))
      };

      onSaveForm(datosCompletos);
      setIsSaving(false);
    }, 500);
  };

  const getEmpresaSeleccionada = () => {
    return empresasData.find(empresa => empresa.id.toString() === formulario.empresaId);
  };

  const getAreasDisponibles = () => {
    const empresa = getEmpresaSeleccionada();
    return empresa ? empresa.areas : [];
  };

  const getAreaSeleccionada = () => {
    const areas = getAreasDisponibles();
    return areas.find(area => area.id.toString() === formulario.areaId);
  };

  const renderPreguntaEditor = (pregunta) => {
    if (editingPregunta !== pregunta.id) {
      return (
        <div className="p-4 rounded-xl bg-white/20 shadow-md border-l-4 border-orange-500 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">
                {pregunta.texto || 'Pregunta sin texto'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="bg-white/20 px-2 py-1 rounded">
                  {pregunta.tipo === 'texto' && 'Texto libre'}
                  {pregunta.tipo === 'opcion_multiple' && 'Opción múltiple'}
                  {pregunta.tipo === 'escala' && 'Escala numérica'}
                  {pregunta.tipo === 'si_no' && 'Sí / No'}
                </span>
                {pregunta.requerida && (
                  <span className="text-red-300">Requerida</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingPregunta(pregunta.id)}
                className="p-2 !bg-white text-blue-300 hover:!bg-blue-200 !rounded-full transition-colors"
              >
                <Edit3 size={20} strokeWidth={3} />
              </button>
              <button
                onClick={() => removePregunta(pregunta.id)}
                className="p-2 !bg-white text-red-300 hover:!bg-red-200 !rounded-full transition-colors"
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
              Texto de la pregunta *
            </label>
            <input
              type="text"
              value={pregunta.texto}
              onChange={(e) => updatePregunta(pregunta.id, 'texto', e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tipo de pregunta
              </label>
              <div className="relative">
                <select
                  value={pregunta.tipo}
                  onChange={(e) => updatePregunta(pregunta.id, 'tipo', e.target.value)}
                  className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors appearance-none pr-10"
                >
                  <option value="texto">Preguntas abiertas</option>
                  <option value="si_no">Preguntas cerradas</option>
                  <option value="opcion_multiple">Opción múltiple</option>
                  <option value="escala">Escala numérica (1-10)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={pregunta.requerida}
                  onChange={(e) => updatePregunta(pregunta.id, 'requerida', e.target.checked)}
                  className="w-5 h-5 text-[#FEB703] bg-white border-2 border-[#FEB703] rounded focus:ring-[#FEB703] focus:ring-2"
                />
                <span className="text-sm font-medium">Pregunta requerida</span>
              </label>
            </div>
          </div>

          {(pregunta.tipo === 'opcion_multiple' ) && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Opciones de respuesta
              </label>
              <div className="space-y-2">
                {(pregunta.opciones || []).map((opcion, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={opcion}
                      onChange={(e) => updateOpcion(pregunta.id, index, e.target.value)}
                      placeholder={`Opción ${index + 1}`}
                      className="flex-1 p-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-[#FEB703] focus:outline-none"
                    />
                    <button
                      onClick={() => removeOpcion(pregunta.id, index)}
                      className="p-2 text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOpcion(pregunta.id)}
                  className="flex items-center gap-2 p-2 text-[#FEB703] hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Agregar opción
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditingPregunta(null)}
            className="px-4 py-2 !bg-white text-green-400 rounded-lg hover:!bg-green-200 transition-colors"
          >
            <Save size={18} strokeWidth={2.5} className="inline mr-1" />
            Guardar
          </button>
          <button
            onClick={() => removePregunta(pregunta.id)}
            className="px-4 py-2 !bg-white text-red-400 rounded-lg hover:!bg-red-200 transition-colors"
          >
            <X size={18} strokeWidth={4} className="inline mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    );
  };

  // Función para renderizar la vista previa de una pregunta
  const renderPreguntaPreview = (pregunta, index) => {
    if (!pregunta.texto.trim()) return null;

    return (
      <div key={pregunta.id} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {index + 1}. {pregunta.texto}
          {pregunta.requerida && <span className="text-red-500 ml-1">*</span>}
        </label>

        {pregunta.tipo === 'texto' && (
          <textarea
            placeholder="Escribe tu respuesta aquí..."
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled
          />
        )}
        {pregunta.tipo === 'si_no' && (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`pregunta_${pregunta.id}`}
                value="Sí"
                className="w-4 h-4 text-blue-600"
                disabled
              />
              <span className="text-gray-700">Sí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`pregunta_${pregunta.id}`}
                value="No"
                className="w-4 h-4 text-blue-600"
                disabled
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        )}

        {pregunta.tipo === 'opcion_multiple' && (
          <div className="space-y-2">
            {(pregunta.opciones || []).map((opcion, optIndex) => (
              <label key={optIndex} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta_${pregunta.id}`}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled
                />
                <span className="text-gray-700">{opcion}</span>
              </label>
            ))}
          </div>
        )}



        {pregunta.tipo === 'escala' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">1</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <label key={num} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`escala_${pregunta.id}`}
                    value={num}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    disabled
                  />
                  <span className="text-xs text-gray-500 mt-1">{num}</span>
                </label>
              ))}
            </div>
            <span className="text-sm text-gray-500">10</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Información del Formulario */}
      <div className="p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/30">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <FileText size={24} className='text-[#FEB703]' />
          Información del Formulario
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Título del formulario *
            </label>
            <input
              type="text"
              value={formulario.titulo}
              onChange={(e) => updateFormulario('titulo', e.target.value)}
              placeholder="Ej: Evaluación de Desempeño, Encuesta de Satisfacción..."
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Descripción del formulario
            </label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => updateFormulario('descripcion', e.target.value)}
              placeholder="Describe el propósito y objetivo del formulario"
              rows="3"
              className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Empresa *
              </label>
              <div className="relative">
                <select
                  value={formulario.empresaId}
                  onChange={(e) => updateFormulario('empresaId', e.target.value)}
                  className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors appearance-none pr-10"
                >
                  <option value="">Selecciona una empresa</option>
                  {empresasData.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
                <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Área *
              </label>
              <div className="relative">
                <select
                  value={formulario.areaId}
                  onChange={(e) => updateFormulario('areaId', e.target.value)}
                  disabled={!formulario.empresaId}
                  className="w-full p-3 rounded-xl bg-white text-gray-800 border-2 border-[#FEB703] focus:border-[#FB8600] focus:outline-none transition-colors appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formulario.empresaId ? 'Selecciona un área' : 'Primero selecciona una empresa'}
                  </option>
                  {getAreasDisponibles().map(area => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preguntas del Formulario */}
      <div className="rounded-xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/30">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText size={24} strokeWidth={2} className='text-[#FEB703]' />
            Preguntas del Formulario
          </h2>
          <button
            onClick={addPregunta}
            className="flex items-center gap-2 p-3 !bg-white/10 !rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-200 group text-white focus:!outline-none"
          >
            <Plus size={20} strokeWidth={4} className="group-hover:scale-110 transition-transform text-orange-400" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {preguntas.map((pregunta, index) => (
            <div key={pregunta.id}>
              <div className="text-sm text-white/70 mb-2">Pregunta {index + 1}</div>
              {renderPreguntaEditor(pregunta)}
            </div>
          ))}

          {preguntas.length === 0 && (
            <div className="text-center py-8 text-white/70">
              <FileText size={48} className="mx-auto mb-2 opacity-50" />
              <p>No hay preguntas registradas aún.</p>
              <p className="text-sm">Agrega al menos una pregunta para continuar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold">¿Listo para crear el formulario?</h3>
            <p className="text-white/80 text-sm">
              {formulario.titulo ? `"${formulario.titulo}"` : 'Formulario'} • {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''}
              {formulario.empresaId && ` • ${getEmpresaSeleccionada()?.nombre}`}
            </p>
          </div>
          <button
            onClick={handleSaveForm}
            disabled={isSaving || !formulario.titulo.trim() || !formulario.empresaId || !formulario.areaId || preguntas.length === 0}
            className="flex items-center gap-2 px-6 py-3 !bg-white text-blue-600 !rounded-xl font-semibold hover:!bg-gray-100 !transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Crear Formulario
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vista Previa del Formulario */}
      {(formulario.titulo.trim() || preguntas.length > 0) && (
        <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Eye size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Vista Previa del Formulario</h2>
          </div>

          {/* Header del formulario en preview */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {formulario.titulo || 'Título del formulario'}
            </h1>
            {formulario.descripcion && (
              <p className="text-gray-600 mb-4">{formulario.descripcion}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-500">
              {getEmpresaSeleccionada() && (
                <span className="flex items-center gap-1">
                  <Building2 size={16} />
                  {getEmpresaSeleccionada().nombre}
                </span>
              )}
              {getAreaSeleccionada() && (
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {getAreaSeleccionada().nombre}
                </span>
              )}
            </div>
          </div>

          {/* Preguntas en preview */}
          <div className="space-y-6">
            {preguntas.filter(p => p.texto.trim()).map((pregunta, index) =>
              renderPreguntaPreview(pregunta, index)
            )}

            {preguntas.filter(p => p.texto.trim()).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Eye size={48} className="mx-auto mb-2 opacity-50" />
                <p>Las preguntas aparecerán aquí cuando las agregues</p>
              </div>
            )}
          </div>

          {/* Botón ficticio de envío en preview */}
          {preguntas.filter(p => p.texto.trim()).length > 0 && (
            <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
              <button
                disabled
                className="px-6 py-3 !bg-blue-600 text-white rounded-lg font-semibold opacity-50 cursor-not-allowed"
              >
                Enviar Respuestas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default GeneradorForms;