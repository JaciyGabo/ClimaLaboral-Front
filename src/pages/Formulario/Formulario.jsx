import React, { useState, useEffect } from 'react';
import { Send, Building2, Users, CheckCircle2 } from 'lucide-react';

const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

const Formulario = () => {
    const query = useQuery();
    const empresa = query.get('empresa');
    const area = query.get('area');

    // Estado para las respuestas del formulario
    const [respuestas, setRespuestas] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    // Formulario con la estructura que coincide con tu base de datos
    const formularioEstatico = {
        formulario: {
            titulo: "Evaluación de Clima Laboral",
            descripcion: "Tu opinión es importante para mejorar nuestro ambiente de trabajo. Este formulario es completamente confidencial.",
            empresaId: "1", // Este vendría de la consulta real
            areaId: "2",    // Este vendría de la consulta real
            activo: true,
            fechaCreacion: new Date().toISOString()
        },
        preguntas: [
            {
                texto: "¿Cómo describirías el ambiente de trabajo en tu área?",
                tipo: "texto",
                requerida: true,
                opciones: null,
                orden: 1
            },
            {
                texto: "¿Te sientes cómodo expresando tus ideas y opiniones en el trabajo?",
                tipo: "si_no",
                requerida: true,
                opciones: null,
                orden: 2
            },
            {
                texto: "¿Cuál de los siguientes factores consideras MÁS importante para tu satisfacción laboral?",
                tipo: "opcion_multiple",
                requerida: true,
                opciones: "Reconocimiento por mi trabajo|Oportunidades de crecimiento|Buen ambiente con compañeros|Flexibilidad horaria|Salario competitivo|Capacitación constante|Equilibrio vida-trabajo|Comunicación clara de la dirección",
                orden: 3
            },
            {
                texto: "¿Qué tan satisfecho estás con la comunicación de tu supervisor directo?",
                tipo: "escala",
                requerida: true,
                opciones: null,
                orden: 4
            },
            {
                texto: "¿Cómo calificarías las oportunidades de desarrollo profesional en tu área?",
                tipo: "escala",
                requerida: true,
                opciones: null,
                orden: 5
            },
            {
                texto: "¿Cuál de estos beneficios o mejoras te gustaría MÁS que implementara la empresa?",
                tipo: "opcion_multiple",
                requerida: false,
                opciones: "Horarios flexibles|Trabajo remoto|Capacitaciones técnicas|Actividades recreativas|Mejor equipamiento|Espacios de descanso|Programas de bienestar|Reconocimientos públicos",
                orden: 6
            },
            {
                texto: "¿Recomendarías a un amigo trabajar en esta empresa?",
                tipo: "si_no",
                requerida: true,
                opciones: null,
                orden: 7
            },
            {
                texto: "En general, ¿qué tan satisfecho estás trabajando en esta empresa?",
                tipo: "escala",
                requerida: true,
                opciones: null,
                orden: 8
            },
            {
                texto: "¿Qué sugerencias tienes para mejorar el clima laboral en tu área?",
                tipo: "texto",
                requerida: false,
                opciones: null,
                orden: 9
            }
        ]
    };

    const handleRespuestaChange = (preguntaOrden, valor) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaOrden]: valor
        }));
    };

    const validarFormulario = () => {
        const preguntasRequeridas = formularioEstatico.preguntas.filter(p => p.requerida);

        for (let pregunta of preguntasRequeridas) {
            const respuesta = respuestas[pregunta.orden];
            if (!respuesta || respuesta.trim() === '') {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            alert('Por favor, completa todas las preguntas requeridas.');
            return;
        }

        setEnviando(true);

        try {
            // Estructura de respuestas que coincide con tu formato
            const datosEnvio = {
                empresa,
                area,
                formulario: formularioEstatico.formulario,
                respuestas: Object.keys(respuestas).map(orden => ({
                    preguntaOrden: parseInt(orden),
                    respuesta: respuestas[orden],
                    fechaRespuesta: new Date().toISOString()
                })),
                fechaEnvio: new Date().toISOString()
            };

            console.log('Enviando respuestas:', datosEnvio);

            // Simular delay de envío
            await new Promise(resolve => setTimeout(resolve, 2000));

            setEnviado(true);
        } catch (error) {
            console.error('Error al enviar:', error);
            alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    const renderPregunta = (pregunta) => {
        switch (pregunta.tipo) {
            case 'texto':
                return (
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="4"
                        placeholder="Escribe tu respuesta aquí..."
                        value={respuestas[pregunta.orden] || ''}
                        onChange={(e) => handleRespuestaChange(pregunta.orden, e.target.value)}
                    />
                );

            case 'si_no':
                return (
                    <div className="space-y-3">
                        {['Sí', 'No'].map((opcion) => (
                            <label key={opcion} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`pregunta-${pregunta.orden}`}
                                    value={opcion}
                                    checked={respuestas[pregunta.orden] === opcion}
                                    onChange={(e) => handleRespuestaChange(pregunta.orden, e.target.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{opcion}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'opcion_multiple':
                const opciones = pregunta.opciones ? pregunta.opciones.split('|') : [];
                return (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 mb-3">
                            Selecciona una opción:
                        </p>
                        {opciones.map((opcion) => (
                            <label key={opcion} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`pregunta-${pregunta.orden}`}
                                    value={opcion}
                                    checked={respuestas[pregunta.orden] === opcion}
                                    onChange={(e) => handleRespuestaChange(pregunta.orden, e.target.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{opcion}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'escala':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>1 (Muy insatisfecho)</span>
                            <span>10 (Muy satisfecho)</span>
                        </div>
                        <div className="flex justify-between space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((numero) => (
                                <label key={numero} className="flex flex-col items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`pregunta-${pregunta.orden}`}
                                        value={numero.toString()}
                                        checked={respuestas[pregunta.orden] === numero.toString()}
                                        onChange={(e) => handleRespuestaChange(pregunta.orden, e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${respuestas[pregunta.orden] === numero.toString()
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-gray-300 text-gray-600 hover:border-blue-300'
                                        }`}>
                                        {numero}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (enviado) {
        return (
            <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center p-5">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        ¡Gracias por tu participación!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Tu evaluación ha sido enviada exitosamente. Tus respuestas nos ayudarán a mejorar el clima laboral.
                    </p>
                    <div className="text-sm text-gray-500">
                        <p>Empresa: <span className="font-semibold">{empresa}</span></p>
                        <p>Área: <span className="font-semibold">{area}</span></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen pt-10 bg-gray-50 flex items-center justify-center pb-10">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {formularioEstatico.formulario.titulo}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                <div className="flex items-center space-x-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>Empresa: <strong>{empresa}</strong></span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>Área: <strong>{area}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600">{formularioEstatico.formulario.descripcion}</p>
                </div>

                {/* Formulario */}
                <div className="space-y-6">
                    {formularioEstatico.preguntas
                        .sort((a, b) => a.orden - b.orden) // Ordenar por campo 'orden'
                        .map((pregunta) => (
                        <div key={pregunta.orden} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {pregunta.orden}. {pregunta.texto}
                                    {pregunta.requerida && <span className="text-red-500 ml-1">*</span>}
                                </h3>
                            </div>
                            {renderPregunta(pregunta)}
                        </div>
                    ))}

                    {/* Botón de envío */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <button
                            onClick={handleSubmit}
                            disabled={enviando}
                            className="w-full !bg-cyan-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            {enviando ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Enviar Evaluación</span>
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-3">
                            <span className="text-red-500 font-bold ">*</span> Campos requeridos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Formulario;