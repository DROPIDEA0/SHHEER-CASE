import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  ZoomIn, 
  X, 
  Filter,
  Mail,
  FileText,
  MessageSquare,
  Zap,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Evidence Gallery - Olive Branch Justice Theme
// Features: Filterable gallery, lightbox view, download all

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  category: 'licenses' | 'letters' | 'swift' | 'documents' | 'emails' | 'whatsapp';
  fileUrl: string;
  thumbnailUrl?: string;
  fileName?: string;
}

interface EvidenceGalleryProps {
  evidence: EvidenceItem[];
}

const evidenceTypeLabels = {
  emails: { label: 'Emails', icon: Mail, color: 'bg-blue-500' },
  documents: { label: 'Documents', icon: FileText, color: 'bg-[#5d6d4e]' },
  whatsapp: { label: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500' },
  swift: { label: 'SWIFT', icon: Zap, color: 'bg-purple-500' },
  letters: { label: 'Letters', icon: ScrollText, color: 'bg-[#c4a35a]' },
  licenses: { label: 'Licenses', icon: Award, color: 'bg-[#722f37]' },
};

export default function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!evidence || evidence.length === 0) {
    return null;
  }
  
  const filteredEvidence = selectedType
    ? evidence.filter(e => e.category === selectedType)
    : evidence;

  const evidenceTypes = Array.from(new Set(evidence.map(e => e.category)));

  const openLightbox = (item: EvidenceItem) => {
    const index = filteredEvidence.findIndex(e => e.id === item.id);
    setCurrentIndex(index);
    setSelectedEvidence(item);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredEvidence.length) % filteredEvidence.length
      : (currentIndex + 1) % filteredEvidence.length;
    setCurrentIndex(newIndex);
    setSelectedEvidence(filteredEvidence[newIndex]);
  };

  return (
    <section id="evidence" className="py-20 bg-gradient-to-b from-[#f5f2eb] to-[#fdfcfa]">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Evidence Archive
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#c4a35a] to-transparent mx-auto mb-6" />
          <p className="text-[#3d3d3d]/70 max-w-2xl mx-auto">
            Complete collection of documented evidence supporting the case.
            All items are downloadable for legal reference.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-[#c4a35a]/20">
            <span className="text-2xl font-bold text-[#5d6d4e]">{evidence.length}</span>
            <span className="text-sm text-[#3d3d3d]/60 ml-2">Total Items</span>
          </div>
          {evidenceTypes.map(type => {
            const count = evidence.filter(e => e.category === type).length;
            const typeInfo = evidenceTypeLabels[type as keyof typeof evidenceTypeLabels];
            return (
              <div key={type} className="bg-white rounded-lg px-4 py-3 shadow-sm border border-[#c4a35a]/20 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${typeInfo?.color || 'bg-gray-400'}`} />
                <span className="text-sm text-[#3d3d3d]">{count} {typeInfo?.label || type}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            onClick={() => setSelectedType(null)}
            className={selectedType === null ? 'bg-[#5d6d4e] hover:bg-[#5d6d4e]/90' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            All Evidence
          </Button>
          {evidenceTypes.map(type => {
            const typeInfo = evidenceTypeLabels[type as keyof typeof evidenceTypeLabels];
            const Icon = typeInfo?.icon || FileText;
            return (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                onClick={() => setSelectedType(type)}
                className={selectedType === type ? 'bg-[#5d6d4e] hover:bg-[#5d6d4e]/90' : ''}
              >
                <Icon className="w-4 h-4 mr-2" />
                {typeInfo?.label || type}
              </Button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvidence.map((item) => {
              const typeInfo = evidenceTypeLabels[item.category as keyof typeof evidenceTypeLabels];
              const Icon = typeInfo?.icon || FileText;
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-xl overflow-hidden border border-[#c4a35a]/20 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Image Preview */}
                  {item.fileUrl ? (
                    <div className="aspect-[4/3] overflow-hidden bg-[#f5f2eb]">
                      <img
                        src={item.thumbnailUrl || item.fileUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-[#f5f2eb] flex items-center justify-center">
                      <Icon className="w-12 h-12 text-[#5d6d4e]/30" />
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 ${typeInfo?.color || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                    <Icon className="w-3 h-3" />
                    {typeInfo?.label || item.category}
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openLightbox(item)}
                      className="bg-white hover:bg-white/90"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    {item.fileUrl && (
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="bg-white hover:bg-white/90"
                      >
                        <a href={item.fileUrl} download>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-[#3d3d3d] line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#3d3d3d]/60 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <Dialog open={!!selectedEvidence} onOpenChange={() => setSelectedEvidence(null)}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvidence(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Navigation */}
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image */}
              {selectedEvidence?.fileUrl && (
                <img
                  src={selectedEvidence.fileUrl}
                  alt={selectedEvidence.title}
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
              
              {/* Info Bar */}
              <div className="bg-black/80 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{selectedEvidence?.title}</h3>
                  <p className="text-white/60 text-sm">{selectedEvidence?.description}</p>
                </div>
                {selectedEvidence?.fileUrl && (
                  <Button asChild className="bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
                    <a href={selectedEvidence.fileUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
              
              {/* Counter */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {currentIndex + 1} / {filteredEvidence.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
