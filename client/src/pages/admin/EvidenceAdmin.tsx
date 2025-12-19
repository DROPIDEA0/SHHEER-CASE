import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FolderOpen, Upload, Image, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categories = [
  { value: 'licenses', label: 'Licenses', color: 'bg-blue-100 text-blue-800' },
  { value: 'letters', label: 'Letters', color: 'bg-green-100 text-green-800' },
  { value: 'swift', label: 'SWIFT', color: 'bg-purple-100 text-purple-800' },
  { value: 'documents', label: 'Documents', color: 'bg-orange-100 text-orange-800' },
  { value: 'emails', label: 'Emails', color: 'bg-pink-100 text-pink-800' },
  { value: 'whatsapp', label: 'WhatsApp', color: 'bg-emerald-100 text-emerald-800' },
];

type Category = 'licenses' | 'letters' | 'swift' | 'documents' | 'emails' | 'whatsapp';

interface EvidenceItem {
  id: number;
  title: string;
  description: string | null;
  category: Category;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  thumbnailUrl: string | null;
  eventId: number | null;
  displayOrder: number | null;
  isActive: boolean | null;
}

export default function EvidenceAdmin() {
  const { data: evidence, isLoading, refetch } = trpc.admin.getEvidenceItems.useQuery();
  const { data: timelineEvents } = trpc.admin.getTimelineEvents.useQuery();
  const createMutation = trpc.admin.createEvidenceItem.useMutation();
  const updateMutation = trpc.admin.updateEvidenceItem.useMutation();
  const deleteMutation = trpc.admin.deleteEvidenceItem.useMutation();
  const uploadMutation = trpc.admin.uploadFile.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EvidenceItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'documents' as Category,
    fileUrl: '',
    fileName: '',
    fileType: '',
    thumbnailUrl: '',
    eventId: null as number | null,
    displayOrder: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'documents',
      fileUrl: '',
      fileName: '',
      fileType: '',
      thumbnailUrl: '',
      eventId: null,
      displayOrder: 0,
      isActive: true,
    });
    setEditingItem(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: EvidenceItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      fileUrl: item.fileUrl || '',
      fileName: item.fileName || '',
      fileType: item.fileType || '',
      thumbnailUrl: item.thumbnailUrl || '',
      eventId: item.eventId,
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await uploadMutation.mutateAsync({
          fileName: file.name,
          fileData: base64,
          contentType: file.type,
        });
        
        setFormData({
          ...formData,
          fileUrl: result.url,
          fileName: file.name,
          fileType: file.type,
          thumbnailUrl: file.type.startsWith('image/') ? result.url : '',
        });
        toast.success('File uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data: formData,
        });
        toast.success('Evidence updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Evidence created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Failed to save evidence');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this evidence?')) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Evidence deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete evidence');
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? <Badge className={cat.color}>{cat.label}</Badge> : null;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/4"></div>
          <div className="h-64 bg-stone-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Evidence Management</h1>
            <p className="text-stone-600 mt-1">Upload and manage case evidence documents</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Evidence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Evidence' : 'Add New Evidence'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Evidence title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>File</Label>
                  <div className="border-2 border-dashed border-stone-200 rounded-lg p-4">
                    {formData.fileUrl ? (
                      <div className="flex items-center gap-3">
                        {formData.fileType?.startsWith('image/') ? (
                          <img src={formData.fileUrl} alt="Preview" className="h-16 w-16 object-cover rounded" />
                        ) : (
                          <FileText className="h-16 w-16 text-stone-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{formData.fileName}</p>
                          <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            View file <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-stone-400 mb-2" />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                          {uploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                        <p className="text-xs text-stone-500 mt-2">Or enter URL below</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileUrl">File URL (or paste external URL)</Label>
                  <Input
                    id="fileUrl"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">Thumbnail URL (for images)</Label>
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventId">Link to Timeline Event (Optional)</Label>
                  <Select
                    value={formData.eventId?.toString() || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, eventId: value === 'none' ? null : parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No linked event</SelectItem>
                      {timelineEvents?.map((event) => (
                        <SelectItem key={event.id} value={event.id.toString()}>
                          {event.date} - {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Evidence Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Evidence ({evidence?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {evidence && evidence.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-stone-100 relative">
                      {item.thumbnailUrl || item.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={item.thumbnailUrl || item.fileUrl || ''}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-12 w-12 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {getCategoryBadge(item.category)}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-stone-900 truncate">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-stone-500 line-clamp-2 mt-1">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-stone-400">{item.fileName || 'No file'}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(item as EvidenceItem)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-500">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No evidence items yet</p>
                <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Evidence
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
