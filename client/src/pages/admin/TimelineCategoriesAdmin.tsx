import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Tag, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function TimelineCategoriesAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    color: '#5d6d4e',
    bgColor: '#f5f2eb',
    textColor: '#3d3d3d',
    lightColor: '#5d6d4e1a',
    displayOrder: 0,
  });

  const { data: categories, refetch } = trpc.admin.getTimelineCategories.useQuery();
  const createMutation = trpc.admin.createTimelineCategory.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully');
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const updateMutation = trpc.admin.updateTimelineCategory.useMutation({
    onSuccess: () => {
      toast.success('Category updated successfully');
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = trpc.admin.deleteTimelineCategory.useMutation({
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
      bgColor: '#f5f2eb',
      textColor: '#3d3d3d',
      lightColor: '#5d6d4e1a',
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
      bgColor: category.bgColor || '#f5f2eb',
      textColor: category.textColor || '#3d3d3d',
      lightColor: category.lightColor || '#5d6d4e1a',
      displayOrder: category.displayOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleMainColorChange = (color: string) => {
    // Auto-generate light color from main color (10% opacity)
    const lightColor = color + '1a';
    setFormData({
      ...formData,
      color,
      lightColor,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3d3d3d]">Timeline Categories</h1>
            <p className="text-[#3d3d3d]/60">Manage categories for timeline events (Critical Failure, SWIFT Operations, etc.)</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
                    placeholder="e.g., critical_failure"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="label">Display Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Critical Failure"
                    required
                  />
                </div>
                
                {/* Color Settings Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-[#5d6d4e]" />
                    <span className="font-medium text-sm">Color Settings</span>
                  </div>
                  
                  {/* Main Badge Color */}
                  <div className="mb-4">
                    <Label htmlFor="color">Badge Color (Main)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleMainColorChange(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => handleMainColorChange(e.target.value)}
                        placeholder="#5d6d4e"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-[#3d3d3d]/50 mt-1">Used for badge background and timeline node</p>
                  </div>

                  {/* Box Background Color */}
                  <div className="mb-4">
                    <Label htmlFor="bgColor">Box Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgColor"
                        type="color"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        placeholder="#f5f2eb"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-[#3d3d3d]/50 mt-1">Background color of the event card</p>
                  </div>

                  {/* Text Color */}
                  <div className="mb-4">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        placeholder="#3d3d3d"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-[#3d3d3d]/50 mt-1">Text color inside the event card</p>
                  </div>

                  {/* Light/Accent Color */}
                  <div className="mb-4">
                    <Label htmlFor="lightColor">Light/Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="lightColor"
                        type="color"
                        value={formData.lightColor.replace(/[a-f0-9]{2}$/i, '')}
                        onChange={(e) => setFormData({ ...formData, lightColor: e.target.value + '1a' })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.lightColor}
                        onChange={(e) => setFormData({ ...formData, lightColor: e.target.value })}
                        placeholder="#5d6d4e1a"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-[#3d3d3d]/50 mt-1">Light accent color for tags and highlights</p>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="border rounded-lg p-4" style={{ backgroundColor: formData.bgColor }}>
                  <div className="text-xs text-[#3d3d3d]/50 mb-2">Preview:</div>
                  <div 
                    className="inline-block px-2 py-1 rounded text-white text-sm mb-2"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.label || 'Category Label'}
                  </div>
                  <p style={{ color: formData.textColor }} className="text-sm">
                    Sample event title and description text
                  </p>
                  <div 
                    className="inline-block px-2 py-0.5 rounded text-xs mt-2"
                    style={{ backgroundColor: formData.lightColor, color: formData.color }}
                  >
                    Sample Tag
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
          {categories?.map((category) => (
            <Card key={category.id} className="border-[#c4a35a]/20 overflow-hidden">
              <div 
                className="h-2" 
                style={{ backgroundColor: category.color || '#5d6d4e' }}
              />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color || '#5d6d4e' }}
                    />
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
                  {/* Color Preview */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#c4a35a]/10">
                    <Palette className="w-3 h-3" />
                    <span>Colors:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-5 h-5 rounded border border-[#c4a35a]/20" 
                        style={{ backgroundColor: category.color || '#5d6d4e' }}
                        title="Badge Color"
                      />
                      <div 
                        className="w-5 h-5 rounded border border-[#c4a35a]/20" 
                        style={{ backgroundColor: category.bgColor || '#f5f2eb' }}
                        title="Box Background"
                      />
                      <div 
                        className="w-5 h-5 rounded border border-[#c4a35a]/20" 
                        style={{ backgroundColor: category.textColor || '#3d3d3d' }}
                        title="Text Color"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
