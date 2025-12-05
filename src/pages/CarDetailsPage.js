import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Fuel, Settings2, Calendar, Shield, ArrowLeft, Check } from 'lucide-react';

const CarDetailsPage = ({ user }) => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get(`http://localhost:8080/api/cars/${carId}`);
      
      // Mock data
      const mockCar = {
        carId: parseInt(carId),
        brand: 'Tesla',
        model: 'Model 3',
        year: 2024,
        color: 'Pearl White',
        licensePlate: 'AB-123-CD',
        category: 'Electric',
        pricePerDay: 85,
        guaranteePrice: 500,
        transmission: 'Automatic',
        fuelType: 'Electric',
        seats: 5,
        averageRating: 4.9,
        images: [
          'https://via.placeholder.com/800x500?text=Tesla+Model+3+Front',
          'https://via.placeholder.com/800x500?text=Tesla+Model+3+Interior',
          'https://via.placeholder.com/800x500?text=Tesla+Model+3+Side'
        ],
        features: ['Autopilot', 'Glass Roof', 'Premium Sound', 'Navigation', 'Bluetooth', 'USB Ports'],
        isAvailable: true,
        agentName: 'Premium Rentals',
        reviews: [
          {
            reviewId: 1,
            userName: 'John Doe',
            rating: 5,
            comment: 'Amazing car! Very smooth drive and great features.',
            reviewDate: '2024-01-15'
          },
          {
            reviewId: 2,
            userName: 'Jane Smith',
            rating: 4,
            comment: 'Good experience overall. The car was clean and well-maintained.',
            reviewDate: '2024-01-10'
          }
        ]
      };

      setCar(mockCar);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching car details:', error);
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate || !car) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.post('http://localhost:8080/api/rentals', {
      //   carId: car.carId,
      //   startDate: bookingData.startDate,
      //   endDate: bookingData.endDate
      // });
      
      alert('Booking request submitted successfully! The agent will review and approve your request.');
      setShowBookingModal(false);
      navigate('/dashboard');
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Car not found</p>
          <button onClick={() => navigate('/cars')} className="mt-4 text-sky-600 hover:text-sky-700 font-medium">
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/cars')}
          className="flex items-center text-gray-600 hover:text-sky-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cars
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <img 
                src={car.images[0]} 
                alt={`${car.brand} ${car.model}`}
                className="w-full h-96 object-cover"
              />
              <div className="grid grid-cols-3 gap-2 p-4">
                {car.images.slice(1).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${car.brand} ${car.model} ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{car.brand} {car.model}</h1>
                  <p className="text-gray-600">{car.year} • {car.color} • {car.category}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="text-lg font-semibold">{car.averageRating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2 text-sky-500" />
                  <span>{car.seats} Seats</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Settings2 className="w-5 h-5 mr-2 text-sky-500" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Fuel className="w-5 h-5 mr-2 text-sky-500" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="w-5 h-5 mr-2 text-sky-500" />
                  <span>Insured</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
              <div className="space-y-4">
                {car.reviews.map(review => (
                  <div key={review.reviewId} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{review.userName}</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                    <p className="text-gray-400 text-xs">{new Date(review.reviewDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold text-sky-600">€{car.pricePerDay}</span>
                  <span className="text-gray-600">/day</span>
                </div>
                <p className="text-sm text-gray-600">Guarantee: €{car.guaranteePrice}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              {bookingData.startDate && bookingData.endDate && (
                <div className="bg-sky-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Days</span>
                    <span className="font-semibold">
                      {Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Rental Price</span>
                    <span className="font-semibold">€{calculateTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-sky-600">€{calculateTotalPrice() + car.guaranteePrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Guarantee will be refunded after return</p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!bookingData.startDate || !bookingData.endDate}
                className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {user ? 'Book Now' : 'Login to Book'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Agent: {car.agentName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Booking</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-600"><strong>Car:</strong> {car.brand} {car.model}</p>
              <p className="text-gray-600"><strong>Pick-up:</strong> {bookingData.startDate}</p>
              <p className="text-gray-600"><strong>Drop-off:</strong> {bookingData.endDate}</p>
              <p className="text-gray-600"><strong>Total:</strong> €{calculateTotalPrice() + car.guaranteePrice}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitBooking}
                className="flex-1 bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage;