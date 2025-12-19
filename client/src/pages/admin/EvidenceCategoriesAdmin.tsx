import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Tag, FileText, Mail, MessageSquare, Zap, ScrollText, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

const iconOptions = [
  { value: 'FileText', label: 'Document', icon: FileText },
  { value: 'Mail', label: 'Email', icon: Mail },
  { value: 'MessageSquare', label: 'Message/WhatsApp', icon: MessageSquare },
  { value: 'Zap', label: 'SWIFT', icon: Zap },
  { value: 'ScrollText', label: 'Letter', icon: ScrollText },
  { value: 'FileCheck', label: 'License', icon: FileCheck },
];

export default function EvidenceCategoriesAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    color: '#5d6d4e',
    icon: 'FileText',
    displayOrder: 0,
  });

  const { data: categories, refetch } = trpc.admin.getEvidenceCategories.useQuery();
  const createMutation = trpc.admin.createEvidenceCategory.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully');
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const updateMutation = trpc.admin.updateEvidenceCategory.useMutation({
    onSuccess: () => {
      toast.success('Category updated successfully');
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = trpc.admin.deleteEvidenceCategory.useMutation({
    onSuccess: () => {
      toast.success('Category deleted successfully');
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      key: '',
      label: '',
      color: '#5d6d4e',
      icon: 'FileText',
      displayOrder: 0,
    });
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      key: category.key,
      label: category.label,
      color: category.color || '#5d6d4e',
      icon: category.icon || 'FileText',
      displayOrder: category.displayOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : FileText;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3d3d3d]">Evidence Categories</h1>
            <p className="text-[#3d3d3d]/60">Manage categories for evidence items (Emails, SWIFT, WhatsApp, etc.)</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="key">Key (unique identifier)</Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="e.g., emails"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="label">Display Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Emails"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#5d6d4e"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => {
            const IconComponent = getIconComponent(category.icon || 'FileText');
            return (
              <Card key={category.id} className="border-[#c4a35a]/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center" 
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: category.color || '#5d6d4e' }} />
                      </div>
                      <CardTitle className="text-lg">{category.label}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteMutation.mutate({ id: category.id })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#3d3d3d]/70">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      <span>Key: <code className="bg-stone-100 px-1 rounded">{category.key}</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Order: {category.displayOrder}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!categories || categories.length === 0) && (
          <Card className="border-dashed border-2 border-[#c4a35a]/30">
            <CardContent className="py-12 text-center">
              <Tag className="w-12 h-12 mx-auto text-[#c4a35a]/50 mb-4" />
              <p className="text-[#3d3d3d]/60">No categories yet. Add your first category to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
