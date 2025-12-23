import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, MessageCircle, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function WhatsAppSettingsAdmin() {
  const { data: settings, isLoading, refetch } = trpc.admin.getWhatsAppSettings.useQuery();
  const upsertMutation = trpc.admin.upsertWhatsAppSettings.useMutation();

  const [formData, setFormData] = useState({
    isEnabled: false,
    phoneNumber: '',
    message: '',
    position: 'bottom-right',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        isEnabled: settings.isEnabled || false,
        phoneNumber: settings.phoneNumber || '',
        message: settings.message || '',
        position: settings.position || 'bottom-right',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.isEnabled && !formData.phoneNumber) {
      toast.error('Please enter WhatsApp number');
      return;
    }

    try {
      await upsertMutation.mutateAsync(formData);
      toast.success('Settings saved successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    }
  };

  const handlePreview = () => {
    const phone = formData.phoneNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(formData.message || 'Hello');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
        <div>
          <h1 className="text-3xl font-bold text-stone-900">WhatsApp Settings</h1>
          <p className="text-stone-600 mt-1">Manage fixed WhatsApp button on the website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enable/Disable */}
          <Card>
            <CardHeader>
              <CardTitle>Enable WhatsApp Button</CardTitle>
              <CardDescription>
                Show or hide the fixed WhatsApp button on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isEnabled"
                  checked={formData.isEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
                />
                <Label htmlFor="isEnabled" className="text-base">
                  {formData.isEnabled ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Number */}
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Number</CardTitle>
              <CardDescription>
                Enter WhatsApp number with country code (e.g., +966500000000)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+966500000000"
                  required={formData.isEnabled}
                />
                <p className="text-sm text-stone-500">
                  Make sure to include country code (e.g., +966 for Saudi Arabia)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Default Message */}
          <Card>
            <CardHeader>
              <CardTitle>Default Message</CardTitle>
              <CardDescription>
                The message that will appear automatically when opening WhatsApp chat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message Text</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hello, I would like to inquire about the case"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Position */}
          <Card>
            <CardHeader>
              <CardTitle>Button Position</CardTitle>
              <CardDescription>
                Choose where the WhatsApp button will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger id="position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Position Preview */}
              <div className="relative w-full h-48 bg-stone-100 rounded-lg border-2 border-dashed border-stone-300">
                <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
                  Button Position Preview
                </div>
                <div
                  className={`absolute ${
                    formData.position === 'bottom-right'
                      ? 'bottom-4 right-4'
                      : formData.position === 'bottom-left'
                      ? 'bottom-4 left-4'
                      : formData.position === 'top-right'
                      ? 'top-4 right-4'
                      : 'top-4 left-4'
                  }`}
                >
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={upsertMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {upsertMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
            {formData.phoneNumber && (
              <Button type="button" variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
          </div>
        </form>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-blue-900">
                <p className="font-semibold">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Make sure to include country code with phone number (e.g., +966 for Saudi Arabia)</li>
                  <li>Button will only appear when enabled and valid number is entered</li>
                  <li>You can change button position to match your website design</li>
                  <li>Default message will appear automatically when opening WhatsApp chat</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
