import Navbar from '../../components/Navbar/Navbar';
import DashboardCliente from '../../components/DashboardCliente/DashboardCliente';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cliente = () => {
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
        <DashboardCliente />


      </div>
    </div>

  );
}
export default Cliente;