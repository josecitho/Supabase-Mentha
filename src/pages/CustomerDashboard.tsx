import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, Gift, User, Star, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  const upcomingAppointments = [
    {
      id: '1',
      service: 'Balayage & Cut',
      date: '2025-02-15',
      time: '2:00 PM',
      staff: 'Ana Rodriguez',
      status: 'confirmed',
      price: 245
    },
    {
      id: '2',
      service: 'Facial Treatment',
      date: '2025-03-10',
      time: '11:00 AM',
      staff: 'Sofia Martinez',
      status: 'pending',
      price: 75
    }
  ];

  const appointmentHistory = [
    {
      id: '3',
      service: 'Eyelash Extensions',
      date: '2025-01-20',
      time: '3:00 PM',
      staff: 'Lucia Fernandez',
      status: 'completed',
      price: 120,
      rating: 5
    },
    {
      id: '4',
      service: 'Hair Color & Highlights',
      date: '2024-12-15',
      time: '1:00 PM',
      staff: 'Ana Rodriguez',
      status: 'completed',
      price: 180,
      rating: 5
    },
    {
      id: '5',
      service: 'Keratin Treatment',
      date: '2024-11-22',
      time: '10:00 AM',
      staff: 'Carmen Lopez',
      status: 'completed',
      price: 200,
      rating: 4
    }
  ];

  const loyaltyRewards = {
    currentPoints: user?.loyaltyPoints || 150,
    nextReward: 250,
    totalSpent: 820,
    availableRewards: [
      { name: '10% Off Next Service', points: 100, available: true },
      { name: 'Free Eyebrow Threading', points: 150, available: true },
      { name: 'Complimentary Blowout', points: 200, available: false },
      { name: 'Free Facial Treatment', points: 300, available: false }
    ]
  };

  const tabs = [
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'history', name: 'History', icon: Clock },
    { id: 'loyalty', name: 'Loyalty Rewards', icon: Gift },
    { id: 'profile', name: 'Profile', icon: User }
  ];

  const AppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
        <button className="bg-mentha-600 text-white px-6 py-2 rounded-lg hover:bg-mentha-700 transition-colors">
          Book New Appointment
        </button>
      </div>

      <div className="space-y-4">
        {upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {appointment.service}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {appointment.time}
                  </p>
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {appointment.staff}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                  appointment.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>
                <p className="text-lg font-semibold text-gray-900">${appointment.price}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Reschedule
              </button>
              <button className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Appointment History</h2>

      <div className="space-y-4">
        {appointmentHistory.map((appointment) => (
          <div key={appointment.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {appointment.service}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {appointment.staff}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 mb-2">${appointment.price}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < appointment.rating
                          ? 'text-gold-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <button className="bg-mentha-600 text-white py-2 px-4 rounded-lg hover:bg-mentha-700 transition-colors">
                Book Again
              </button>
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Leave Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LoyaltyTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Loyalty Rewards</h2>

      {/* Points Summary */}
      <div className="bg-gradient-to-r from-mentha-600 to-mentha-700 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{loyaltyRewards.currentPoints}</div>
            <div className="text-sm opacity-90">Current Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{loyaltyRewards.nextReward - loyaltyRewards.currentPoints}</div>
            <div className="text-sm opacity-90">Points to Next Reward</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">${loyaltyRewards.totalSpent}</div>
            <div className="text-sm opacity-90">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loyaltyRewards.availableRewards.map((reward, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                reward.available
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                <span className="text-sm text-gray-600">{reward.points} pts</span>
              </div>
              <button
                disabled={!reward.available}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  reward.available
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {reward.available ? 'Redeem' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={user?.phone || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birthday
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-mentha-500 focus:border-mentha-500"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-mentha-600 text-white px-6 py-3 rounded-lg hover:bg-mentha-700 transition-colors">
            Update Profile
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Appointment Reminders</h4>
              <p className="text-sm text-gray-600">Receive reminders 24 hours before appointments</p>
            </div>
            <button className="bg-mentha-600 rounded-full w-12 h-6 relative">
              <div className="bg-white rounded-full w-5 h-5 absolute top-0.5 right-0.5 transition-transform"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Promotional Offers</h4>
              <p className="text-sm text-gray-600">Get notified about special deals and new services</p>
            </div>
            <button className="bg-gray-300 rounded-full w-12 h-6 relative">
              <div className="bg-white rounded-full w-5 h-5 absolute top-0.5 left-0.5 transition-transform"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your appointments and track your beauty journey</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-mentha-100 text-mentha-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'appointments' && <AppointmentsTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'loyalty' && <LoyaltyTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;