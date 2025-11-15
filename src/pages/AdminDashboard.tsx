import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Calendar, Settings, Edit2, Trash2, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

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

interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  precio: number;
  activo: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'usuarios' | 'citas' | 'servicios'>('usuarios');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchUsuarios = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsuarios(data.data);
    } catch (err) {
      console.error('Error fetching usuarios:', err);
    }
  };

  const fetchCitas = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCitas(data.data);
    } catch (err) {
      console.error('Error fetching citas:', err);
    }
  };

  const fetchServicios = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/servicios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setServicios(data.data);
    } catch (err) {
      console.error('Error fetching servicios:', err);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchUsuarios(), fetchCitas(), fetchServicios()]).finally(() => {
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openModal = (_type: 'usuario' | 'cita' | 'servicio', item?: Usuario | Cita | Servicio | null) => {
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSaveUsuario = async () => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `http://localhost:3000/api/usuarios/${editingItem.id}`
        : 'http://localhost:3000/api/usuarios';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        await fetchUsuarios();
        closeModal();
        alert(editingItem ? 'Usuario actualizado' : 'Usuario creado');
      } else {
        alert('Error: ' + data.message);
      }
    } catch {
      alert('Error al guardar usuario');
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        await fetchUsuarios();
        alert('Usuario eliminado');
      }
    } catch {
      alert('Error al eliminar usuario');
    }
  };

  const handleUpdateCitaEstado = async (id: number, nuevoEstado: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const data = await res.json();
      if (data.success) {
        await fetchCitas();
      }
    } catch (error) {
      console.error('Error updating cita:', error);
    }
  };

  const handleDeleteCita = async (id: number) => {
    if (!window.confirm('¿Eliminar esta cita?')) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/citas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        await fetchCitas();
        alert('Cita eliminada');
      }
    } catch {
      alert('Error al eliminar cita');
    }
  };

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCitas = citas.filter(c =>
    c.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel Administrador</h1>
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'usuarios'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline h-5 w-5 mr-2" />
              Staff y Usuarios
            </button>
            <button
              onClick={() => setActiveTab('citas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'citas'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="inline h-5 w-5 mr-2" />
              Citas y Reservas
            </button>
            <button
              onClick={() => setActiveTab('servicios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'servicios'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="inline h-5 w-5 mr-2" />
              Servicios
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* USUARIOS TAB */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestionar Staff y Usuarios</h2>
              <button
                onClick={() => openModal('usuario')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar Usuario</span>
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{u.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.rol === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2 flex">
                        <button
                          onClick={() => openModal('usuario', u)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUsuario(u.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CITAS TAB */}
        {activeTab === 'citas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestionar Citas y Reservas</h2>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar citas por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCitas.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.cliente.nombre} {c.cliente.apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.cliente.telefono}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.servicio.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(c.fecha_hora).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={c.estado}
                          onChange={(e) => handleUpdateCitaEstado(c.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                            c.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            c.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                            c.estado === 'completada' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteCita(c.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SERVICIOS TAB */}
        {activeTab === 'servicios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Servicios Disponibles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((s) => (
                <div key={s.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{s.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-2">{s.descripcion}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">{s.duracion_minutos} minutos</p>
                      <p className="text-lg font-bold text-green-600">${s.precio}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar' : 'Crear'} Usuario
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="email@example.com"
                  disabled={editingItem}
                />
              </div>

              {!editingItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contraseña segura"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={formData.rol || 'staff'}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo !== false}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                  Usuario activo
                </label>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUsuario}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
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

export default AdminDashboard;
