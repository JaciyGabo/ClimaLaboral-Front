import React from 'react';
import ResponderCuestionarios from '../../components/ContestarFormulario/ContestarFormulario';

const cuestionarioMock = {
  id: 1,
  title: "Encuesta de Satisfacción Laboral",
  questions: [
    {
      id: "q1",
      title: "¿Te sientes valorado por tu equipo?",
      type: "closed",
      required: true
    },
    {
      id: "q2",
      title: "¿Qué aspectos mejorarías en tu área?",
      type: "open",
      required: true
    },
    {
      id: "q3",
      title: "Selecciona la opción que mejor describe tu ambiente laboral.",
      type: "multiple",
      required: true,
      options: ["Excelente", "Bueno", "Regular", "Malo"]
    },
    {
      id: "q4",
      title: "Evalúa tu satisfacción general.",
      type: "rating",
      required: false,
      options: {
        min: 1,
        max: 5,
        minLabel: "Nada satisfecho",
        maxLabel: "Muy satisfecho"
      }
    }
  ]
};

const usuarioMock = 101;

export default function Usuarios() {
  const handleSaveDraft = async (data) => {
    console.log("📥 Borrador guardado:", data);
    // Aquí podrías simular guardar en localStorage o simplemente hacer console.log
  };

  const handleSubmitResponse = async (data) => {
    console.log("🚀 Cuestionario enviado:", data);
    // Aquí también puedes simular un fetch o guardar en memoria
  };

  return (
    <ResponderCuestionarios
      cuestionario={cuestionarioMock}
      usuarioId={usuarioMock}
      onSaveDraft={handleSaveDraft}
      onSubmitResponse={handleSubmitResponse}
    />
  );
}
