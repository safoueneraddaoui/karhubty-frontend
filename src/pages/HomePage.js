import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Shield, Clock, Star, Search, Calendar, Users, Settings2, Fuel, TrendingUp, Download, Briefcase, Users2 } from 'lucide-react';
import Partners from '../components/Partners';
import carService from '../services/carService';

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.8s ease-out forwards;
  }

  .animate-slideInRight {
    animation: slideInRight 0.8s ease-out forwards;
  }

  .animation-delay-100 { animation-delay: 100ms; }
  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-500 { animation-delay: 500ms; }
  .animation-delay-600 { animation-delay: 600ms; }
  .animation-delay-700 { animation-delay: 700ms; }
  .animation-delay-800 { animation-delay: 800ms; }
`;


const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    rentals: 0,
    customers: 0,
    cars: 0
  });

  useEffect(() => {
    animateStats();
  }, []);

  const animateStats = () => {
    const targets = { rentals: 2500, customers: 1200, cars: 450 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      
      setStats({
        rentals: Math.floor(targets.rentals * progress),
        customers: Math.floor(targets.customers * progress),
        cars: Math.floor(targets.cars * progress)
      });

      if (progress < 1) {
        setTimeout(animate, stepDuration);
      }
    };

    animate();
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style>{styles}</style>
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 animate-fadeIn">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center py-20 relative">
            {/* Left Side - Text */}
            <div className="text-white animate-slideInLeft">
              <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-fadeInUp animation-delay-100">
                <p className="text-sm font-semibold text-white">✨ Premium Car Rental Platform</p>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight animate-fadeInUp animation-delay-200">
                Drive Your Dreams Today
              </h1>
              
              <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-xl animate-fadeInUp animation-delay-300">
                Experience premium car rentals with unbeatable prices, instant booking, and world-class service. Your perfect journey starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fadeInUp animation-delay-400">
                <button 
                  onClick={() => navigate('/cars')}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-lg inline-flex items-center justify-center gap-2"
                >
                  Explore Cars
                  <span>→</span>
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-500"
                >
                  Get Started Free
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp">
              Why Drive With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-100">
              Everything you need for the perfect rental experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureItem 
              icon={<Fuel className="w-8 h-8" />}
              title="Best Prices"
              description="Competitive rates with transparent pricing"
              color="from-blue-500 to-blue-600"
              delay="100"
            />
            <FeatureItem 
              icon={<Shield className="w-8 h-8" />}
              title="Fully Insured"
              description="Complete coverage for peace of mind"
              color="from-cyan-500 to-cyan-600"
              delay="200"
            />
            <FeatureItem 
              icon={<Clock className="w-8 h-8" />}
              title="24/7 Support"
              description="Always here when you need us"
              color="from-blue-600 to-blue-700"
              delay="300"
            />
            <FeatureItem 
              icon={<Star className="w-8 h-8" />}
              title="Premium Fleet"
              description="Luxury vehicles in pristine condition"
              color="from-cyan-600 to-cyan-700"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* Stats Section with Modern Design */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ModernStatCard 
              number={stats.cars}
              label="Premium Cars"
              icon={<Car className="w-12 h-12" />}
              gradient="from-blue-500 to-cyan-500"
              delay="100"
            />
            <ModernStatCard 
              number={stats.customers}
              label="Happy Customers"
              icon={<Users className="w-12 h-12" />}
              gradient="from-cyan-500 to-blue-600"
              delay="200"
            />
            <ModernStatCard 
              number={stats.rentals}
              label="Active Rentals"
              icon={<TrendingUp className="w-12 h-12" />}
              gradient="from-blue-600 to-blue-700"
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 animate-fadeInUp animation-delay-100">
              Simple steps for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* User Flow */}
            <div className="animate-slideInLeft">
              <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">For Renters</h3>
              <div className="space-y-8">
                <IconCard 
                  number="1"
                  icon={<Search className="w-12 h-12" />}
                  title="Search"
                  description="Browse our collection of premium vehicles tailored to your needs"
                  color="blue"
                  delay="200"
                />
                <IconCard 
                  number="2"
                  icon={<Calendar className="w-12 h-12" />}
                  title="Book"
                  description="Choose your dates and complete booking in just 2 minutes"
                  color="cyan"
                  delay="300"
                />
                <IconCard 
                  number="3"
                  icon={<Car className="w-12 h-12" />}
                  title="Drive"
                  description="Pick up and hit the road with complete peace of mind"
                  color="blue"
                  delay="400"
                />
              </div>
            </div>

            {/* Agent Flow */}
            <div className="animate-slideInRight">
              <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">For Agents</h3>
              <div className="space-y-8">
                <IconCard 
                  number="1"
                  icon={<Car className="w-12 h-12" />}
                  title="List Your Car"
                  description="Add your vehicle with photos and details in minutes"
                  color="blue"
                  delay="200"
                />
                <IconCard 
                  number="2"
                  icon={<Calendar className="w-12 h-12" />}
                  title="Set Availability"
                  description="Choose your rental dates and pricing for maximum earnings"
                  color="cyan"
                  delay="300"
                />
                <IconCard 
                  number="3"
                  icon={<TrendingUp className="w-12 h-12" />}
                  title="Earn Money"
                  description="Get paid automatically after each successful rental"
                  color="blue"
                  delay="400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fadeInUp animation-delay-100">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
            Join thousands of satisfied customers and experience the difference premium car rental makes
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-lg inline-flex items-center gap-2 animate-fadeInUp animation-delay-300"
          >
            Start Your Free Trial
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />
    </div>
  );
};

const FeatureItem = ({ icon, title, description, color, delay }) => {
  return (
    <div className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp animation-delay-${delay}`}>
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color} text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const ModernStatCard = ({ number, label, icon, gradient, delay }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fadeInUp animation-delay-${delay}`}>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-white/80 mb-2">{label}</p>
            <p className="text-6xl font-bold">{number}</p>
          </div>
          <div className="opacity-30">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineCard = ({ number, icon, title, description, image, color }) => {
  const colorClass = color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-cyan-500 to-cyan-600';
  const numberBg = color === 'blue' ? 'bg-blue-500' : 'bg-cyan-500';
  
  return (
    <div className="group relative">
      {/* Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-200">
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Number Badge */}
        <div className={`absolute -top-6 left-8 w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} text-white flex items-center justify-center font-bold text-2xl shadow-lg`}>
          {number}
        </div>

        {/* Content */}
        <div className="p-8 pt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} text-white flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const IconCard = ({ number, icon, title, description, color, delay }) => {
  const colorClass = color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-cyan-500 to-cyan-600';
  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-cyan-50';
  
  return (
    <div className={`group animate-fadeInUp animation-delay-${delay}`}>
      <div className="flex gap-6 items-start">
        {/* Number Badge */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          {number}
        </div>

        {/* Content */}
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl ${bgColor} text-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const FleetCard = ({ title, description, image, accent }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl">
      {/* Background Image */}
      <img 
        src={image}
        alt={title}
        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className={`inline-block w-1 h-12 bg-gradient-to-b ${accent} mb-4 group-hover:h-16 transition-all duration-300`}></div>
        <h3 className="text-4xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 mb-6">{description}</p>
        <button className="w-fit px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300">
          Browse {title} →
        </button>
      </div>
    </div>
  );
};

const CategoryCard = ({ icon, title, description, color }) => {
  return (
    <div className={`${color} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const CTACard = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button 
        onClick={onClick}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        {buttonText}
      </button>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, image, gradient }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="p-8 relative">
        <div className="flex justify-center mb-4 -mt-16 relative z-10">
          <div className="bg-white p-3 rounded-full shadow-lg">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center mt-2">{title}</h3>
        <p className="text-gray-600 text-center leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const StepCard = ({ number, icon, title, description, image, color }) => {
  const colorClass = color === 'blue' ? 'bg-blue-500' : 'bg-cyan-500';
  const hoverColor = color === 'blue' ? 'group-hover:bg-blue-600' : 'group-hover:bg-cyan-600';
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="p-8 relative">
        <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${colorClass} ${hoverColor} transition-colors text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {number}
        </div>
        <div className="flex justify-center mb-4 mt-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
        <p className="text-gray-600 text-center leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const StatCard = ({ number, suffix, label, icon, color }) => {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-5xl md:text-6xl font-bold mb-2">{number}{suffix}</p>
          <p className="text-lg text-blue-100 font-semibold">{label}</p>
        </div>
        <div className="opacity-20">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default HomePage;