/**
 * Configuración centralizada de URLs de API
 * Se ajusta automáticamente según el entorno (desarrollo/producción)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    LOGIN: `${API_URL}/api/login`,
    CITAS: `${API_URL}/api/citas`,
    SERVICIOS: `${API_URL}/api/servicios`,
    USUARIOS: `${API_URL}/api/usuarios`,
    HEALTH: `${API_URL}/api/health`,
  },
};

export default API_CONFIG;
