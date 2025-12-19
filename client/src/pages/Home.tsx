import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import OverviewSection from '@/components/OverviewSection';
import Timeline from '@/components/Timeline';
import EvidenceGallery from '@/components/EvidenceGallery';
import VideoSection from '@/components/VideoSection';
import Footer from '@/components/Footer';

/**
 * SHHEER Case Documentation Website
 * Design Theme: Olive Branch Justice - Mediterranean Legal Heritage
 * 
 * This page presents the complete documentation of the bank guarantee dispute case
 * with chronological timeline, evidence archive, and video presentations.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />
      
      {/* Main Content */}
      <main>
        {/* Hero Section - Case Introduction */}
        <HeroSection />
        
        {/* Overview Section - Parties & Case Summary */}
        <OverviewSection />
        
        {/* Timeline Section - Chronological Events */}
        <Timeline />
        
        {/* Evidence Gallery - All Documents */}
        <EvidenceGallery />
        
        {/* Video Section - Case Presentations */}
        <VideoSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
