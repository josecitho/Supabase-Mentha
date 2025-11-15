import React, { useState } from 'react';
import { Clock, DollarSign, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  image: string;
  rating: number;
  popular?: boolean;
}

const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services: Service[] = [
    {
      id: 'facial-basic',
      name: t('services.facial'),
      description: t('service.facial.full'),
      price: '$75',
      duration: '60 min',
      category: 'facial',
      image: 'https://images.pexels.com/photos/3985347/pexels-photo-3985347.jpeg',
      rating: 4.9,
      popular: true
    },
    {
      id: 'haircut-women',
      name: t('services.haircut'),
      description: t('service.haircut.desc'),
      price: '$65',
      duration: '90 min',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
      rating: 4.8
    },
    {
      id: 'hair-coloring',
      name: t('services.coloring'),
      description: t('service.coloring.desc'),
      price: '$120',
      duration: '2.5 hrs',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3764537/pexels-photo-3764537.jpeg',
      rating: 4.9
    },
    {
      id: 'highlights',
      name: t('services.highlights'),
      description: t('service.highlights.desc'),
      price: '$150',
      duration: '3 hrs',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3992859/pexels-photo-3992859.jpeg',
      rating: 4.7,
      popular: true
    },
    {
      id: 'balayage',
      name: t('services.balayage'),
      description: t('service.balayage.full'),
      price: '$180',
      duration: '3.5 hrs',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3993287/pexels-photo-3993287.jpeg',
      rating: 4.9,
      popular: true
    },
    {
      id: 'extensions',
      name: t('services.extensions'),
      description: t('service.extensions.desc'),
      price: '$250',
      duration: '4 hrs',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg',
      rating: 4.8
    },
    {
      id: 'blowout',
      name: t('services.blowout'),
      description: t('service.blowout.desc'),
      price: '$45',
      duration: '45 min',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3992865/pexels-photo-3992865.jpeg',
      rating: 4.6
    },
    {
      id: 'keratin',
      name: t('services.keratin'),
      description: t('service.keratin.desc'),
      price: '$200',
      duration: '3 hrs',
      category: 'hair',
      image: 'https://images.pexels.com/photos/3764513/pexels-photo-3764513.jpeg',
      rating: 4.8
    },
    {
      id: 'waxing',
      name: t('services.waxing'),
      description: t('service.waxing.desc'),
      price: '$35',
      duration: '30 min',
      category: 'beauty',
      image: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg',
      rating: 4.7
    },
    {
      id: 'eyebrows',
      name: t('services.eyebrows'),
      description: t('service.eyebrows.desc'),
      price: '$25',
      duration: '20 min',
      category: 'beauty',
      image: 'https://images.pexels.com/photos/3985341/pexels-photo-3985341.jpeg',
      rating: 4.9
    },
    {
      id: 'lashes',
      name: t('services.lashes'),
      description: t('service.lashes.full'),
      price: '$120',
      duration: '2 hrs',
      category: 'beauty',
      image: 'https://images.pexels.com/photos/3985321/pexels-photo-3985321.jpeg',
      rating: 4.8,
      popular: true
    },
    {
      id: 'makeup',
      name: t('services.makeup'),
      description: t('service.makeup.desc'),
      price: '$80',
      duration: '60 min',
      category: 'beauty',
      image: 'https://images.pexels.com/photos/3985334/pexels-photo-3985334.jpeg',
      rating: 4.7
    }
  ];

  const categories = [
    { id: 'all', name: t('services.category.all') },
    { id: 'hair', name: t('services.category.hair') },
    { id: 'facial', name: t('services.category.facial') },
    { id: 'beauty', name: t('services.category.beauty') }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-mentha-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {service.popular && (
                <div className="absolute z-10 top-4 left-4">
                  <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('services.popular')}
                  </span>
                </div>
              )}
              
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-accent-400 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-mentha-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      {service.price}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to={`/booking?service=${service.id}`}
                    className="flex-1 bg-mentha-600 hover:bg-mentha-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    {t('common.book')}
                  </Link>
                  <button className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-mentha-300 transition-colors">
                    {t('common.learnMore')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-mentha-600 to-mentha-700 rounded-3xl p-12 text-white">
          <h2 className="font-serif text-3xl font-bold mb-4">
            {t('services.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('services.cta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-mentha-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('services.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;