// Ejemplo de cómo integrar Prisma en BookingPage.tsx
// Descomenta las líneas para usar Prisma en lugar de Supabase

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
// import { citaService } from '../services/citaService'; // NUEVO: Importar servicio de Prisma

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  active: boolean;
}

const BookingPageWithPrisma: React.FC = () => {
  const { t } = useLanguage();
  const [servicios, setServicios] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    servicio_id: '',
    fecha: '',
    hora: '',
    notas: ''
  });

  const timeSlots = [
    '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00'
  ];

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      // OPCIÓN 1: Usar Prisma (descomenta)
      /*
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/servicios`);
      const result = await response.json();
      
      const mappedData = (result.data || []).map(s => ({
        id: s.id.toString(),
        name: s.nombre,
        description: s.descripcion,
        duration_minutes: s.duracion_minutos,
        price: s.precio,
        active: s.activo
      }));
      
      setServicios(mappedData);
      */

      // OPCIÓN 2: Usar Supabase (actual)
      const { data, error } = await supabase
        .from('servicios')
        .select('id, nombre, descripcion, duracion_minutos, precio, activo')
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;

      const mappedData = (data || []).map(s => ({
        id: s.id,
        name: s.nombre,
        description: s.descripcion,
        duration_minutes: s.duracion_minutos,
        price: s.precio,
        active: s.activo
      }));

      setServicios(mappedData);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // OPCIÓN 1: Usar Prisma (descomenta)
      /*
      const response = await citaService.createCita({
        nombre: formData.nombre,
        telefono: formData.telefono,
        correo: formData.correo,
        servicio_id: parseInt(formData.servicio_id),
        fecha: formData.fecha,
        hora: formData.hora,
        notas: formData.notas
      });

      if (!response.success) {
        throw new Error(response.message);
      }
      */

      // OPCIÓN 2: Usar Supabase (actual)
      const fechaHora = `${formData.fecha}T${formData.hora}:00`;

      // Primero crear el cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          nombre: formData.nombre.split(' ')[0],
          apellido: formData.nombre.split(' ').slice(1).join(' ') || formData.nombre.split(' ')[0],
          email: formData.correo,
          telefono: formData.telefono
        })
        .select()
        .single();

      if (clienteError) throw clienteError;

      // Luego crear la cita
      const { error: citaError } = await supabase
        .from('citas')
        .insert({
          cliente_id: clienteData.id,
          servicio_id: formData.servicio_id,
          fecha_hora: fechaHora,
          estado: 'pendiente',
          notas: formData.notas
        });

      if (citaError) throw citaError;

      setSuccess(true);
      setFormData({
        nombre: '',
        telefono: '',
        correo: '',
        servicio_id: '',
        fecha: '',
        hora: '',
        notas: ''
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Error al crear la cita');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('booking.new.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('booking.new.subtitle')}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <Check className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">
              {t('booking.new.success')}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('booking.new.personalInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.new.fullName')} {t('booking.new.required')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder={t('booking.new.fullNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.new.phone')} {t('booking.new.required')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder={t('booking.new.phonePlaceholder')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.new.email')} {t('booking.new.required')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder={t('booking.new.emailPlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('booking.new.selectService')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicios.map((servicio) => (
                  <div
                    key={servicio.id}
                    onClick={() => handleChange('servicio_id', servicio.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.servicio_id === servicio.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {servicio.name}
                    </h3>
                    {servicio.description && (
                      <p className="text-sm text-gray-600 mb-2">{servicio.description}</p>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${servicio.price}</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {servicio.duration_minutes} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('booking.new.dateTime')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    {t('booking.new.date')} {t('booking.new.required')}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => handleChange('fecha', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    {t('booking.new.time')} {t('booking.new.required')}
                  </label>
                  <select
                    required
                    value={formData.hora}
                    onChange={(e) => handleChange('hora', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">{t('booking.new.selectTime')}</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.new.additionalNotes')}
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => handleChange('notas', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                placeholder={t('booking.new.notesPlaceholder')}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-colors ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('booking.new.booking')}
                </span>
              ) : (
                t('booking.new.bookButton')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPageWithPrisma;
