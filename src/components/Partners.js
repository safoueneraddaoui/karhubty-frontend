import React from 'react';

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

  .animate-fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }

  .animation-delay-100 { animation-delay: 100ms; }
  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-500 { animation-delay: 500ms; }
  .animation-delay-600 { animation-delay: 600ms; }
`;

const Partners = () => {
  // Sample partners data - easily editable
  const partners = [
    {
      id: 1,
      name: 'Partner 1',
      logo: '/karhubty-logo-blue.png',
    },
    {
      id: 2,
      name: 'Partner 2',
      logo: '/karhubty-logo-blue.png',
    },
    {
      id: 3,
      name: 'Partner 3',
      logo: '/karhubty-logo-blue.png',
    },
    {
      id: 4,
      name: 'Partner 4',
      logo: '/karhubty-logo-blue.png',
    },
    {
      id: 5,
      name: 'Partner 5',
      logo: '/karhubty-logo-blue.png',
    },
    {
      id: 6,
      name: 'Partner 6',
      logo: '/karhubty-logo-blue.png',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 animate-fadeInUp">
          Our Partners
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12 animate-fadeInUp animation-delay-100">
          We are proud to work with industry-leading companies
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-500 flex items-center justify-center transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp animation-delay-${(index % 6) * 100 + 200}`}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-24 object-contain hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
