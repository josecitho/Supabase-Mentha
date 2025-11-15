import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, Filter, Search, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  date_time: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notes: string | null;
  internal_notes: string | null;
  service: Service | null;
}

const StaffPanel: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter, searchTerm]);

  const fetchAppointments = async () => {
    try {
      setLoadingData(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      // Renombrar campos de la respuesta a los que espera el componente
      const data = (json.data || []).map((cita: any) => ({
        id: cita.id,
        customer_name: cita.nombre_cliente,
        customer_phone: cita.telefono_cliente,
        customer_email: cita.email_cliente,
        date_time: cita.fecha_hora,
        status: cita.estado,
        notes: cita.notas,
        internal_notes: cita.notas_internas,
        service: cita.servicio ? {
          id: cita.servicio.id,
          name: cita.servicio.nombre,
          duration_minutes: cita.servicio.duracion_minutos,
          price: cita.servicio.precio
        } : null
      }));
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.customer_name.toLowerCase().includes(term) ||
        apt.customer_email.toLowerCase().includes(term) ||
        apt.customer_phone.includes(term)
      );
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: status })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const saveInternalNotes = async () => {
    if (!selectedAppointment) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas_internas: internalNotes })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      await fetchAppointments();
      setSelectedAppointment(null);
      setInternalNotes('');
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmada': return 'bg-blue-100 text-blue-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mentha-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600">
            Gestiona las citas y reservas del salón
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron citas
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.customer_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail className="w-4 h-4 mr-1" />
                              {appointment.customer_email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="w-4 h-4 mr-1" />
                              {appointment.customer_phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appointment.service?.name || 'N/A'}</div>
                        {appointment.service && (
                          <div className="text-sm text-gray-500">
                            {appointment.service.duration_minutes} min - ${appointment.service.price}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(appointment.date_time)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {formatTime(appointment.date_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {appointment.status === 'pendiente' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmada')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Confirmar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {(appointment.status === 'pendiente' || appointment.status === 'confirmada') && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'completada')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Completar"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelada')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancelar"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setInternalNotes(appointment.internal_notes || '');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Notas internas"
                          >
                            <ClockIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Notas Internas</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Cliente: {selectedAppointment.customer_name}</p>
              {selectedAppointment.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Nota del cliente:</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
              rows={4}
              placeholder="Agregar notas internas..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  setInternalNotes('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveInternalNotes}
                className="px-4 py-2 bg-mentha-600 text-white rounded-lg hover:bg-mentha-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPanel;
