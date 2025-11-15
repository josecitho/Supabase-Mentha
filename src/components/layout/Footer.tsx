import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/Logo principal Mentha Salón.png"
                alt="MENTHA SALÓN"
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('common.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent-400" />
                <span className="text-gray-300">123 Beauty Street, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-400" />
                <span className="text-gray-300">info@menthasalon.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-accent-400" />
              {t('footer.hours')}
            </h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>{t('footer.monday')}</span>
                <span>9AM - 8PM</span>
              </div>
              <div className="flex justify-between">
                <span>{t('footer.saturday')}</span>
                <span>9AM - 6PM</span>
              </div>
              <div className="flex justify-between">
                <span>{t('footer.sunday')}</span>
                <span>10AM - 5PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MENTHA SALÓN. {t('footer.rights')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.terms')}</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.cancellation')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;