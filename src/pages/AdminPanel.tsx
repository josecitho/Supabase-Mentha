import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Briefcase, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  active: boolean;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'admin';
  active: boolean;
}

const AdminPanel: React.FC = () => {
  const { user, isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'services' | 'staff'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    active: true
  });

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as 'staff' | 'admin'
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    await Promise.all([fetchServices(), fetchStaffUsers()]);
    setLoadingData(false);
  };

  const fetchServices = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/servicios`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error fetching services');
      const mapped = (json.data || []).map((s: any) => ({
        id: s.id?.toString() || s.id,
        name: s.nombre || s.name,
        description: s.descripcion || s.description || null,
        duration_minutes: s.duracion_minutos || s.duration_minutes,
        price: s.precio || s.price,
        active: s.activo !== undefined ? s.activo : s.active
      }));
      setServices(mapped);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      // No hay endpoint de staff en el servidor local por defecto.
      // Usa Prisma Studio para gestionar usuarios staff en modo local.
      setStaffUsers([]);
    } catch (error) {
      console.error('Error fetching staff users:', error);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // En modo local la edición/creación de servicios se hace desde Prisma Studio o implementando endpoints en el servidor.
      alert('CRUD de servicios deshabilitado en modo local. Usa `npx prisma studio` para editar servicios.');
      closeServiceModal();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error al guardar el servicio');
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // En modo local no se crea staff desde frontend. Usa Prisma Studio para añadir usuarios staff.
      alert('Crea usuarios staff desde `npx prisma studio` en modo local.');
      closeStaffModal();
    } catch (error: any) {
      console.error('Error saving staff:', error);
      alert(error.message || 'Error al guardar el usuario');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      alert('Eliminar servicios desde frontend está deshabilitado en modo local. Usa `npx prisma studio`.');
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error al eliminar el servicio');
    }
  };

  const toggleServiceActive = async (id: string, active: boolean) => {
    try {
      alert('Activar/desactivar servicios desde frontend está deshabilitado en modo local. Usa `npx prisma studio`.');
      await fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const toggleStaffActive = async (id: string, active: boolean) => {
    alert('Para gestionar el personal, usa: npx prisma studio');
  };

  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description || '',
        duration_minutes: service.duration_minutes,
        price: service.price,
        active: service.active
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        description: '',
        duration_minutes: 60,
        price: 0,
        active: true
      });
    }
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
  };

  const openStaffModal = (staff?: StaffUser) => {
    if (staff) {
      setEditingStaff(staff);
      setStaffForm({
        name: staff.name,
        email: staff.email,
        password: '',
        role: staff.role
      });
    } else {
      setEditingStaff(null);
      setStaffForm({
        name: '',
        email: '',
        password: '',
        role: 'staff'
      });
    }
    setShowStaffModal(true);
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setEditingStaff(null);
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
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona servicios y personal del salón
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'services'
                    ? 'border-mentha-600 text-mentha-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-5 h-5 inline-block mr-2" />
                Servicios
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'staff'
                    ? 'border-mentha-600 text-mentha-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 inline-block mr-2" />
                Personal
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Servicios</h2>
                  <button
                    onClick={() => openServiceModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-mentha-600 text-white rounded-lg hover:bg-mentha-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Nuevo Servicio
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Servicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duración
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
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
                      {services.map((service) => (
                        <tr key={service.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.description}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {service.duration_minutes} min
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            ${service.price}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleServiceActive(service.id, service.active)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                service.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {service.active ? 'Activo' : 'Inactivo'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openServiceModal(service)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteService(service.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal</h2>
                  <button
                    onClick={() => openStaffModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-mentha-600 text-white rounded-lg hover:bg-mentha-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Nuevo Usuario
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
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
                      {staffUsers.map((staff) => (
                        <tr key={staff.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {staff.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {staff.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              staff.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {staff.role === 'admin' ? 'Admin' : 'Staff'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleStaffActive(staff.id, staff.active)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                staff.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {staff.active ? 'Activo' : 'Inactivo'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openStaffModal(staff)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button onClick={closeServiceModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={serviceForm.duration_minutes}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={serviceForm.active}
                  onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                  className="h-4 w-4 text-mentha-600 focus:ring-mentha-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Servicio activo
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeServiceModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-mentha-600 text-white rounded-lg hover:bg-mentha-700 transition-colors"
                >
                  {editingService ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingStaff ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={closeStaffModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  disabled={!!editingStaff}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {!editingStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as 'staff' | 'admin' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mentha-500 focus:border-transparent"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeStaffModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-mentha-600 text-white rounded-lg hover:bg-mentha-700 transition-colors"
                >
                  {editingStaff ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
