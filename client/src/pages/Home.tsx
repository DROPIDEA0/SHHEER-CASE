import { trpc } from '@/lib/trpc';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import OverviewSection from '@/components/OverviewSection';
import Timeline from '@/components/Timeline';
import EvidenceGallery from '@/components/EvidenceGallery';
import VideoSection from '@/components/VideoSection';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  // Fetch all public data
  const { data: headerData, isLoading: headerLoading } = trpc.public.getHeaderContent.useQuery();
  const { data: heroData, isLoading: heroLoading } = trpc.public.getHeroSection.useQuery();
  const { data: partiesData, isLoading: partiesLoading } = trpc.public.getOverviewParties.useQuery();
  const { data: timelineData, isLoading: timelineLoading } = trpc.public.getTimelineEvents.useQuery();
  const { data: evidenceData, isLoading: evidenceLoading } = trpc.public.getEvidenceItems.useQuery();
  const { data: videosData, isLoading: videosLoading } = trpc.public.getVideos.useQuery();
  const { data: footerData, isLoading: footerLoading } = trpc.public.getFooterContent.useQuery();

  const isLoading = headerLoading || heroLoading || partiesLoading || timelineLoading || evidenceLoading || videosLoading || footerLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="h-16 bg-white border-b" />
        <div className="container py-20">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Transform data for components
  const transformedHeader = headerData ? {
    logoUrl: headerData.logoUrl || '/images/logo.png',
    siteName: headerData.siteName || 'SHHEER Case',
    siteSubtitle: headerData.siteSubtitle || 'Bank Guarantee Dispute',
    navItems: (headerData.navItems as Array<{label: string; href: string}>) || [],
  } : null;

  const transformedHero = heroData ? {
    title: heroData.title || 'Bank Guarantee',
    titleHighlight: heroData.titleHighlight || 'Dispute Case',
    subtitle: heroData.subtitle || 'SHHEER Project',
    description: heroData.description || '',
    guaranteeRef: heroData.guaranteeRef || '',
    dealValue: heroData.dealValue || '',
    criticalPeriod: heroData.criticalPeriod || '',
    ctaText: heroData.ctaText || 'View Timeline',
    ctaLink: heroData.ctaLink || '#timeline',
  } : null;

  const transformedParties = partiesData ? {
    plaintiff: partiesData.filter(p => p.partyType === 'plaintiff').map(p => ({
      name: p.name,
      label: p.label || '',
      representative: p.representative || '',
      role: p.role || '',
    })),
    defendant: partiesData.filter(p => p.partyType === 'defendant').map(p => ({
      name: p.name,
      label: p.label || '',
      representative: p.representative || '',
      role: p.role || '',
    })),
    thirdParties: partiesData.filter(p => p.partyType === 'third_party').map(p => ({
      name: p.name,
      label: p.label || '',
      role: p.role || '',
    })),
  } : null;

  const transformedTimeline = timelineData?.map(event => ({
    id: event.id,
    date: event.date,
    time: event.time || undefined,
    title: event.title,
    description: event.description || '',
    category: event.category,
    tags: (event as any).tags ? (typeof (event as any).tags === 'string' ? JSON.parse((event as any).tags) : (event as any).tags) : [],
  })) || [];

  const transformedEvidence = evidenceData?.map(item => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description || '',
    category: item.category,
    fileUrl: item.fileUrl || '',
    thumbnailUrl: item.thumbnailUrl || item.fileUrl || '',
    fileName: item.fileName || '',
  })) || [];

  const transformedVideos = videosData?.map(video => ({
    id: video.id.toString(),
    title: video.title,
    description: video.description || '',
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl || '',
    duration: video.duration || '',
  })) || [];

  const transformedFooter = footerData ? {
    companyName: footerData.companyName || 'Nesma Barzan',
    companySubtitle: footerData.companySubtitle || 'نسمة برزان',
    aboutText: footerData.aboutText || '',
    quickLinks: (footerData.quickLinks as Array<{label: string; href: string}>) || [],
    contactAddress: footerData.contactAddress || '',
    contactPhone: footerData.contactPhone || '',
    contactWebsite: footerData.contactWebsite || '',
    legalDisclaimer: footerData.legalDisclaimer || '',
    commercialReg: footerData.commercialReg || '',
  } : null;

  return (
    <div className="min-h-screen bg-stone-50">
      {transformedHeader && (
        <Header 
          logoUrl={transformedHeader.logoUrl}
          siteName={transformedHeader.siteName}
          siteSubtitle={transformedHeader.siteSubtitle}
          navItems={transformedHeader.navItems}
        />
      )}
      
      {transformedHero && (
        <HeroSection 
          title={transformedHero.title}
          titleHighlight={transformedHero.titleHighlight}
          subtitle={transformedHero.subtitle}
          description={transformedHero.description}
          guaranteeRef={transformedHero.guaranteeRef}
          dealValue={transformedHero.dealValue}
          criticalPeriod={transformedHero.criticalPeriod}
          ctaText={transformedHero.ctaText}
          ctaLink={transformedHero.ctaLink}
        />
      )}
      
      {transformedParties && (
        <OverviewSection 
          plaintiff={transformedParties.plaintiff}
          defendant={transformedParties.defendant}
          thirdParties={transformedParties.thirdParties}
        />
      )}
      
      <Timeline events={transformedTimeline} />
      
      <EvidenceGallery evidence={transformedEvidence} />
      
      <VideoSection videos={transformedVideos} />
      
      {transformedFooter && (
        <Footer 
          companyName={transformedFooter.companyName}
          companySubtitle={transformedFooter.companySubtitle}
          aboutText={transformedFooter.aboutText}
          quickLinks={transformedFooter.quickLinks}
          contactAddress={transformedFooter.contactAddress}
          contactPhone={transformedFooter.contactPhone}
          contactWebsite={transformedFooter.contactWebsite}
          legalDisclaimer={transformedFooter.legalDisclaimer}
          commercialReg={transformedFooter.commercialReg}
        />
      )}
    </div>
  );
}
