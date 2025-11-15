import React from 'react';
import { Award, Users, Heart, Star, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const team = [
    {
      name: 'Ana Rodriguez',
      role: t('about.team.founder'),
      speciality: 'Hair Design & Color',
      experience: '12 years',
      image: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg',
      bio: t('about.team.ana.bio')
    },
    {
      name: 'Sofia Martinez',
      role: t('about.team.facialSpecialist'),
      speciality: 'Skincare & Wellness',
      experience: '8 years',
      image: 'https://images.pexels.com/photos/3985347/pexels-photo-3985347.jpeg',
      bio: t('about.team.sofia.bio')
    },
    {
      name: 'Lucia Fernandez',
      role: t('about.team.beautySpecialist'),
      speciality: 'Lashes & Makeup',
      experience: '6 years',
      image: 'https://images.pexels.com/photos/3985334/pexels-photo-3985334.jpeg',
      bio: t('about.team.lucia.bio')
    },
    {
      name: 'Carmen Lopez',
      role: t('about.team.juniorStylist'),
      speciality: 'Cuts & Styling',
      experience: '3 years',
      image: 'https://images.pexels.com/photos/3992865/pexels-photo-3992865.jpeg',
      bio: t('about.team.carmen.bio')
    }
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.values.clientCare'),
      description: t('about.values.clientCareDesc')
    },
    {
      icon: Award,
      title: t('about.values.excellence'),
      description: t('about.values.excellenceDesc')
    },
    {
      icon: Users,
      title: t('about.values.expertTeam'),
      description: t('about.values.expertTeamDesc')
    },
    {
      icon: Star,
      title: t('about.values.luxury'),
      description: t('about.values.luxuryDesc')
    }
  ];

  const milestones = [
    { year: '2014', event: 'MENTHA SALÓN founded with a vision of luxury beauty services' },
    { year: '2016', event: 'Expanded services to include advanced facial treatments' },
    { year: '2018', event: 'Introduced premium lash and makeup services' },
    { year: '2020', event: 'Launched online booking and virtual consultations' },
    { year: '2022', event: 'Opened second location and expanded team' },
    { year: '2024', event: 'Celebrating 10 years of beauty transformations' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-mentha-50 to-cream-100">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg')`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
                {t('about.story.title')}
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  {t('about.story.p1')}
                </p>
                <p>
                  {t('about.story.p2')}
                </p>
                <p>
                  {t('about.story.p3')}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-mentha-400 to-mentha-600 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">10+</div>
                    <div className="text-sm opacity-90">{t('about.stats.experience')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2500+</div>
                    <div className="text-sm opacity-90">{t('about.stats.clients')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">15k+</div>
                    <div className="text-sm opacity-90">{t('about.stats.services')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">4.9</div>
                    <div className="text-sm opacity-90">{t('about.stats.rating')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-mentha-100 rounded-full mb-6">
                  <value.icon className="w-8 h-8 text-mentha-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div key={index} className="flex space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-cover bg-center rounded-full" 
                       style={{ backgroundImage: `url(${member.image})` }}>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-mentha-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {member.speciality}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {member.experience}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {t('about.journey.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.journey.subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-20 h-20 bg-mentha-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {milestone.year}
                </div>
                <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-20 bg-gradient-to-r from-mentha-600 to-mentha-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">
              {t('about.visit.title')}
            </h2>
            <p className="text-xl opacity-90">
              {t('about.visit.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-lg">{t('about.visit.location')}</h3>
                    <p className="opacity-90">123 Beauty Street, City, State 12345</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-lg">{t('about.visit.hours')}</h3>
                    <div className="opacity-90 space-y-1">
                      <p>Mon - Fri: 9AM - 8PM</p>
                      <p>Saturday: 9AM - 6PM</p>
                      <p>Sunday: 10AM - 5PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <h3 className="font-serif text-2xl font-bold mb-4">
                {t('about.visit.cta.title')}
              </h3>
              <p className="text-lg opacity-90 mb-6">
                {t('about.visit.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <button className="bg-white text-rose-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors">
                  {t('about.visit.book')}
                </button>
                <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-mentha-600 transition-colors">
                  {t('about.visit.contact')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;