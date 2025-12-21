import { Phone, Globe, MapPin } from 'lucide-react';

// Footer Component - Olive Branch Justice Theme
// Features: Contact info, legal disclaimer, branding

interface QuickLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName: string;
  companySubtitle: string;
  aboutText: string;
  quickLinks: QuickLink[];
  contactAddress: string;
  contactPhone: string;
  contactWebsite: string;
  legalDisclaimer: string;
  commercialReg: string;
}

export default function Footer({
  companyName,
  companySubtitle,
  aboutText,
  quickLinks,
  contactAddress,
  contactPhone,
  contactWebsite,
  legalDisclaimer,
  commercialReg,
}: FooterProps) {
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
                alt={companyName || 'Nesma Barzan'}
                className="h-16 w-auto bg-white rounded-lg p-2"
              />
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {companyName || 'Nesma Barzan'}
                </h3>
                <p className="text-white/60 text-sm">{companySubtitle || 'Commercial Establishment'}</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              {aboutText || 'This website documents the legal case regarding the bank guarantee dispute for the SHHEER mobile advertising project. All information presented is based on official documents and evidence submitted to the Banking Disputes Committee in Riyadh.'}
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
              {quickLinks && quickLinks.length > 0 ? (
                quickLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className="block text-white/70 hover:text-[#c4a35a] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                <>
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
                </>
              )}
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
                <div className="text-sm text-white/70 whitespace-pre-line">
                  {contactAddress || 'Kingdom of Saudi Arabia\nP.O. Box 21312\nPostal Code: 118840'}
                </div>
              </div>
              {contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#c4a35a]" />
                  <a href={`tel:${contactPhone}`} className="text-sm text-white/70 hover:text-[#c4a35a] transition-colors">
                    {contactPhone}
                  </a>
                </div>
              )}
              {contactWebsite && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#c4a35a]" />
                  <a href={contactWebsite.startsWith('http') ? contactWebsite : `https://${contactWebsite}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#c4a35a] transition-colors">
                    {contactWebsite.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
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
              {legalDisclaimer || 'This website is created for legal documentation purposes. All evidence, communications, and documents presented herein are authentic and have been submitted as part of official legal proceedings before the Banking Disputes Committee in Riyadh, Kingdom of Saudi Arabia. The information is presented in good faith and is intended to provide a comprehensive record of the dispute between Nesma Barzan Commercial Establishment and Al Rajhi Bank.'}
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              © {new Date().getFullYear()} {companyName || 'Nesma Barzan Commercial Establishment'}. All rights reserved.
            </p>
            {commercialReg && (
              <p>
                Commercial Registration: {commercialReg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Technical Support Credit */}
      <div className="border-t border-white/10 bg-[#2d2d2d]">
        <div className="container py-3">
          <p className="text-center text-sm text-white/40">
            الدعم التقني والتصميم من قبل شركة{' '}
            <a 
              href="https://dropidea.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#c4a35a] hover:text-[#d4b36a] font-medium transition-colors"
            >
              دروب أيديا
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
