import React from 'react';
import { Car, Shield, Clock, MapPin, DollarSign, Users, CheckCircle } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      icon: Car,
      title: 'Large Fleet Selection',
      description: 'Choose from hundreds of quality vehicles including sedans, SUVs, and luxury cars for every budget and need.'
    },
    {
      id: 2,
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Get the best rates in the market with transparent pricing. No hidden fees or surprise charges.'
    },
    {
      id: 3,
      icon: Clock,
      title: '24/7 Availability',
      description: 'Book your car anytime, anywhere. Our customer support team is available round the clock to assist you.'
    },
    {
      id: 4,
      icon: Shield,
      title: 'Insurance & Safety',
      description: 'All vehicles are fully insured with comprehensive coverage. Your safety is our top priority.'
    },
    {
      id: 5,
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Pick up and drop off at multiple convenient locations across the country.'
    },
    {
      id: 6,
      icon: Users,
      title: 'Professional Service',
      description: 'Our experienced team ensures a smooth rental experience from booking to return.'
    }
  ];

  const features = [
    { icon: CheckCircle, text: 'Easy Online Booking' },
    { icon: CheckCircle, text: 'Flexible Rental Terms' },
    { icon: CheckCircle, text: 'Free Cancellation' },
    { icon: CheckCircle, text: 'GPS & Insurance Included' },
    { icon: CheckCircle, text: 'Clean & Well-Maintained Cars' },
    { icon: CheckCircle, text: 'Roadside Assistance' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-sky-100">Premium car rental solutions tailored to your needs</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="bg-sky-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Karhubty?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow">
                  <IconComponent className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Rent?</h2>
          <p className="text-xl text-sky-100 mb-8">Browse our available vehicles and book your car today!</p>
          <a href="/cars" className="inline-block bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors">
            Browse Cars
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
