// AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Administrador from "../pages/AdministradorForms/AdministradorForms";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import Usuarios from "../pages/Usuarios/Usuarios";
import AdministradorEmpresas from "../pages/AdministradorEmpresas/AdministradorEmpresas";
import Cliente from "../pages/Cliente/Cliente";
import Formulario from "../pages/Formulario/Formulario";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />  
        <Route path="/formularios" element={<Administrador />} /> 
        <Route path="/usuario" element={<Usuarios />} />
        <Route path="/empresas" element={<AdministradorEmpresas />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
