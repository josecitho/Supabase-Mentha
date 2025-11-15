import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Cita {
  id: number;
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  servicio: {
    nombre: string;
    precio: number;
  };
  fecha_hora: string;
  estado: string;
  notas?: string;
}

const StaffDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchCitas();
  }, [token]);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCitas(data.data);
    } catch (error) {
      console.error('Error fetching citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleViewDetails = (cita: Cita) => {
    setSelectedCita(cita);
    setShowDetailModal(true);
  };

  const filteredCitas = citas.filter(c => {
    const matchesSearch = 
      c.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cliente.telefono.includes(searchTerm);
    
    const matchesStatus = filterStatus === '' || c.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: citas.length,
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    confirmadas: citas.filter(c => c.estado === 'confirmada').length,
    completadas: citas.filter(c => c.estado === 'completada').length,
    canceladas: citas.filter(c => c.estado === 'cancelada').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Staff</h1>
            <p className="text-sm text-gray-600 mt-1">Vista de solo lectura - Citas y Reservas</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hola, {user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 text-sm font-medium">Total Citas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-yellow-600 text-sm font-medium">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendientes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-blue-600 text-sm font-medium">Confirmadas</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.confirmadas}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-green-600 text-sm font-medium">Completadas</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completadas}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-600 text-sm font-medium">Canceladas</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.canceladas}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar cliente</label>
              <input
                type="text"
                placeholder="Nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="confirmada">Confirmadas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Citas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCitas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay citas que coincidan con los filtros
                  </td>
                </tr>
              ) : (
                filteredCitas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cita.cliente.nombre} {cita.cliente.apellido}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="text-xs">
                        <p>📧 {cita.cliente.email}</p>
                        <p>📞 {cita.cliente.telefono}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">{cita.servicio.nombre}</p>
                        <p className="text-xs text-green-600">${cita.servicio.precio}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(cita.fecha_hora).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        cita.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                        cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(cita)}
                        className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedCita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Detalles de la Cita</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Cita ID</p>
                <p className="text-sm font-medium text-gray-900">#{selectedCita.id}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Cliente</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedCita.cliente.nombre} {selectedCita.cliente.apellido}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Contacto</p>
                <p className="text-sm text-gray-600">{selectedCita.cliente.email}</p>
                <p className="text-sm text-gray-600">{selectedCita.cliente.telefono}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Servicio</p>
                <p className="text-sm font-medium text-gray-900">{selectedCita.servicio.nombre}</p>
                <p className="text-sm text-green-600">${selectedCita.servicio.precio}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Fecha y Hora</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedCita.fecha_hora).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedCita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  selectedCita.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                  selectedCita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedCita.estado.charAt(0).toUpperCase() + selectedCita.estado.slice(1)}
                </span>
              </div>

              {selectedCita.notas && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Notas</p>
                  <p className="text-sm text-gray-600">{selectedCita.notas}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
