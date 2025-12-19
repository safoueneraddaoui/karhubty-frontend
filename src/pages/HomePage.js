import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Shield, Clock, Star, Search, Calendar } from 'lucide-react';
import Partners from '../components/Partners';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-sky-500 to-sky-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-sky-100">
              Rent premium cars at the best prices. Easy, fast, and reliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/cars')}
                className="bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Browse Cars</span>
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-800 transition-colors border-2 border-white"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Car className="w-12 h-12 text-sky-500" />}
              title="Wide Selection"
              description="Choose from hundreds of premium vehicles to suit your needs and budget."
            />
            <FeatureCard 
              icon={<Shield className="w-12 h-12 text-sky-500" />}
              title="Safe & Secure"
              description="All our cars are regularly maintained and fully insured for your peace of mind."
            />
            <FeatureCard 
              icon={<Clock className="w-12 h-12 text-sky-500" />}
              title="24/7 Support"
              description="Our customer support team is available around the clock to assist you."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-sky-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              icon={<Search className="w-8 h-8" />}
              title="Search"
              description="Browse our collection and find the perfect car for your trip."
            />
            <StepCard 
              number="2"
              icon={<Calendar className="w-8 h-8" />}
              title="Book"
              description="Select your dates and submit a rental request instantly."
            />
            <StepCard 
              number="3"
              icon={<Car className="w-8 h-8" />}
              title="Drive"
              description="Pick up your car and enjoy your journey with confidence."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl mb-8 text-sky-100">
            Join thousands of satisfied customers who trust us for their car rental needs.
          </p>
          <button 
            onClick={() => navigate('/cars')}
            className="bg-white text-sky-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const StepCard = ({ number, icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div className="flex justify-center mb-4 mt-6 text-sky-500">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;