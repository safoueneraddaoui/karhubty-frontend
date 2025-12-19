import React from 'react';

const Partners = () => {
  // Sample partners data - easily editable
  const partners = [
    {
      id: 1,
      name: 'Partner 1',
      logo: '/logo192.png', // Replace with actual partner logo path
    },
    {
      id: 2,
      name: 'Partner 2',
      logo: '/logo192.png',
    },
    {
      id: 3,
      name: 'Partner 3',
      logo: '/logo192.png',
    },
    {
      id: 4,
      name: 'Partner 4',
      logo: '/logo192.png',
    },
    {
      id: 5,
      name: 'Partner 5',
      logo: '/logo192.png',
    },
    {
      id: 6,
      name: 'Partner 6',
      logo: '/logo192.png',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Our Partners
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12">
          We are proud to work with industry-leading companies
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-24 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
