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
      toast.error('الرجاء إدخال رقم الواتساب');
      return;
    }

    try {
      await upsertMutation.mutateAsync(formData);
      toast.success('تم حفظ الإعدادات بنجاح');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'فشل في حفظ الإعدادات');
    }
  };

  const handlePreview = () => {
    const phone = formData.phoneNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(formData.message || 'مرحباً');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">إعدادات واتساب</h1>
        <p className="text-stone-600 mt-1">إدارة زر واتساب الثابت على الموقع</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enable/Disable */}
        <Card>
          <CardHeader>
            <CardTitle>تفعيل زر واتساب</CardTitle>
            <CardDescription>
              إظهار أو إخفاء زر واتساب الثابت على الموقع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="isEnabled"
                checked={formData.isEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
              />
              <Label htmlFor="isEnabled" className="text-base">
                {formData.isEnabled ? 'مفعّل' : 'غير مفعّل'}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Number */}
        <Card>
          <CardHeader>
            <CardTitle>رقم واتساب</CardTitle>
            <CardDescription>
              أدخل رقم واتساب مع رمز الدولة (مثال: +966500000000)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+966500000000"
                required={formData.isEnabled}
              />
              <p className="text-sm text-stone-500">
                تأكد من إضافة رمز الدولة (مثال: +966 للسعودية)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Default Message */}
        <Card>
          <CardHeader>
            <CardTitle>الرسالة الافتراضية</CardTitle>
            <CardDescription>
              الرسالة التي ستظهر تلقائياً عند فتح محادثة واتساب
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">نص الرسالة</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="مرحباً، أرغب في الاستفسار عن القضية"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Position */}
        <Card>
          <CardHeader>
            <CardTitle>موضع الزر</CardTitle>
            <CardDescription>
              اختر موقع ظهور زر واتساب على الموقع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position">الموضع</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger id="position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">أسفل اليمين</SelectItem>
                  <SelectItem value="bottom-left">أسفل اليسار</SelectItem>
                  <SelectItem value="top-right">أعلى اليمين</SelectItem>
                  <SelectItem value="top-left">أعلى اليسار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position Preview */}
            <div className="relative w-full h-48 bg-stone-100 rounded-lg border-2 border-dashed border-stone-300">
              <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
                معاينة موضع الزر
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
            <Save className="h-4 w-4 ml-2" />
            {upsertMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
          {formData.phoneNumber && (
            <Button type="button" variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 ml-2" />
              معاينة
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
              <p className="font-semibold">ملاحظات مهمة:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>تأكد من إضافة رمز الدولة مع رقم الهاتف (مثال: +966 للسعودية)</li>
                <li>الزر سيظهر فقط عند تفعيله وإدخال رقم صحيح</li>
                <li>يمكنك تغيير موضع الزر ليناسب تصميم موقعك</li>
                <li>الرسالة الافتراضية ستظهر تلقائياً عند فتح محادثة واتساب</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
