import Navbar from '../../components/Navbar/Navbar';
import CuestionarioAdmin from '../../components/CuestionarioAdmin/CuestionarioAdmin';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Administrador = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes implementar la lógica de cierre de sesión
    navigate('/'); // Descomenta cuando uses en tu proyecto
  };


  return (

    <div>
      <Navbar
        onLogout={handleLogout}
      />

      <div className="w-screen min-h-screen bg-white pt-10 mt-16">
        <CuestionarioAdmin/>


      </div>
    </div>

  );
}
export default Administrador;