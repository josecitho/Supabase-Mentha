// Servicio para hacer llamadas a la API del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface CreateCitaRequest {
  nombre: string;
  telefono: string;
  correo: string;
  servicio_id: number;
  fecha: string;
  hora: string;
  notas: string;
}

export interface CreateCitaResponse {
  success: boolean;
  message: string;
  data?: {
    cita_id: number;
  };
}

export const citaService = {
  async createCita(data: CreateCitaRequest): Promise<CreateCitaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/citas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating cita:', error);
      throw error;
    }
  },
};
