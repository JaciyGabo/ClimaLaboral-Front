import axios from "axios";

const API_BASE_URL = "https://api.example.com"; // Cambia esto por tu URL de API real
//const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;