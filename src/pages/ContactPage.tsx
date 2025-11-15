import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert(t('contact.form.success'));
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const services = [
    t('services.facial'),
    t('services.haircut'),
    t('services.coloring'),
    t('services.highlights'),
    t('services.balayage'),
    t('services.extensions'),
    t('services.blowout'),
    t('services.keratin'),
    t('services.waxing'),
    t('services.eyebrows'),
    t('services.lashes'),
    t('services.makeup'),
    t('contact.serviceOther')
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{t('contact.visit')}</h2>
              </div>
              <div className="text-gray-600 space-y-2">
                <p className="font-medium">123 Beauty Street</p>
                <p>City, State 12345</p>
                <p>United States</p>
              </div>
              <button className="mt-4 text-rose-600 hover:text-rose-700 font-medium transition-colors">
                {t('contact.getDirections')} →
              </button>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{t('contact.details')}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">{t('contact.phone')}</p>
                  <a href="tel:+15551234567" className="text-lg font-medium text-gray-900 hover:text-rose-600 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('contact.email')}</p>
                  <a href="mailto:info@menthasalon.com" className="text-lg font-medium text-gray-900 hover:text-rose-600 transition-colors">
                    info@menthasalon.com
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{t('contact.hours')}</h2>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>{t('contact.monday')}</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('contact.saturday')}</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('contact.sunday')}</span>
                  <span className="font-medium">10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{t('contact.form.title')}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')} {t('common.required')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500 transition-colors"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} {t('common.required')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500 transition-colors"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500 transition-colors"
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.service')}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500 transition-colors"
                    >
                      <option value="">{t('contact.form.selectService')}</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} {t('common.required')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500 transition-colors resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-mentha-600 hover:bg-mentha-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{t('contact.form.send')}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-mentha-600 to-mentha-700 rounded-2xl p-8 text-white text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">{t('contact.actions.bookOnline')}</h3>
            <p className="mb-6 opacity-90">
              {t('contact.actions.bookOnlineDesc')}
            </p>
            <button className="bg-white text-mentha-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              {t('contact.actions.bookNow')}
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">{t('contact.actions.callUs')}</h3>
            <p className="mb-6 opacity-90">
              {t('contact.actions.callUsDesc')}
            </p>
            <a
              href="tel:+15551234567"
              className="bg-white text-success-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-block"
            >
              {t('contact.actions.callNow')}
            </a>
          </div>

          <div className="bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl p-8 text-white text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">{t('contact.actions.visitUs')}</h3>
            <p className="mb-6 opacity-90">
              {t('contact.actions.visitUsDesc')}
            </p>
            <button className="bg-white text-gold-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              {t('contact.getDirections')}
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('contact.map.title')}</h2>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">{t('contact.map.label')}</p>
                <p className="text-sm">123 Beauty Street, City, State 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;