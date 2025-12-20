import React from 'react';
import { Heart, Target, Users, Trophy } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction and strive to exceed expectations on every rental.'
    },
    {
      icon: Target,
      title: 'Quality & Reliability',
      description: 'Our fleet is meticulously maintained and regularly inspected for safety and comfort.'
    },
    {
      icon: Users,
      title: 'Professional Team',
      description: 'Our experienced staff is dedicated to providing exceptional service and support.'
    },
    {
      icon: Trophy,
      title: 'Innovation',
      description: 'We continuously improve our services with the latest technology and best practices.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '500+', label: 'Quality Vehicles' },
    { number: '10+', label: 'Years in Business' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos de Karhubty</h1>
          <p className="text-xl text-sky-100">Your trusted partner for car rentals</p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Karhubty is a leading car rental company dedicated to providing affordable, reliable, and convenient vehicle rental solutions across the country. With over a decade of experience, we've served thousands of satisfied customers.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our mission is to make car rentals simple, transparent, and accessible to everyone. Whether you need a car for a weekend getaway, business travel, or long-term rental, we have the perfect vehicle for you.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in building long-term relationships with our customers based on trust, quality service, and competitive pricing.
            </p>
          </div>
          <div className="bg-sky-100 rounded-xl overflow-hidden shadow-lg h-96">
            <div className="w-full h-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🚗</div>
                <p className="text-2xl font-bold">Karhubty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <p className="text-sky-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="bg-sky-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-600 text-lg mb-8">Feel free to contact us anytime. Our team is here to help!</p>
          <a href="/contact" className="inline-block bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
