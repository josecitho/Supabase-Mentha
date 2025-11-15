import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Award, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const featuredServices = [
    {
      name: t('services.facial'),
      description: t('service.facial.desc'),
      price: '$75',
      duration: '60 min',
      image: 'https://images.pexels.com/photos/3985347/pexels-photo-3985347.jpeg'
    },
    {
      name: t('services.balayage'),
      description: t('service.balayage.desc'),
      price: '$180',
      duration: '3 hrs',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'
    },
    {
      name: t('services.lashes'),
      description: t('service.lashes.desc'),
      price: '$120',
      duration: '2 hrs',
      image: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg'
    }
  ];

  const testimonials = [
    {
      name: 'Sofia Martinez',
      rating: 5,
      text: t('testimonial.1.text'),
      service: t('testimonial.1.service')
    },
    {
      name: 'Isabella Rodriguez',
      rating: 5,
      text: t('testimonial.2.text'),
      service: t('testimonial.2.service')
    },
    {
      name: 'Carmen Lopez',
      rating: 5,
      text: t('testimonial.3.text'),
      service: t('testimonial.3.service')
    }
  ];

  const stats = [
    { icon: Users, label: t('home.stats.clients'), value: '2,500+' },
    { icon: Award, label: t('home.stats.experience'), value: '10+' },
    { icon: Clock, label: t('home.stats.services'), value: '15,000+' },
    { icon: Star, label: t('home.stats.rating'), value: '4.9' }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-mentha-50 to-cream-100">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg')`,
            filter: 'brightness(0.7)'
          }}
        ></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8 max-w-2xl mx-auto animate-slide-up">
            {t('home.hero.subtitle')}
          </p>
          <Link
            to="/booking"
            className="inline-block bg-mentha-600 hover:bg-mentha-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounce-gentle"
          >
            {t('home.hero.cta')}
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-mentha-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-mentha-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }}></div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-mentha-600">{service.price}</span>
                    <span className="text-gray-500">{service.duration}</span>
                  </div>
                  <Link
                    to="/booking"
                    className="w-full bg-mentha-600 hover:bg-mentha-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
                  >
                    {t('common.book')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-block bg-white hover:bg-gray-50 text-mentha-600 font-semibold px-8 py-4 rounded-lg border-2 border-mentha-600 transition-colors"
            >
              {t('home.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-mentha-600 to-mentha-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-mentha-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('home.cta.book')}
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-mentha-600 transition-colors"
            >
              {t('home.cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;