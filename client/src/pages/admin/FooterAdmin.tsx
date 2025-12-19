import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

interface QuickLink {
  label: string;
  href: string;
}

export default function FooterAdmin() {
  const { data: footerData, isLoading, refetch } = trpc.admin.getFooterContent.useQuery();
  const upsertMutation = trpc.admin.upsertFooterContent.useMutation();

  const [formData, setFormData] = useState({
    companyName: '',
    companySubtitle: '',
    aboutText: '',
    contactAddress: '',
    contactPhone: '',
    contactWebsite: '',
    legalDisclaimer: '',
    commercialReg: '',
  });
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

  useEffect(() => {
    if (footerData) {
      setFormData({
        companyName: footerData.companyName || '',
        companySubtitle: footerData.companySubtitle || '',
        aboutText: footerData.aboutText || '',
        contactAddress: footerData.contactAddress || '',
        contactPhone: footerData.contactPhone || '',
        contactWebsite: footerData.contactWebsite || '',
        legalDisclaimer: footerData.legalDisclaimer || '',
        commercialReg: footerData.commercialReg || '',
      });
      setQuickLinks((footerData.quickLinks as QuickLink[]) || []);
    }
  }, [footerData]);

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync({
        ...formData,
        quickLinks,
      });
      toast.success('Footer content saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save footer content');
    }
  };

  const addQuickLink = () => {
    setQuickLinks([...quickLinks, { label: '', href: '' }]);
  };

  const removeQuickLink = (index: number) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== index));
  };

  const updateQuickLink = (index: number, field: keyof QuickLink, value: string) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [field]: value };
    setQuickLinks(updated);
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
            <h1 className="text-2xl font-bold text-stone-900">Footer Settings</h1>
            <p className="text-stone-600 mt-1">Configure the website footer content</p>
          </div>
          <Button onClick={handleSave} disabled={upsertMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {upsertMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Nesma Barzan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySubtitle">Company Subtitle</Label>
                <Input
                  id="companySubtitle"
                  value={formData.companySubtitle}
                  onChange={(e) => setFormData({ ...formData, companySubtitle: e.target.value })}
                  placeholder="نسمة برزان"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutText">About Text</Label>
                <Textarea
                  id="aboutText"
                  value={formData.aboutText}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  placeholder="Brief description of the company..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commercialReg">Commercial Registration</Label>
                <Input
                  id="commercialReg"
                  value={formData.commercialReg}
                  onChange={(e) => setFormData({ ...formData, commercialReg: e.target.value })}
                  placeholder="C.R. 2051024329"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details displayed in footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Address</Label>
                <Textarea
                  id="contactAddress"
                  value={formData.contactAddress}
                  onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                  placeholder="Full address..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+966 xxx xxx xxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactWebsite">Website</Label>
                <Input
                  id="contactWebsite"
                  value={formData.contactWebsite}
                  onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                  placeholder="www.example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Navigation links in footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
                  <GripVertical className="h-4 w-4 text-stone-400 cursor-move" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      value={link.href}
                      onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                      placeholder="#section-id"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuickLink(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addQuickLink} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Quick Link
              </Button>
            </CardContent>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Disclaimer</CardTitle>
              <CardDescription>Legal text displayed at bottom of footer</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.legalDisclaimer}
                onChange={(e) => setFormData({ ...formData, legalDisclaimer: e.target.value })}
                placeholder="This documentation is provided for legal proceedings..."
                rows={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How the footer will appear on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-stone-800 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company */}
                <div>
                  <h3 className="font-semibold text-lg">{formData.companyName || 'Company Name'}</h3>
                  <p className="text-stone-400 text-sm">{formData.companySubtitle || 'Subtitle'}</p>
                  <p className="text-stone-300 text-sm mt-2 line-clamp-3">
                    {formData.aboutText || 'About text will appear here...'}
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="font-medium mb-3">Quick Links</h4>
                  <ul className="space-y-2">
                    {quickLinks.length > 0 ? (
                      quickLinks.map((link, i) => (
                        <li key={i} className="text-stone-400 text-sm hover:text-white">
                          {link.label || `Link ${i + 1}`}
                        </li>
                      ))
                    ) : (
                      <li className="text-stone-500 text-sm">No links added</li>
                    )}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-medium mb-3">Contact</h4>
                  <div className="space-y-2 text-stone-400 text-sm">
                    {formData.contactAddress && <p>{formData.contactAddress}</p>}
                    {formData.contactPhone && <p>{formData.contactPhone}</p>}
                    {formData.contactWebsite && <p>{formData.contactWebsite}</p>}
                    {formData.commercialReg && <p className="text-xs">{formData.commercialReg}</p>}
                  </div>
                </div>
              </div>

              {formData.legalDisclaimer && (
                <div className="mt-6 pt-6 border-t border-stone-700">
                  <p className="text-xs text-stone-500 line-clamp-2">{formData.legalDisclaimer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
