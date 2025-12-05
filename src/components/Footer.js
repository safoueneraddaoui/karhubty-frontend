import React from 'react';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-1 mb-4">
                <img src="/karhubty-logo-white.png" alt="Karhubty logo" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for car rentals. Find the perfect vehicle for your journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">Home</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">Browse Cars</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>info@carrental.com</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-sky-400 mt-1" />
                <span>123 Main Street, Le Mans, France</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-sky-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-sky-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-sky-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-sky-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Karhubty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;