import React, { useState, useEffect } from 'react';
import { Save, Send, Eye, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';

const ContestarFormulario = ({ 
  cuestionario, 
  usuarioId, 
  onSaveDraft, 
  onSubmitResponse, 
  draftData = null 
}) => {
  const [respuestas, setRespuestas] = useState({});
  const [errores, setErrores] = useState({});
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [guardandoBorrador, setGuardandoBorrador] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [ultimoGuardado, setUltimoGuardado] = useState(null);

  // Cargar borrador si existe
  useEffect(() => {
    if (draftData) {
      setRespuestas(draftData.respuestas || {});
      setUltimoGuardado(new Date(draftData.fecha_guardado));
    }
  }, [draftData]);

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(respuestas).length > 0) {
        guardarBorrador(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [respuestas]);

  const actualizarRespuesta = (questionId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [questionId]: valor
    }));
    
    // Limpiar error si existe
    if (errores[questionId]) {
      setErrores(prev => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const validarRespuestas = () => {
    const nuevosErrores = {};
    
    cuestionario.questions.forEach(pregunta => {
      if (pregunta.required) {
        const respuesta = respuestas[pregunta.id];
        
        if (!respuesta || 
            (typeof respuesta === 'string' && respuesta.trim() === '') ||
            (Array.isArray(respuesta) && respuesta.length === 0)) {
          nuevosErrores[pregunta.id] = 'Esta pregunta es obligatoria';
        }
      }
    });
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarBorrador = async (autoGuardado = false) => {
    setGuardandoBorrador(true);
    
    const datosParaGuardar = {
      cuestionario_id: cuestionario.id,
      usuario_id: usuarioId,
      respuestas: respuestas,
      fecha_guardado: new Date().toISOString(),
      estado: 'borrador'
    };
    
    try {
      await onSaveDraft(datosParaGuardar);
      setUltimoGuardado(new Date());
      
      if (!autoGuardado) {
        // Mostrar mensaje de éxito solo si no es auto-guardado
        setTimeout(() => {
          alert('Borrador guardado exitosamente');
        }, 100);
      }
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      if (!autoGuardado) {
        alert('Error al guardar el borrador');
      }
    } finally {
      setGuardandoBorrador(false);
    }
  };

  const enviarRespuestas = async () => {
    if (!validarRespuestas()) {
      alert('Por favor, completa todas las preguntas obligatorias');
      return;
    }

    setEnviando(true);
    
    const datosParaEnviar = {
      cuestionario_id: cuestionario.id,
      usuario_id: usuarioId,
      respuestas: respuestas,
      fecha_completado: new Date().toISOString(),
      estado: 'completado'
    };
    
    try {
      await onSubmitResponse(datosParaEnviar);
      alert('¡Cuestionario enviado exitosamente!');
      // Limpiar respuestas después del envío
      setRespuestas({});
      setMostrarResumen(false);
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      alert('Error al enviar el cuestionario');
    } finally {
      setEnviando(false);
    }
  };

  const renderPregunta = (pregunta, index) => {
    const respuesta = respuestas[pregunta.id] || '';
    const tieneError = errores[pregunta.id];

    return (
      <div key={pregunta.id} className={`p-6 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm border-l-4 ${tieneError ? 'border-red-400' : 'border-orange-400'}`}>
        <div className="mb-4">
          <div className="flex items-start gap-2 mb-2">
            <span className="font-semibold text-blue-900 text-lg">
              {index + 1}. {pregunta.title}
            </span>
            {pregunta.required && (
              <span className="text-red-500 text-lg">*</span>
            )}
          </div>
          
          {tieneError && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-3">
              <AlertCircle size={16} />
              <span>{tieneError}</span>
            </div>
          )}
        </div>

        {pregunta.type === 'open' && (
          <textarea
            value={respuesta}
            onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
              tieneError ? 'border-red-300' : 'border-gray-300'
            }`}
            rows="4"
          />
        )}

        {pregunta.type === 'closed' && (
          <div className="space-y-3">
            {['Sí', 'No'].map((opcion) => (
              <label key={opcion} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta_${pregunta.id}`}
                  value={opcion}
                  checked={respuesta === opcion}
                  onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                  className="w-5 h-5 text-orange-500 border-2 border-gray-300 focus:ring-2 focus:ring-orange-400"
                />
                <span className="text-gray-700 text-lg">{opcion}</span>
              </label>
            ))}
          </div>
        )}

        {pregunta.type === 'multiple' && (
          <div className="space-y-3">
            {pregunta.options.map((opcion, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta_${pregunta.id}`}
                  value={opcion}
                  checked={respuesta === opcion}
                  onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                  className="w-5 h-5 text-orange-500 border-2 border-gray-300 focus:ring-2 focus:ring-orange-400"
                />
                <span className="text-gray-700 text-lg">
                  {opcion || `Opción ${String.fromCharCode(65 + idx)}`}
                </span>
              </label>
            ))}
          </div>
        )}

        {pregunta.type === 'rating' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {pregunta.options.minLabel || 'Mínimo'}
              </span>
              <span className="text-sm text-gray-600">
                {pregunta.options.maxLabel || 'Máximo'}
              </span>
            </div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: pregunta.options.max - pregunta.options.min + 1 }, (_, i) => {
                const valor = pregunta.options.min + i;
                return (
                  <button
                    key={valor}
                    onClick={() => actualizarRespuesta(pregunta.id, valor)}
                    className={`w-12 h-12 rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                      respuesta === valor
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {valor}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResumen = () => {
    const totalPreguntas = cuestionario.questions.length;
    const preguntasRespondidas = Object.keys(respuestas).length;
    const preguntasObligatorias = cuestionario.questions.filter(q => q.required).length;
    const preguntasObligatoriasRespondidas = cuestionario.questions.filter(q => 
      q.required && respuestas[q.id] && respuestas[q.id] !== ''
    ).length;

    return (
      <div className="space-y-6">
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye size={24} />
            Resumen de Respuestas
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="font-semibold">Progreso Total</div>
              <div className="text-lg">{preguntasRespondidas}/{totalPreguntas}</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="font-semibold">Obligatorias</div>
              <div className="text-lg">{preguntasObligatoriasRespondidas}/{preguntasObligatorias}</div>
            </div>
          </div>
        </div>

        {cuestionario.questions.map((pregunta, index) => {
          const respuesta = respuestas[pregunta.id];
          const respondida = respuesta && respuesta !== '';
          
          return (
            <div key={pregunta.id} className={`p-4 rounded-xl border-l-4 ${
              respondida ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                <span className="font-semibold text-gray-800">
                  {index + 1}. {pregunta.title}
                </span>
                {pregunta.required && <span className="text-red-500">*</span>}
                {respondida && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
              </div>
              
              {respondida ? (
                <div className="text-gray-700 bg-white p-3 rounded-lg">
                  <strong>Respuesta:</strong> {respuesta}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Sin responder
                </div>
              )}
            </div>
          );
        })}

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setMostrarResumen(false)}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Continuar Editando
          </button>
          <button
            onClick={enviarRespuestas}
            disabled={enviando}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {enviando ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send size={20} />
                Enviar Cuestionario
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if (mostrarResumen) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderResumen()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-teal-900/90 to-blue-900/90 text-white backdrop-blur-lg border border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FileText size={28} />
              {cuestionario.title}
            </h1>
            <p className="text-white/80">
              {cuestionario.questions.length} pregunta{cuestionario.questions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {ultimoGuardado && (
            <div className="text-right">
              <div className="flex items-center gap-2 text-white/90">
                <Clock size={16} />
                <span className="text-sm">
                  Último guardado: {ultimoGuardado.toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preguntas */}
      <div className="space-y-6">
        {cuestionario.questions.map((pregunta, index) => renderPregunta(pregunta, index))}
      </div>

      {/* Botones de acción */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => guardarBorrador(false)}
          disabled={guardandoBorrador || Object.keys(respuestas).length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardandoBorrador ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar Borrador
            </>
          )}
        </button>

        <button
          onClick={() => setMostrarResumen(true)}
          disabled={Object.keys(respuestas).length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye size={20} />
          Ver Resumen
        </button>

        <button
          onClick={enviarRespuestas}
          disabled={enviando}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send size={20} />
              Enviar Cuestionario
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ContestarFormulario;