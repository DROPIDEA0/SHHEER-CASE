import { useState, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, FileText, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/admin/AdminLayout';

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
  createdAt: Date;
  updatedAt: Date;
};

export default function OfficialDocumentsAdmin() {
  const { data: documents, isLoading, refetch } = trpc.admin.getOfficialDocuments.useQuery();
  const createMutation = trpc.admin.createOfficialDocument.useMutation();
  const updateMutation = trpc.admin.updateOfficialDocument.useMutation();
  const deleteMutation = trpc.admin.deleteOfficialDocument.useMutation();
  const uploadDocumentMutation = trpc.admin.uploadDocument.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<OfficialDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileName: '',
    fileType: '',
    fileSize: '',
    category: '',
    displayOrder: 0,
    isActive: true,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error('File size is too large. Maximum 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        setUploadProgress(30);
        const base64Data = (reader.result as string).split(',')[1];
        
        setUploadProgress(50);
        const result = await uploadDocumentMutation.mutateAsync({
          fileName: file.name,
          fileData: base64Data,
          contentType: file.type,
        });
        
        setUploadProgress(100);
        
        // Format file size
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const sizeStr = sizeInMB + ' MB';
        
        setFormData({ 
          ...formData, 
          fileUrl: result.url,
          fileName: file.name,
          fileType: file.type,
          fileSize: sizeStr
        });
        
        toast.success('File uploaded successfully!');
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.fileUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingDocument) {
        await updateMutation.mutateAsync({
          id: editingDocument.id,
          data: formData,
        });
        toast.success('Document updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Document added successfully');
      }
      
      refetch();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Error saving document');
    }
  };

  const handleEdit = (document: OfficialDocument) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      description: document.description || '',
      fileUrl: document.fileUrl,
      fileName: document.fileName || '',
      fileType: document.fileType || '',
      fileSize: document.fileSize || '',
      category: document.category || '',
      displayOrder: document.displayOrder,
      isActive: document.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Document deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      fileName: '',
      fileType: '',
      fileSize: '',
      category: '',
      displayOrder: 0,
      isActive: true,
    });
    setEditingDocument(null);
    setUploadProgress(0);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Official Documents</h1>
            <p className="text-stone-600 mt-1">Manage large files such as profiles, court decisions, and studies</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDocument ? 'Edit Document' : 'Add New Document'}</DialogTitle>
                <DialogDescription>
                  Upload file and enter document information
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload File *</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 mb-2 animate-bounce" />
                        <span>Uploading... {uploadProgress}%</span>
                      </div>
                    ) : formData.fileUrl ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 mb-2 text-green-600" />
                        <span className="text-sm">{formData.fileName}</span>
                        <span className="text-xs text-stone-500">{formData.fileSize}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 mb-2" />
                        <span>Click to upload file</span>
                        <span className="text-xs text-stone-500">PDF, Word, Excel, PowerPoint, ZIP (Max 100MB)</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Example: Court Decision No. 123"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the document..."
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Example: Court Decisions, Studies, Profiles"
                  />
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading || !formData.fileUrl}>
                    {editingDocument ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Documents List</CardTitle>
            <CardDescription>
              {documents?.length || 0} document(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!documents || documents.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          {doc.description && (
                            <div className="text-sm text-stone-500 truncate max-w-md">
                              {doc.description}
                            </div>
                          )}
                          {doc.fileName && (
                            <div className="text-xs text-stone-400 mt-1">{doc.fileName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.category && (
                          <Badge variant="outline">{doc.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-stone-600">{doc.fileSize || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.isActive ? 'default' : 'secondary'}>
                          {doc.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.displayOrder}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(doc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
