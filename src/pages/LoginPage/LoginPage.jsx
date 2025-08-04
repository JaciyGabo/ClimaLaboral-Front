import { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import ClimaLab from '../../assets/ClimaLab.png';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',

  });

  const handleInputChange = (e) => {
    setError(''); // limpia error anterior si todo está bien
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (email === "jacielquiroga70@gmail.com" && password === "123") {
      navigate('/formularios');
      return;
    }else if(email === "jaciel007@hotmail.es" && password === "123"){
      navigate('/empresas');
      return;
    }else if(email === "jacielquiroga70@gmail.comm" && password === "123"){
      navigate('/cliente');
      return;
    }
    else{
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="w-screen h-screen flex" style={{ backgroundColor: '#8ECAE6' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white relative overflow-hidden" style={{ backgroundColor: '#023047' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ backgroundColor: '#219EBC' }}></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full" style={{ backgroundColor: '#FEB703' }}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full" style={{ backgroundColor: '#FB8600' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="w-35 h-35 mx-auto rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#219EBC' }}>
              <img src={ClimaLab} alt="ClimaLab Logo" className="w- h-25" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Clima Laboral</h1>
            <p className="text-xl opacity-90">Sistema de Gestión Organizacional</p>
          </div>

          <div className="space-y-4 !text-center">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full " style={{ backgroundColor: '#FEB703' }}></div>
              <span>Medición integral del ambiente laboral</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FB8600' }}></div>
              <span>Análisis de satisfacción mediante IA</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#219EBC' }}></div>
              <span>Reportes ejecutivos y métricas clave</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#023047' }}>
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Accede a tu plataforma de gestión organizacional
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <label className="block text-sm font-medium mb-2" style={{ color: '#023047' }}>
      Nombre de Usuario o Correo Electrónico
    </label>
    <div className="relative">
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-3 border text-gray-600 border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-colors"
        placeholder="correo@empresa.com"
        required
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2" style={{ color: '#023047' }}>
      Contraseña
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className="w-full pl-10 pr-12 py-3 border text-gray-600 border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-colors"
        placeholder="Contraseña segura"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute !rounded-full !bg-white right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>

  {error && (
    <div className="text-red-500 text-sm text-center font-medium">
      {error}
    </div>
  )}

  <button
    type="submit"
    className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200 hover:opacity-90"
    style={{ backgroundColor: '#FEB703' }}
  >
    Iniciar Sesión
  </button>
</form>




            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Al continuar, aceptas nuestros términos de servicio y política de privacidad
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}