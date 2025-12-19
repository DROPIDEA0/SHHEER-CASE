import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

export default function HeaderAdmin() {
  const { data: headerData, isLoading, refetch } = trpc.admin.getHeaderContent.useQuery();
  const upsertMutation = trpc.admin.upsertHeaderContent.useMutation();

  const [formData, setFormData] = useState({
    logoUrl: '',
    siteName: '',
    siteSubtitle: '',
  });
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    if (headerData) {
      setFormData({
        logoUrl: headerData.logoUrl || '',
        siteName: headerData.siteName || '',
        siteSubtitle: headerData.siteSubtitle || '',
      });
      setNavItems((headerData.navItems as NavItem[]) || []);
    }
  }, [headerData]);

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync({
        ...formData,
        navItems,
      });
      toast.success('Header content saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save header content');
    }
  };

  const addNavItem = () => {
    setNavItems([...navItems, { label: '', href: '' }]);
  };

  const removeNavItem = (index: number) => {
    setNavItems(navItems.filter((_, i) => i !== index));
  };

  const updateNavItem = (index: number, field: keyof NavItem, value: string) => {
    const updated = [...navItems];
    updated[index] = { ...updated[index], [field]: value };
    setNavItems(updated);
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
            <h1 className="text-2xl font-bold text-stone-900">Header Settings</h1>
            <p className="text-stone-600 mt-1">Configure the website header and navigation</p>
          </div>
          <Button onClick={handleSave} disabled={upsertMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {upsertMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Logo and site name settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="/images/logo.png"
                />
                {formData.logoUrl && (
                  <div className="mt-2 p-4 bg-stone-50 rounded-lg">
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo Preview" 
                      className="h-16 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="SHHEER Case"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteSubtitle">Site Subtitle</Label>
                <Input
                  id="siteSubtitle"
                  value={formData.siteSubtitle}
                  onChange={(e) => setFormData({ ...formData, siteSubtitle: e.target.value })}
                  placeholder="Bank Guarantee Dispute"
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation Items */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Configure header navigation links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {navItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
                  <GripVertical className="h-4 w-4 text-stone-400 cursor-move" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      value={item.label}
                      onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      value={item.href}
                      onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                      placeholder="#section-id"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNavItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addNavItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Navigation Item
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How the header will appear on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.logoUrl && (
                    <img src={formData.logoUrl} alt="Logo" className="h-10 w-10 object-contain" />
                  )}
                  <div>
                    <div className="font-semibold text-stone-900">{formData.siteName || 'Site Name'}</div>
                    <div className="text-sm text-stone-500">{formData.siteSubtitle || 'Subtitle'}</div>
                  </div>
                </div>
                <nav className="flex items-center gap-4">
                  {navItems.map((item, index) => (
                    <span key={index} className="text-sm text-stone-600 hover:text-stone-900">
                      {item.label || `Link ${index + 1}`}
                    </span>
                  ))}
                </nav>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
