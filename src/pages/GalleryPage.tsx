import React, { useState } from 'react';
import { Search, Filter, Instagram, Heart, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: string;
  likes: number;
  comments: number;
  tags: string[];
}

const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/3985347/pexels-photo-3985347.jpeg',
      title: 'Hydrating Facial Treatment',
      category: 'facial',
      likes: 124,
      comments: 18,
      tags: ['skincare', 'facial', 'hydrating']
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
      title: 'Modern Bob Cut',
      category: 'haircut',
      likes: 89,
      comments: 12,
      tags: ['haircut', 'bob', 'modern']
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/3764537/pexels-photo-3764537.jpeg',
      title: 'Vibrant Hair Color',
      category: 'coloring',
      likes: 156,
      comments: 23,
      tags: ['color', 'vibrant', 'transformation']
    },
    {
      id: '4',
      image: 'https://images.pexels.com/photos/3992859/pexels-photo-3992859.jpeg',
      title: 'Natural Highlights',
      category: 'highlights',
      likes: 198,
      comments: 31,
      tags: ['highlights', 'natural', 'blonde']
    },
    {
      id: '5',
      image: 'https://images.pexels.com/photos/3993287/pexels-photo-3993287.jpeg',
      title: 'Balayage Perfection',
      category: 'balayage',
      likes: 234,
      comments: 45,
      tags: ['balayage', 'ombre', 'gradient']
    },
    {
      id: '6',
      image: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg',
      title: 'Volume Extensions',
      category: 'extensions',
      likes: 167,
      comments: 28,
      tags: ['extensions', 'volume', 'length']
    },
    {
      id: '7',
      image: 'https://images.pexels.com/photos/3992865/pexels-photo-3992865.jpeg',
      title: 'Glamorous Blowout',
      category: 'styling',
      likes: 142,
      comments: 19,
      tags: ['blowout', 'glamour', 'styling']
    },
    {
      id: '8',
      image: 'https://images.pexels.com/photos/3764513/pexels-photo-3764513.jpeg',
      title: 'Keratin Smooth',
      category: 'treatment',
      likes: 98,
      comments: 15,
      tags: ['keratin', 'smooth', 'treatment']
    },
    {
      id: '9',
      image: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg',
      title: 'Flawless Brows',
      category: 'eyebrows',
      likes: 187,
      comments: 26,
      tags: ['eyebrows', 'threading', 'shaping']
    },
    {
      id: '10',
      image: 'https://images.pexels.com/photos/3985321/pexels-photo-3985321.jpeg',
      title: 'Lash Extensions',
      category: 'lashes',
      likes: 203,
      comments: 34,
      tags: ['lashes', 'extensions', 'dramatic']
    },
    {
      id: '11',
      image: 'https://images.pexels.com/photos/3985334/pexels-photo-3985334.jpeg',
      title: 'Bridal Makeup',
      category: 'makeup',
      likes: 278,
      comments: 52,
      tags: ['makeup', 'bridal', 'elegant']
    },
    {
      id: '12',
      image: 'https://images.pexels.com/photos/3985341/pexels-photo-3985341.jpeg',
      title: 'Evening Glam',
      category: 'makeup',
      likes: 165,
      comments: 29,
      tags: ['makeup', 'evening', 'glam']
    }
  ];

  const categories = [
    { id: 'all', name: t('gallery.allWork'), count: galleryItems.length },
    { id: 'haircut', name: t('gallery.hairCuts'), count: galleryItems.filter(item => item.category === 'haircut').length },
    { id: 'coloring', name: t('gallery.hairColor'), count: galleryItems.filter(item => item.category === 'coloring').length },
    { id: 'highlights', name: t('services.highlights'), count: galleryItems.filter(item => item.category === 'highlights').length },
    { id: 'balayage', name: t('services.balayage'), count: galleryItems.filter(item => item.category === 'balayage').length },
    { id: 'facial', name: t('services.facial'), count: galleryItems.filter(item => item.category === 'facial').length },
    { id: 'makeup', name: t('services.makeup'), count: galleryItems.filter(item => item.category === 'makeup').length },
    { id: 'lashes', name: t('services.lashes'), count: galleryItems.filter(item => item.category === 'lashes').length }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('gallery.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          {/* Filter Button for Mobile */}
          <button className="lg:hidden flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 mr-2" />
            {t('gallery.filter')}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">{t('gallery.categories')}</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === category.id
                        ? 'bg-mentha-100 text-mentha-700 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`text-sm ${
                      selectedCategory === category.id ? 'text-mentha-600' : 'text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-white/90 text-gray-800 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors">
                          <Instagram className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-gray-500 text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                      <button className="text-mentha-600 hover:text-mentha-700 font-medium transition-colors">
                        {t('gallery.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('gallery.noResults')}</h3>
                <p className="text-gray-600">
                  {t('gallery.noResultsDesc')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-mentha-600 to-mentha-700 rounded-3xl p-12 text-white">
          <h2 className="font-serif text-3xl font-bold mb-4">
            {t('gallery.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('gallery.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-rose-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors">
              {t('gallery.cta.book')}
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-mentha-600 transition-colors">
              {t('gallery.cta.instagram')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;