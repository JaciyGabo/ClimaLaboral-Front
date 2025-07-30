import React, { useState, useRef } from 'react';
import GeneradorForms from "../GeneradorForms/GeneradorForms";
import FormulariosRealizados from "../FormulariosRealizados/FormulariosRealizados";

const CuestionarioAdmin = () => {
    const [savedForms, setSavedForms] = useState([]);
    const generadorRef = useRef();

    const handleSaveForm = (formData) => {
        // Mapear los datos del GeneradorForms al formato que espera FormulariosRealizados
        const newForm = {
            id: Date.now(),
            title: formData.formulario.titulo || 'Formulario sin título',
            questions: formData.preguntas.map(pregunta => ({
                id: pregunta.id || Date.now() + Math.random(),
                title: pregunta.texto,
                type: mapQuestionType(pregunta.tipo),
                required: pregunta.requerida,
                options: pregunta.opciones || null
            })),
            createdAt: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            totalQuestions: formData.preguntas.length,
            // Datos adicionales del formulario
            descripcion: formData.formulario.descripcion,
            empresaId: formData.formulario.empresaId,
            areaId: formData.formulario.areaId
        };

        setSavedForms(prev => [newForm, ...prev]);
        
        // Resetear el formulario después de guardar
        if (generadorRef.current) {
            generadorRef.current.resetForm();
        }
    };

    // Función para mapear los tipos de pregunta del GeneradorForms a FormulariosRealizados
    const mapQuestionType = (tipo) => {
        const typeMap = {
            'texto': 'open',
            'si_no': 'closed',
            'opcion_multiple': 'multiple',
            'checkbox': 'multiple',
            'escala': 'rating'
        };
        return typeMap[tipo] || 'open';
    };

    const handleDeleteForm = (formId) => {
        setSavedForms(prev => prev.filter(form => form.id !== formId));
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-t from-cyan-200 to-white">
            <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
                {/* Generador de formularios - Se muestra primero en móvil */}
                <div className="w-full lg:flex-1 order-1 lg:order-2">
                    <div className="bg-[#219EBC] backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
                        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-white">
                            Generador de formularios
                        </h1>
                        <GeneradorForms 
                            ref={generadorRef}
                            onSaveForm={handleSaveForm} 
                        />
                    </div>
                </div>

                {/* Formularios Realizados - Se muestra segundo en móvil */}
                <div className="w-full lg:w-120 order-2 lg:order-1">
                    <div className="bg-[#219EBC] backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 sticky top-6">
                        <h1 className="text-xl lg:text-2xl font-bold text-center mb-6 text-white">
                            Formularios Realizados ({savedForms.length})
                        </h1>
                        <FormulariosRealizados 
                            forms={savedForms} 
                            onDeleteForm={handleDeleteForm}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CuestionarioAdmin;