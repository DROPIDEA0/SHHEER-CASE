import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { 
  Download, 
  Eye, 
  Filter,
  FileText,
  Scale,
  BookOpen,
  FileCheck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Official Documents - Similar to Evidence Archive
// Features: Filterable gallery, preview, download

const documentTypeLabels: Record<string, { label: string; icon: any; color: string }> = {
  'court-decision': { label: 'Court Decisions', icon: Scale, color: 'bg-[#722f37]' },
  'legal-study': { label: 'Legal Studies', icon: BookOpen, color: 'bg-[#5d6d4e]' },
  'profile': { label: 'Profiles', icon: FileCheck, color: 'bg-[#c4a35a]' },
  'other': { label: 'Other Documents', icon: FileText, color: 'bg-gray-500' },
  // Fallback for any other category
};

const getDocumentTypeInfo = (category: string | null) => {
  if (!category) return { label: 'Unknown', icon: FileText, color: 'bg-gray-400' };
  return documentTypeLabels[category.toLowerCase()] || { 
    label: category, 
    icon: FileText, 
    color: 'bg-[#5d6d4e]' 
  };
};

export default function OfficialDocuments() {
  const { data: documents, isLoading } = trpc.public.getOfficialDocuments.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section id="official-documents" className="py-20 bg-gradient-to-b from-[#fdfcfa] to-[#f5f2eb]">
        <div className="container flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#5d6d4e]" />
        </div>
      </section>
    );
  }

  const filteredDocuments = selectedCategory
    ? (documents || []).filter(doc => doc.category === selectedCategory)
    : (documents || []);

  const categories = documents ? Array.from(new Set(documents.map(doc => doc.category))) : [];

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toUpperCase();
    return ext || 'FILE';
  };

  const formatFileSize = (sizeStr: string | null) => {
    if (!sizeStr) return 'Unknown';
    return sizeStr;
  };

  return (
    <section id="official-documents" className="py-20 bg-gradient-to-b from-[#fdfcfa] to-[#f5f2eb]">
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
            Official Documents
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#c4a35a] to-transparent mx-auto mb-6" />
          <p className="text-[#3d3d3d]/70 max-w-2xl mx-auto">
            Official documents and files related to the case - profiles, court decisions, legal studies
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
            <span className="text-2xl font-bold text-[#5d6d4e]">{documents.length}</span>
            <span className="text-sm text-[#3d3d3d]/60 ml-2">Total Documents</span>
          </div>
          {categories.map(category => {
            const count = documents.filter(doc => doc.category === category).length;
            const typeInfo = getDocumentTypeInfo(category);
            return (
              <div key={category} className="bg-white rounded-lg px-4 py-3 shadow-sm border border-[#c4a35a]/20 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${typeInfo.color}`} />
                <span className="text-sm text-[#3d3d3d]">{count} {typeInfo.label}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? 'bg-[#5d6d4e] hover:bg-[#5d6d4e]/90' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            All Documents
          </Button>
          {categories.map(category => {
            const typeInfo = getDocumentTypeInfo(category);
            const Icon = typeInfo.icon;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-[#5d6d4e] hover:bg-[#5d6d4e]/90' : ''}
              >
                <Icon className="w-4 h-4 mr-2" />
                {typeInfo.label}
              </Button>
            );
          })}
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-[#3d3d3d]/20 mx-auto mb-4" />
            <p className="text-[#3d3d3d]/60 text-lg">No documents available yet</p>
            <p className="text-[#3d3d3d]/40 text-sm mt-2">Documents will appear here once they are uploaded</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDocuments.map((doc) => {
              const typeInfo = getDocumentTypeInfo(doc.category);
              const Icon = typeInfo.icon;
              const fileExt = getFileExtension(doc.fileName || '');
              
              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-xl overflow-hidden border border-[#c4a35a]/20 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Document Preview */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#f5f2eb] to-[#fdfcfa] flex flex-col items-center justify-center p-6">
                    <div className={`w-20 h-20 rounded-2xl ${typeInfo.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-xs font-bold text-[#3d3d3d]/40 bg-white px-3 py-1 rounded-full">
                      {fileExt}
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 left-3 ${typeInfo.color} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md`}>
                    <Icon className="w-3 h-3" />
                    {typeInfo.label}
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                      className="bg-white hover:bg-white/90"
                    >
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                      className="bg-white hover:bg-white/90"
                    >
                      <a href={doc.fileUrl} download={doc.fileName || 'document'}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                  
                  {/* Document Info */}
                  <div className="p-4 border-t border-[#c4a35a]/10">
                    <h4 className="text-sm font-semibold text-[#3d3d3d] line-clamp-2 mb-2">
                      {doc.title}
                    </h4>
                    {doc.description && (
                      <p className="text-xs text-[#3d3d3d]/60 line-clamp-2 mb-3">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-[#3d3d3d]/50">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span className="truncate ml-2 max-w-[120px]">{doc.fileName}</span>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#3d3d3d]/50 mt-12"
        >
          All displayed documents are official documents submitted to the relevant authorities
        </motion.p>
      </div>
    </section>
  );
}
