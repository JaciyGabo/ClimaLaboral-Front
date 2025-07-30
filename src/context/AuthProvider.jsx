import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// 2. Crear el provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario guardado en localStorage si existe
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
