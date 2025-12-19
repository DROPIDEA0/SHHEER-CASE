import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

// Footer Component - Olive Branch Justice Theme
// Features: Contact info, legal disclaimer, branding

export default function Footer() {
  return (
    <footer className="bg-[#3d3d3d] text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/images/logo.png"
                alt="Nesma Barzan"
                className="h-16 w-auto bg-white rounded-lg p-2"
              />
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Nesma Barzan
                </h3>
                <p className="text-white/60 text-sm">Commercial Establishment</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              This website documents the legal case regarding the bank guarantee dispute 
              for the SHHEER mobile advertising project. All information presented is 
              based on official documents and evidence submitted to the Banking Disputes 
              Committee in Riyadh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-lg font-semibold mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Quick Links
            </h4>
            <nav className="space-y-3">
              <a href="#overview" className="block text-white/70 hover:text-[#c4a35a] transition-colors text-sm">
                Case Overview
              </a>
              <a href="#timeline" className="block text-white/70 hover:text-[#c4a35a] transition-colors text-sm">
                Timeline
              </a>
              <a href="#evidence" className="block text-white/70 hover:text-[#c4a35a] transition-colors text-sm">
                Evidence Archive
              </a>
              <a href="#videos" className="block text-white/70 hover:text-[#c4a35a] transition-colors text-sm">
                Video Documentation
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 
              className="text-lg font-semibold mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Contact Information
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c4a35a] mt-0.5" />
                <div className="text-sm text-white/70">
                  <p>Kingdom of Saudi Arabia</p>
                  <p>P.O. Box 21312</p>
                  <p>Postal Code: 118840</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#c4a35a]" />
                <a href="tel:+96614627990" className="text-sm text-white/70 hover:text-[#c4a35a] transition-colors">
                  +966 1 462 7990
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#c4a35a]" />
                <a href="https://www.barzan.com.sa" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#c4a35a] transition-colors">
                  www.barzan.com.sa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="bg-[#722f37]/20 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-[#c4a35a] mb-2">Legal Disclaimer</h5>
            <p className="text-xs text-white/60 leading-relaxed">
              This website is created for legal documentation purposes. All evidence, 
              communications, and documents presented herein are authentic and have been 
              submitted as part of official legal proceedings before the Banking Disputes 
              Committee in Riyadh, Kingdom of Saudi Arabia. The information is presented 
              in good faith and is intended to provide a comprehensive record of the 
              dispute between Nesma Barzan Commercial Establishment and Al Rajhi Bank.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              © {new Date().getFullYear()} Nesma Barzan Commercial Establishment. All rights reserved.
            </p>
            <p>
              Commercial Registration: 2350074840
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
