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
  Zap,
  Eye,
  Tag
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';

// Timeline Component - Olive Branch Justice Theme
// Features: Chronological events, evidence cards, download functionality, dynamic categories, custom colors per event

interface TimelineEvent {
  id: number;
  date: string;
  time?: string;
  title: string;
  description: string;
  category: string;
  customColor?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  tags?: string[];
}

interface Evidence {
  id: number;
  title: string;
  description?: string;
  category: string;
  fileUrl?: string;
  thumbnailUrl?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

// Default category styles (fallback if no dynamic categories)
const defaultCategoryStyles: Record<string, { label: string; color: string; bg: string; text: string; light: string }> = {
  foundation: { label: 'Foundation', color: '#5d6d4e', bg: '#f5f2eb', text: '#3d3d3d', light: '#5d6d4e1a' },
  investment_deal: { label: 'Investment Deal', color: '#c4a35a', bg: '#faf8f3', text: '#3d3d3d', light: '#c4a35a1a' },
  swift_operations: { label: 'SWIFT Operations', color: '#3b82f6', bg: '#eff6ff', text: '#1e3a5f', light: '#3b82f61a' },
  critical_failure: { label: 'Critical Failure', color: '#722f37', bg: '#fef2f2', text: '#450a0a', light: '#722f371a' },
  legal_proceedings: { label: 'Legal Proceedings', color: '#9333ea', bg: '#faf5ff', text: '#3b0764', light: '#9333ea1a' },
};

const evidenceIcons: Record<string, typeof Mail> = {
  email: Mail,
  emails: Mail,
  document: FileText,
  documents: FileText,
  whatsapp: MessageSquare,
  swift: Zap,
  letter: FileText,
  letters: FileText,
  license: FileText,
  licenses: FileText,
};

function EvidenceCard({ evidence, onView }: { evidence: Evidence; onView: () => void }) {
  const Icon = evidenceIcons[evidence.category?.toLowerCase()] || FileText;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg border border-[#c4a35a]/30 p-4 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        {evidence.thumbnailUrl ? (
          <img 
            src={evidence.thumbnailUrl} 
            alt="" 
            className="w-12 h-12 object-cover rounded-lg border border-[#c4a35a]/20"
          />
        ) : (
          <div className="p-2 rounded-lg bg-[#5d6d4e]/10">
            <Icon className="w-5 h-5 text-[#5d6d4e]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#3d3d3d] truncate">
            {evidence.title}
          </h4>
          <p className="text-xs text-[#3d3d3d]/60 mt-1 line-clamp-2">
            {evidence.description || evidence.category}
          </p>
        </div>
      </div>
      
      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="flex-1 text-xs border-[#5d6d4e]/30 hover:bg-[#5d6d4e]/10"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
        {evidence.fileUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 text-xs border-[#c4a35a]/30 hover:bg-[#c4a35a]/10"
          >
            <a href={evidence.fileUrl} download>
              <Download className="w-3 h-3 mr-1" />
              Download
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function TimelineEventCard({ 
  event, 
  index, 
  categoryStyles,
  onViewEvidence 
}: { 
  event: TimelineEvent; 
  index: number;
  categoryStyles: Record<string, { label: string; color: string; bg: string; text: string; light: string }>;
  onViewEvidence: (evidence: Evidence) => void;
}) {
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  
  // Fetch linked evidence for this event
  const { data: linkedEvidence } = trpc.public.getEventEvidence.useQuery(
    { eventId: event.id },
    { enabled: event.id > 0 }
  );

  // Get base category colors
  const baseColors = categoryStyles[event.category] || defaultCategoryStyles.foundation;
  
  // Override with custom colors if set
  const colors = {
    label: baseColors.label,
    color: event.customColor || baseColors.color,
    bg: event.customBgColor || baseColors.bg,
    text: event.customTextColor || baseColors.text,
    light: event.customColor ? `${event.customColor}1a` : baseColors.light,
  };

  const isLeft = index % 2 === 0;
  const isCritical = event.category === 'critical_failure';
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const hasEvidence = linkedEvidence && linkedEvidence.length > 0;

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
          <div 
            className="rounded-xl p-6 border border-[#c4a35a]/20 relative"
            style={{ 
              backgroundColor: colors.bg,
              borderLeftWidth: event.customColor ? '4px' : undefined,
              borderLeftColor: event.customColor || undefined,
            }}
          >
            {/* Critical Badge */}
            {isCritical && (
              <div className="absolute -top-3 -right-3 bg-[#722f37] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <AlertTriangle className="w-3 h-3" />
                Critical
              </div>
            )}
            
            {/* Category Badge */}
            <Badge 
              className="mb-3 text-white"
              style={{ backgroundColor: colors.color }}
            >
              {colors.label}
            </Badge>
            
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm mb-3" style={{ color: colors.text, opacity: 0.6 }}>
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
              className="text-lg font-bold mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: colors.text }}
            >
              {event.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, opacity: 0.7 }}>
              {event.description}
            </p>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: colors.light, color: colors.color }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* View Evidence Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEvidenceDialog(true)}
              className="border-[#5d6d4e]/30 text-[#5d6d4e] hover:bg-[#5d6d4e]/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Evidence {hasEvidence && `(${linkedEvidence.length})`}
            </Button>
          </div>
        </motion.div>

        {/* Timeline Node */}
        <div className="hidden md:flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10"
            style={{ backgroundColor: colors.color }}
          >
            {isCritical ? (
              <XCircle className="w-5 h-5 text-white" />
            ) : (
              <CheckCircle className="w-5 h-5 text-white" />
            )}
          </motion.div>
        </div>

        {/* Spacer for alternating layout */}
        <div className="hidden md:block flex-1 md:w-1/2" />
      </div>

      {/* Evidence Dialog */}
      <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-heading)' }}>
              {event.title} - Evidence
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Event Details */}
            <div className="p-4 bg-stone-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2 text-sm text-[#3d3d3d]/60">
                <Calendar className="w-4 h-4" />
                {formatDate(event.date)}
                {event.time && (
                  <>
                    <Clock className="w-4 h-4 ml-2" />
                    {event.time}
                  </>
                )}
              </div>
              <p className="text-[#3d3d3d]/80 text-sm">{event.description}</p>
            </div>

            {/* Linked Evidence */}
            <div>
              <h4 className="font-semibold text-[#3d3d3d] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5d6d4e]" />
                Supporting Evidence
              </h4>
              
              {hasEvidence ? (
                <div className="grid gap-3">
                  {linkedEvidence.map((evidence: any) => (
                    <EvidenceCard
                      key={evidence.id}
                      evidence={evidence}
                      onView={() => {
                        setShowEvidenceDialog(false);
                        onViewEvidence(evidence);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#3d3d3d]/50 bg-stone-50 rounded-lg">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No evidence linked to this event yet</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Timeline({ events }: TimelineProps) {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [viewingEvidence, setViewingEvidence] = useState<Evidence | null>(null);

  // Fetch dynamic categories
  const { data: dynamicCategories } = trpc.public.getTimelineCategories.useQuery();

  // Build category styles from dynamic categories or use defaults
  const categoryStyles = dynamicCategories && dynamicCategories.length > 0
    ? dynamicCategories.reduce((acc, cat) => {
        acc[cat.key] = {
          label: cat.label,
          color: cat.color || '#5d6d4e',
          bg: cat.bgColor || '#f5f2eb',
          text: cat.textColor || '#3d3d3d',
          light: cat.lightColor || `${cat.color || '#5d6d4e'}1a`
        };
        return acc;
      }, {} as Record<string, { label: string; color: string; bg: string; text: string; light: string }>)
    : defaultCategoryStyles;

  if (!events || events.length === 0) {
    return null;
  }

  const years = Array.from(new Set(events.map(e => new Date(e.date).getFullYear()))).sort();
  const categories = Object.keys(categoryStyles);
  
  const filteredEvents = events.filter(event => {
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
          <span className="inline-block px-4 py-1.5 bg-[#5d6d4e]/10 text-[#5d6d4e] rounded-full text-sm font-medium mb-4">
            Chronological Evidence
          </span>
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Case Timeline
          </h2>
          <p className="text-[#3d3d3d]/70 max-w-2xl mx-auto">
            A chronological documentation of events from project inception to deal collapse,
            with all supporting evidence available for view and download.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* Year Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-[#c4a35a]/20">
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
          <div className="flex flex-wrap items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-[#c4a35a]/20">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filterCategory === null
                  ? 'bg-[#5d6d4e] text-white'
                  : 'text-[#3d3d3d] hover:bg-[#5d6d4e]/10'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => {
              const style = categoryStyles[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                  style={filterCategory === cat 
                    ? { backgroundColor: style.color, color: 'white' } 
                    : { color: '#3d3d3d' }
                  }
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8 text-sm text-[#3d3d3d]/60">
          Showing {filteredEvents.length} of {events.length} events
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5d6d4e] via-[#c4a35a] to-[#722f37]" />
          
          {/* Events */}
          <div className="space-y-12">
            {filteredEvents.map((event, index) => (
              <TimelineEventCard 
                key={event.id} 
                event={event} 
                index={index}
                categoryStyles={categoryStyles}
                onViewEvidence={setViewingEvidence}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-[#c4a35a]/50 mb-4" />
            <p className="text-[#3d3d3d]/60">No events found for the selected filters.</p>
            <Button
              variant="outline"
              onClick={() => { setFilterYear(null); setFilterCategory(null); }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Evidence Viewer Dialog */}
      <Dialog open={!!viewingEvidence} onOpenChange={() => setViewingEvidence(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingEvidence?.title}</DialogTitle>
          </DialogHeader>
          {viewingEvidence && (
            <div className="space-y-4">
              {viewingEvidence.thumbnailUrl && (
                <img 
                  src={viewingEvidence.thumbnailUrl} 
                  alt={viewingEvidence.title}
                  className="w-full rounded-lg border border-[#c4a35a]/30"
                />
              )}
              {viewingEvidence.description && (
                <p className="text-[#3d3d3d]/70">{viewingEvidence.description}</p>
              )}
              {viewingEvidence.fileUrl && (
                <div className="flex gap-2">
                  <a href={viewingEvidence.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Size
                    </Button>
                  </a>
                  <a href={viewingEvidence.fileUrl} download>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
