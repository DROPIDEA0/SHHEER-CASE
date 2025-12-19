import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, Clock, Video, Scale } from 'lucide-react';

// Header Component - Olive Branch Justice Theme
// Features: Logo, navigation, mobile menu, scroll effects

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  logoUrl: string;
  siteName: string;
  siteSubtitle: string;
  navItems: NavItem[];
}

const defaultNavItems = [
  { label: 'Overview', href: '#overview', icon: FileText },
  { label: 'Timeline', href: '#timeline', icon: Clock },
  { label: 'Evidence', href: '#evidence', icon: Scale },
  { label: 'Videos', href: '#videos', icon: Video },
];

export default function Header({ logoUrl, siteName, siteSubtitle, navItems }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Merge custom nav items with default icons
  const mergedNavItems = navItems && navItems.length > 0 
    ? navItems.map((item, index) => ({
        ...item,
        icon: defaultNavItems[index]?.icon || FileText
      }))
    : defaultNavItems;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.img
              src={logoUrl || '/images/logo.png'}
              alt={siteName || 'Nesma Barzan'}
              className="h-14 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <div className="hidden sm:block">
              <h1 
                className={`text-lg font-semibold transition-colors ${
                  isScrolled ? 'text-[#5d6d4e]' : 'text-[#5d6d4e]'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {siteName || 'SHHEER Case'}
              </h1>
              <p 
                className={`text-xs transition-colors ${
                  isScrolled ? 'text-[#3d3d3d]/70' : 'text-[#3d3d3d]/70'
                }`}
              >
                {siteSubtitle || 'Bank Guarantee Dispute'}
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mergedNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#5d6d4e]/10 ${
                  isScrolled ? 'text-[#3d3d3d]' : 'text-[#3d3d3d]'
                }`}
              >
                <item.icon className="w-4 h-4 text-[#5d6d4e]" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#5d6d4e]/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#5d6d4e]" />
            ) : (
              <Menu className="w-6 h-6 text-[#5d6d4e]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#c4a35a]/20"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {mergedNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#3d3d3d] hover:bg-[#5d6d4e]/10 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-[#5d6d4e]" />
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
