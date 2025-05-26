import React from 'react';
import { Linkedin, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Links */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                  Legal
                </h3>
                <div className="flex flex-col space-y-3">
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  <a
                      href="https://www.linkedin.com/company/hapo-technology/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#0077B5] transition-colors"
                      aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
                      aria-label="Twitter"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-[#4267B2] transition-colors"
                      aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Copyright */}
              <div className="flex flex-col items-center md:items-center">
                <p className="text-gray-500 text-sm">
                  © 2025 Hapo Cloud Technologies.
                </p>
                <p className="text-gray-500 text-sm">All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};