import { motion } from 'framer-motion';
import { ChevronDown, FileWarning, Calendar, DollarSign } from 'lucide-react';

// Hero Section - Olive Branch Justice Theme
// Features: Logo prominence, case summary, key statistics

interface HeroSectionProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  secondaryDescription: string;
  guaranteeRef: string;
  dealValue: string;
  criticalPeriod: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSection({
  title,
  titleHighlight,
  subtitle,
  description,
  secondaryDescription,
  guaranteeRef,
  dealValue,
  criticalPeriod,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fdfcfa] via-[#f5f2eb] to-[#fdfcfa]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Olive branch pattern - top left */}
        <svg
          className="absolute -top-20 -left-20 w-96 h-96 text-[#5d6d4e]/5"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 20c-20 0-40 10-50 30-5 10-5 25 5 35 15 15 40 10 55-5 10-10 15-25 10-40-5-15-10-20-20-20zm-30 80c-15 10-25 30-20 50 5 15 20 25 35 25 20 0 35-15 40-35 5-15 0-30-10-40-15-15-30-10-45 0z" />
        </svg>
        
        {/* Olive branch pattern - bottom right */}
        <svg
          className="absolute -bottom-20 -right-20 w-96 h-96 text-[#5d6d4e]/5 rotate-180"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 20c-20 0-40 10-50 30-5 10-5 25 5 35 15 15 40 10 55-5 10-10 15-25 10-40-5-15-10-20-20-20zm-30 80c-15 10-25 30-20 50 5 15 20 25 35 25 20 0 35-15 40-35 5-15 0-30-10-40-15-15-30-10-45 0z" />
        </svg>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#5d6d4e 1px, transparent 1px), linear-gradient(90deg, #5d6d4e 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img
              src="/images/logo.png"
              alt="Nesma Barzan"
              className="h-32 md:h-40 w-auto mx-auto"
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d3d3d] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
              <span className="block text-[#5d6d4e]">{titleHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-[#3d3d3d]/70 mb-2">
              {subtitle}
            </p>
            <p className="text-sm text-[#722f37] font-medium">
              {description}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-32 h-1 bg-gradient-to-r from-transparent via-[#c4a35a] to-transparent mx-auto my-8"
          />

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#c4a35a]/20">
              <FileWarning className="w-8 h-8 text-[#722f37] mx-auto mb-3" />
              <p className="text-sm text-[#3d3d3d]/60 mb-1">Guarantee Reference</p>
              <p className="text-xs font-mono text-[#5d6d4e] break-all">
                {guaranteeRef}
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#c4a35a]/20">
              <DollarSign className="w-8 h-8 text-[#5d6d4e] mx-auto mb-3" />
              <p className="text-sm text-[#3d3d3d]/60 mb-1">Deal Value Lost</p>
              <p className="text-2xl font-bold text-[#722f37]">
                {dealValue}
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#c4a35a]/20">
              <Calendar className="w-8 h-8 text-[#c4a35a] mx-auto mb-3" />
              <p className="text-sm text-[#3d3d3d]/60 mb-1">Critical Period</p>
              <p className="text-lg font-semibold text-[#3d3d3d]">
                {criticalPeriod}
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base md:text-lg text-[#3d3d3d]/80 max-w-2xl mx-auto leading-relaxed"
          >
            {secondaryDescription}
          </motion.p>

          {/* Scroll Indicator */}
          <motion.a
            href={ctaLink || '#overview'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="inline-flex flex-col items-center mt-12 text-[#5d6d4e] hover:text-[#722f37] transition-colors"
          >
            <span className="text-sm mb-2">{ctaText || 'Explore the Case'}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
