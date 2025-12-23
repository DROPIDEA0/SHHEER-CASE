import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function HeroAdmin() {
  const { data: heroData, isLoading, refetch } = trpc.admin.getHeroSection.useQuery();
  const upsertMutation = trpc.admin.upsertHeroSection.useMutation();

  const [formData, setFormData] = useState({
    title: '',
    titleHighlight: '',
    subtitle: '',
    description: '',
    secondaryDescription: '',
    guaranteeRef: '',
    dealValue: '',
    criticalPeriod: '',
    ctaText: '',
    ctaLink: '',
  });

  useEffect(() => {
    if (heroData) {
      setFormData({
        title: heroData.title || '',
        titleHighlight: heroData.titleHighlight || '',
        subtitle: heroData.subtitle || '',
        description: heroData.description || '',
        secondaryDescription: heroData.secondaryDescription || '',
        guaranteeRef: heroData.guaranteeRef || '',
        dealValue: heroData.dealValue || '',
        criticalPeriod: heroData.criticalPeriod || '',
        ctaText: heroData.ctaText || '',
        ctaLink: heroData.ctaLink || '',
      });
    }
  }, [heroData]);

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync(formData);
      toast.success('Hero section saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save hero section');
    }
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
            <h1 className="text-2xl font-bold text-stone-900">Hero Section</h1>
            <p className="text-stone-600 mt-1">Configure the main landing section of the website</p>
          </div>
          <Button onClick={handleSave} disabled={upsertMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {upsertMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
              <CardDescription>Title and description text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (First Line)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bank Guarantee"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleHighlight">Title Highlight (Second Line)</Label>
                <Input
                  id="titleHighlight"
                  value={formData.titleHighlight}
                  onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                  placeholder="Dispute Case"
                />
                <p className="text-xs text-stone-500">This text will be displayed in accent color</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="SHHEER (شهير) Project"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (First Paragraph)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nesma Barzan vs. Al Rajhi Bank"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryDescription">Secondary Description (Second Paragraph)</Label>
                <Textarea
                  id="secondaryDescription"
                  value={formData.secondaryDescription}
                  onChange={(e) => setFormData({ ...formData, secondaryDescription: e.target.value })}
                  placeholder="A comprehensive documentation of how..."
                  rows={4}
                />
                <p className="text-xs text-stone-500">This text appears below the key metrics cards</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Important case numbers and dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guaranteeRef">Guarantee Reference</Label>
                <Input
                  id="guaranteeRef"
                  value={formData.guaranteeRef}
                  onChange={(e) => setFormData({ ...formData, guaranteeRef: e.target.value })}
                  placeholder="JVA-PTVL-FIACL-TBTSCGL-25072013"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealValue">Deal Value Lost</Label>
                <Input
                  id="dealValue"
                  value={formData.dealValue}
                  onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                  placeholder="€120M"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="criticalPeriod">Critical Period</Label>
                <Input
                  id="criticalPeriod"
                  value={formData.criticalPeriod}
                  onChange={(e) => setFormData({ ...formData, criticalPeriod: e.target.value })}
                  placeholder="Oct - Nov 2013"
                />
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
              <CardDescription>Button text and link</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="View Timeline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink">Button Link</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="#timeline"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How the hero section will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-8 bg-gradient-to-b from-stone-50 to-white text-center">
              <h1 className="text-3xl font-serif">
                {formData.title || 'Title'}
                <br />
                <span className="text-burgundy-700">{formData.titleHighlight || 'Highlight'}</span>
              </h1>
              <p className="text-stone-600 mt-2">{formData.subtitle || 'Subtitle'}</p>
              <p className="text-burgundy-600 text-sm mt-1">{formData.description || 'Description'}</p>
              
              <div className="flex justify-center gap-4 mt-6">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Guarantee Reference</div>
                  <div className="font-mono text-sm">{formData.guaranteeRef || 'REF-NUMBER'}</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Deal Value Lost</div>
                  <div className="text-xl font-bold text-burgundy-700">{formData.dealValue || '€0'}</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Critical Period</div>
                  <div className="font-medium">{formData.criticalPeriod || 'Date Range'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
