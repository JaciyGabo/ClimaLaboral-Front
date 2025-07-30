import React, { useState } from 'react';
import { FileText, Trash2, Eye, Calendar, Hash, ChevronDown, ChevronUp } from 'lucide-react';

const FormulariosRealizados = ({ forms, onDeleteForm }) => {
    const [expandedForm, setExpandedForm] = useState(null);

    const toggleExpanded = (formId) => {
        setExpandedForm(expandedForm === formId ? null : formId);
    };

    const getQuestionTypeLabel = (type) => {
        const types = {
            'open': 'Abierta',
            'closed': 'Sí/No',
            'multiple': 'Múltiple',
            'rating': 'Valoración'
        };
        return types[type] || type;
    };

    if (forms.length === 0) {
        return (
            <div className="text-center py-12"> 
                <FileText size={90} strokeWidth={2} className="mx-auto text-orange-400 mb-4" />
                <p className="text-white/70 text-lg mb-2">No hay formularios guardados</p>
                <p className="text-white/50 text-sm">Los formularios que guardes aparecerán aquí</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {forms.map((form) => (
                <div key={form.id} className="backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden transition-all duration-300 hover:bg-black/30">
                    <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold text-lg truncate mb-1">
                                    {form.title}
                                </h3>
                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{form.createdAt}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Hash className="h-4 w-4" />
                                        <span>{form.totalQuestions} preguntas</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <button
                                    onClick={() => toggleExpanded(form.id)}
                                    className="text-cyan-400 hover:text-cyan-600 hover:bg-white/20 !rounded-full !transition-colors"
                                    title="Ver detalles"
                                >
                                    {expandedForm === form.id ? 
                                        <ChevronUp size={24} strokeWidth={3} /> : 
                                        <ChevronDown size={24} strokeWidth={3} />
                                    }
                                </button>
                                <button
                                    onClick={() => onDeleteForm(form.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500 !rounded-full !transition-colors"
                                    title="Eliminar formulario"
                                >
                                    <Trash2 size={24} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Barra de progreso visual */}
                        <div className="flex gap-1 mb-3">
                            {Array.from({ length: Math.min(form.totalQuestions, 10) }, (_, i) => (
                                <div 
                                    key={i} 
                                    className="h-1 flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                />
                            ))}
                            {form.totalQuestions > 10 && (
                                <span className="text-white/60 text-xs ml-2">+{form.totalQuestions - 10}</span>
                            )}
                        </div>

                        {/* Estado del formulario */}
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                Guardado
                            </span>
                        </div>
                    </div>

                    {/* Panel expandido con detalles */}
                    {expandedForm === form.id && (
                        <div className="border-t border-white/20 bg-white/10 p-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Preguntas del formulario ({form.totalQuestions})
                                    </h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {form.questions.map((question, index) => (
                                            <div key={question.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500/30 text-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-medium mb-1 leading-relaxed">
                                                            {question.title || 'Pregunta sin título'}
                                                            {question.required && <span className="text-red-300 ml-1">*</span>}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-500/30">
                                                                {getQuestionTypeLabel(question.type)}
                                                            </span>
                                                            {question.type === 'multiple' && question.options && (
                                                                <span className="text-white/60 text-xs">
                                                                    {question.options.length} opciones
                                                                </span>
                                                            )}
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
                                            <div className="text-2xl font-bold text-white">{form.totalQuestions}</div>
                                            <div className="text-xs text-white/70">Preguntas totales</div>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                                            <div className="text-2xl font-bold text-green-400">
                                                {form.questions.filter(q => q.required).length}
                                            </div>
                                            <div className="text-xs text-white/70">Obligatorias</div>
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

export default FormulariosRealizados;