import { useState, useEffect } from 'react';
import ClimaLab from '../../assets/ClimaLab.png'; // Import your logo or icon
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps = [
    "Inicializando sistema...",
    "Cargando métricas...",
    "Preparando dashboard...",
    "Configurando análisis...",
    "¡Listo para empezar!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        return next >= 100 ? 100 : next;
      });
    }, 300);
  
    return () => clearInterval(interval); // Limpieza al desmontar
  }, []);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * (steps.length - 1));
    setCurrentStep(stepIndex);
    if (progress >= 100) {
      setTimeout(() => {
        navigate('/login'); // Redirect to the dashboard after loading
      }, 1000); // Delay to show the final state
    }
  }, [progress]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-40 h-40 mx-auto bg-gradient-to-r from-blue-300 to-indigo-300 rounded-4xl flex items-center justify-center shadow-lg transform hover:!scale-105 transition-transform duration-300">
            <img src={ClimaLab} alt="ClimaLab Logo" className="w-auto h-25" />
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 w-40 h-40 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-indigo-300 animate-pulse"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Clima Laboral
        </h1>
        <p className="text-gray-600 mb-8">
          Midiendo el pulso de tu organización
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-2">
            {Math.round(progress)}% completado
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 mb-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-sm transition-all duration-300 ${
                index === currentStep 
                  ? 'text-blue-600 font-medium' 
                  : index < currentStep 
                    ? 'text-green-500' 
                    : 'text-gray-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {index < currentStep && (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {index === currentStep && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                )}
                {index > currentStep && (
                  <div className="w-2 h-2 border border-gray-300 rounded-full"></div>
                )}
                <span>{step}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          Preparando tu experiencia de análisis
        </div>
      </div>
    </div>
  );
}