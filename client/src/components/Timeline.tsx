import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  ZoomIn,
  FileText,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';
import { timelineEvents, whatsappEvidence, type TimelineEvent, type Evidence } from '@/data/caseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Timeline Component - Olive Branch Justice Theme
// Features: Chronological events, evidence cards, download functionality

const categoryColors = {
  foundation: { bg: 'bg-[#5d6d4e]', text: 'text-[#5d6d4e]', light: 'bg-[#5d6d4e]/10' },
  deal: { bg: 'bg-[#c4a35a]', text: 'text-[#c4a35a]', light: 'bg-[#c4a35a]/10' },
  swift: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
  failure: { bg: 'bg-[#722f37]', text: 'text-[#722f37]', light: 'bg-[#722f37]/10' },
  legal: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
};

const categoryLabels = {
  foundation: 'Foundation',
  deal: 'Investment Deal',
  swift: 'SWIFT Operations',
  failure: 'Critical Failure',
  legal: 'Legal Proceedings',
};

const evidenceIcons = {
  email: Mail,
  document: FileText,
  whatsapp: MessageSquare,
  swift: Zap,
  letter: FileText,
  license: FileText,
};

function EvidenceCard({ evidence, onView }: { evidence: Evidence; onView: () => void }) {
  const Icon = evidenceIcons[evidence.type] || FileText;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg border border-[#c4a35a]/30 p-4 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#5d6d4e]/10">
          <Icon className="w-5 h-5 text-[#5d6d4e]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#3d3d3d] truncate">
            {evidence.title}
          </h4>
          <p className="text-xs text-[#3d3d3d]/60 mt-1 line-clamp-2">
            {evidence.description}
          </p>
        </div>
      </div>
      
      {evidence.imagePath && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1 text-xs border-[#5d6d4e]/30 hover:bg-[#5d6d4e]/10"
          >
            <ZoomIn className="w-3 h-3 mr-1" />
            View
          </Button>
          {evidence.downloadable && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 text-xs border-[#c4a35a]/30 hover:bg-[#c4a35a]/10"
            >
              <a href={evidence.imagePath} download>
                <Download className="w-3 h-3 mr-1" />
                Download
              </a>
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function TimelineEventCard({ event, index }: { event: TimelineEvent; index: number }) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const colors = categoryColors[event.category];
  const isLeft = index % 2 === 0;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className={`flex items-start gap-4 md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 md:w-1/2"
        >
          <div className={`${colors.light} rounded-xl p-6 border border-[#c4a35a]/20 relative`}>
            {/* Critical Badge */}
            {event.critical && (
              <div className="absolute -top-3 -right-3 bg-[#722f37] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <AlertTriangle className="w-3 h-3" />
                Critical
              </div>
            )}
            
            {/* Category Label */}
            <div className={`inline-flex items-center gap-2 ${colors.text} text-xs font-medium mb-3`}>
              <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
              {categoryLabels[event.category]}
            </div>
            
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm text-[#3d3d3d]/60 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(event.date)}
              </span>
              {event.time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 
              className="text-xl font-bold text-[#3d3d3d] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {event.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-[#3d3d3d]/80 leading-relaxed mb-4">
              {event.description}
            </p>
            
            {/* Evidence */}
            {event.evidence.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#5d6d4e] uppercase tracking-wider">
                  Evidence ({event.evidence.length})
                </h4>
                <div className="grid gap-3">
                  {event.evidence.map((ev) => (
                    <EvidenceCard
                      key={ev.id}
                      evidence={ev}
                      onView={() => setSelectedEvidence(ev)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Timeline Node */}
        <div className="hidden md:flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className={`w-6 h-6 rounded-full ${colors.bg} shadow-lg flex items-center justify-center`}
          >
            {event.critical ? (
              <XCircle className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle className="w-4 h-4 text-white" />
            )}
          </motion.div>
        </div>

        {/* Spacer for alternating layout */}
        <div className="hidden md:block flex-1 md:w-1/2" />
      </div>

      {/* Evidence Modal */}
      <Dialog open={!!selectedEvidence} onOpenChange={() => setSelectedEvidence(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-heading)' }}>
              {selectedEvidence?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEvidence?.imagePath && (
            <div className="mt-4">
              <img
                src={selectedEvidence.imagePath}
                alt={selectedEvidence.title}
                className="w-full rounded-lg border border-[#c4a35a]/30"
              />
              <p className="text-sm text-[#3d3d3d]/70 mt-4">
                {selectedEvidence.description}
              </p>
              {selectedEvidence.downloadable && (
                <Button
                  asChild
                  className="mt-4 bg-[#5d6d4e] hover:bg-[#5d6d4e]/90"
                >
                  <a href={selectedEvidence.imagePath} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download Evidence
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Timeline() {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const years = Array.from(new Set(timelineEvents.map(e => new Date(e.date).getFullYear()))).sort();
  
  const filteredEvents = timelineEvents.filter(event => {
    if (filterCategory && event.category !== filterCategory) return false;
    if (filterYear && new Date(event.date).getFullYear() !== filterYear) return false;
    return true;
  });

  return (
    <section id="timeline" className="py-20 bg-gradient-to-b from-[#fdfcfa] to-[#f5f2eb]">
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
            Case Timeline
          </h2>
          <p className="text-[#3d3d3d]/70 max-w-2xl mx-auto">
            A chronological documentation of events from project inception to deal collapse,
            with all supporting evidence.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* Year Filter */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-[#c4a35a]/20">
            <button
              onClick={() => setFilterYear(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filterYear === null
                  ? 'bg-[#5d6d4e] text-white'
                  : 'text-[#3d3d3d] hover:bg-[#5d6d4e]/10'
              }`}
            >
              All Years
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setFilterYear(year)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterYear === year
                    ? 'bg-[#5d6d4e] text-white'
                    : 'text-[#3d3d3d] hover:bg-[#5d6d4e]/10'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-[#c4a35a]/20">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filterCategory === null
                  ? 'bg-[#5d6d4e] text-white'
                  : 'text-[#3d3d3d] hover:bg-[#5d6d4e]/10'
              }`}
            >
              All
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterCategory === key
                    ? `${categoryColors[key as keyof typeof categoryColors].bg} text-white`
                    : 'text-[#3d3d3d] hover:bg-[#5d6d4e]/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5d6d4e] via-[#c4a35a] to-[#5d6d4e] transform -translate-x-1/2" />

          {/* Events */}
          <div className="space-y-12">
            {filteredEvents.map((event, index) => (
              <TimelineEventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* WhatsApp Evidence Section */}
        {(!filterCategory || filterCategory === 'failure') && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 
              className="text-2xl font-bold text-[#3d3d3d] mb-6 text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              WhatsApp Communications
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whatsappEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="bg-white rounded-xl p-6 border border-[#c4a35a]/30 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-100">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-[#3d3d3d]">{evidence.title}</h4>
                  </div>
                  <p className="text-sm text-[#3d3d3d]/70 mb-4">{evidence.description}</p>
                  {evidence.imagePath && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 border-[#5d6d4e]/30"
                      >
                        <a href={evidence.imagePath} target="_blank" rel="noopener noreferrer">
                          <ZoomIn className="w-4 h-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 border-[#c4a35a]/30"
                      >
                        <a href={evidence.imagePath} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
