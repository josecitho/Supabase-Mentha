import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type CitaDetallada = {
  id: string;
  fecha_hora: string;
  estado: string;
  notas: string;
  created_at: string;
  cliente: {
    nombre: string;
    telefono: string;
    correo: string;
    nota: string;
  };
  servicio: {
    nombre_servicio: string;
    precio: number;
    duracion_minutos: number;
  };
};

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const [citas, setCitas] = useState<CitaDetallada[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todas');

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error loading appointments');
      setCitas(json.data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateEstado = async (citaId: string, nuevoEstado: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas/${citaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error updating status');
      await loadCitas();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteCita = async (citaId: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas/${citaId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error deleting appointment');
      await loadCitas();
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredCitas = citas.filter(cita => {
    if (filter === 'todas') return true;
    return cita.estado === filter;
  });

  const formatFecha = (fechaHora: string) => {
    const date = new Date(fechaHora);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (fechaHora: string) => {
    const date = new Date(fechaHora);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
          <p className="text-gray-600 mt-2">{t('admin.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.stats.total')}</p>
                <p className="text-2xl font-bold text-gray-900">{citas.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.stats.pending')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {citas.filter(c => c.estado === 'pendiente').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.stats.confirmed')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {citas.filter(c => c.estado === 'confirmada').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.stats.completed')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {citas.filter(c => c.estado === 'completada').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {['todas', 'pendiente', 'confirmada', 'completada', 'cancelada'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFilter(estado)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === estado
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`admin.filter.${estado === 'todas' ? 'all' : estado}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredCitas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t('admin.noAppointments')}</p>
            </div>
          ) : (
            filteredCitas.map((cita) => (
              <div key={cita.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Date & Service */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0">
                        <div className="bg-rose-100 rounded-lg p-3">
                          <Calendar className="w-6 h-6 text-rose-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {cita.servicio.nombre_servicio}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatFecha(cita.fecha_hora)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatHora(cita.fecha_hora)}
                          </span>
                          <span className="font-medium">
                            ${cita.servicio.precio}
                          </span>
                          <span>
                            {cita.servicio.duracion_minutos} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-3">
                      <h4 className="font-medium text-gray-900 mb-2">{t('admin.client')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {cita.cliente.nombre}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {cita.cliente.telefono}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {cita.cliente.correo}
                        </div>
                      </div>
                      {cita.notas && (
                        <div className="mt-3 text-sm text-gray-600">
                          <strong>{t('admin.notes')}:</strong> {cita.notas}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(cita.estado)}`}>
                      {t(`admin.status.${cita.estado}`)}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {cita.estado === 'pendiente' && (
                        <button
                          onClick={() => updateEstado(cita.id, 'confirmada')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          {t('admin.actions.confirm')}
                        </button>
                      )}
                      {cita.estado === 'confirmada' && (
                        <button
                          onClick={() => updateEstado(cita.id, 'completada')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          {t('admin.actions.complete')}
                        </button>
                      )}
                      {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                        <button
                          onClick={() => updateEstado(cita.id, 'cancelada')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                        >
                          {t('admin.actions.cancel')}
                        </button>
                      )}
                      <button
                        onClick={() => deleteCita(cita.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                      >
                        {t('admin.actions.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
