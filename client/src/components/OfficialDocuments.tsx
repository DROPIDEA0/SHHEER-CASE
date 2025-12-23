import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

type OfficialDocument = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string | null;
  fileType: string | null;
  fileSize: string | null;
  category: string | null;
  displayOrder: number;
  isActive: boolean;
};

export default function OfficialDocuments() {
  const { data: documents, isLoading } = trpc.admin.getOfficialDocuments.useQuery();

  // Filter only active documents
  const activeDocuments = documents?.filter(doc => doc.isActive) || [];

  // Group documents by category
  const groupedDocuments = activeDocuments.reduce((acc, doc) => {
    const category = doc.category || 'أخرى';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, OfficialDocument[]>);

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <section id="official-documents" className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-stone-500">جاري التحميل...</div>
          </div>
        </div>
      </section>
    );
  }

  if (activeDocuments.length === 0) {
    return null; // Don't show section if no documents
  }

  return (
    <section id="official-documents" className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            المستندات الرسمية
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            الوثائق والملفات الرسمية المتعلقة بالقضية - بروفايلات، قرارات المحكمة، دراسات قانونية
          </p>
        </motion.div>

        {/* Documents Grid */}
        <div className="space-y-8">
          {Object.entries(groupedDocuments).map(([category, docs], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <Card className="border-stone-200 shadow-lg">
                <CardHeader className="bg-[#5d6d4e]/5">
                  <div className="flex items-center gap-3">
                    <Folder className="h-6 w-6 text-[#5d6d4e]" />
                    <CardTitle className="text-2xl text-stone-900">{category}</CardTitle>
                  </div>
                  <CardDescription>
                    {docs.length} {docs.length === 1 ? 'مستند' : 'مستندات'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docs.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card className="h-full hover:shadow-md transition-shadow border-stone-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-[#5d6d4e]/10 flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-[#5d6d4e]" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-stone-900 mb-1 line-clamp-2">
                                  {doc.title}
                                </h3>
                                {doc.description && (
                                  <p className="text-sm text-stone-600 mb-2 line-clamp-2">
                                    {doc.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mb-3">
                                  {doc.fileSize && (
                                    <Badge variant="outline" className="text-xs">
                                      {doc.fileSize}
                                    </Badge>
                                  )}
                                  {doc.fileType && (
                                    <Badge variant="outline" className="text-xs">
                                      {doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.open(doc.fileUrl, '_blank')}
                                  >
                                    <Eye className="h-3 w-3 ml-1" />
                                    معاينة
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-[#5d6d4e] hover:bg-[#4a5a3e]"
                                    onClick={() => handleDownload(doc.fileUrl, doc.fileName || 'document')}
                                  >
                                    <Download className="h-3 w-3 ml-1" />
                                    تحميل
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-stone-500">
            جميع المستندات المعروضة هي وثائق رسمية مقدمة للجهات المختصة
          </p>
        </motion.div>
      </div>
    </section>
  );
}
