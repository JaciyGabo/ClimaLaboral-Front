import { LogOut, Menu, X, User2 } from 'lucide-react';
import LogoBlanco from '../../assets/LogoBlanco.png';
import { useState, useEffect } from 'react';
import ClimaLab from '../../assets/ClimaLabIma.png';

export default function Navbar({ activeView, setActiveView, onLogout }) {
  const [isOpen, setIsOpen] = useState("cuestionario");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsOpen(activeView);
  }, [activeView]);

  const navItems = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'cuestionario', label: 'CUESTIONARIO' },
    { id: 'informes', label: 'INFORMES' },
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    setIsOpen(id);
    setIsMobileMenuOpen(false); // Cerrar menú móvil
  }

  return (
    <>
      <header className="bg-[#023047] text-white py-3 px-4 sm:px-9 flex items-center justify-between shadow fixed top-0 left-0 w-full z-[100]">

        {/* Logo */}
        <div className="flex items-center justify-center bg-white rounded-full w-15 h-15 p-2 ms-10">
          <img src={ClimaLab} alt="Logo" className="h-full w-full object-contain rounded-full" />
        </div>

        {/* Cerrar sesión - Desktop */}
        <div className='flex '>
          {/* <button
            className=" md:flex items-center space-x-1 !bg-transparent hover:border !rounded-full hover:shadow-lg"
            onClick={""}
            aria-label="Cerrar sesión"
          >
            <User2 size={25} strokeWidth={3} className=' text-white' />
          </button> */}

          <button
            className=" md:flex items-center space-x-1 !bg-transparent hover:border !rounded-full hover:shadow-lg"
            onClick={onLogout}
            aria-label="Cerrar sesión"
          >
            <LogOut size={25} strokeWidth={3} className=' text-orange-600' />
          </button>
        </div>


      </header>
    </>
  );
}