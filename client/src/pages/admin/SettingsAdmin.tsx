import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Save, Upload, User, Lock, Image, Globe, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function SettingsAdmin() {
  const { data: settings, isLoading, refetch } = trpc.admin.getSiteSettings.useQuery();
  const { data: adminSettings, refetch: refetchAdminSettings } = trpc.admin.getAdminSettings.useQuery();
  const upsertMutation = trpc.admin.upsertSiteSetting.useMutation();
  const updateAdminSettingMutation = trpc.admin.updateAdminSetting.useMutation();
  const changePasswordMutation = trpc.admin.changeAdminPassword.useMutation();
  const uploadLogoMutation = trpc.admin.uploadAdminLogo.useMutation();
  const uploadFaviconMutation = trpc.admin.uploadFavicon.useMutation();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  // File upload refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword
      });
      toast.success('تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'فشل في تغيير كلمة المرور');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await uploadLogoMutation.mutateAsync({ imageData: base64 });
        toast.success('تم رفع الشعار بنجاح');
        refetchAdminSettings();
      } catch (error) {
        toast.error('فشل في رفع الشعار');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await uploadFaviconMutation.mutateAsync({ imageData: base64 });
        toast.success('تم رفع الأيقونة بنجاح');
        refetchAdminSettings();
      } catch (error) {
        toast.error('فشل في رفع الأيقونة');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSetting = async (key: string, value: string, type: string = 'text') => {
    try {
      await upsertMutation.mutateAsync({ key, value, type });
      toast.success('تم حفظ الإعداد بنجاح');
      refetch();
    } catch (error) {
      toast.error('فشل في حفظ الإعداد');
    }
  };

  // Get current logo and favicon from admin settings
  const currentLogo = adminSettings?.find(s => s.settingKey === 'admin_logo')?.settingValue;
  const currentFavicon = adminSettings?.find(s => s.settingKey === 'favicon')?.settingValue;
  const siteTitle = adminSettings?.find(s => s.settingKey === 'site_title')?.settingValue || 'SHHEER CASE';

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
        <div>
          <h1 className="text-2xl font-bold text-stone-900">الإعدادات</h1>
          <p className="text-stone-600 mt-1">إدارة إعدادات الموقع ولوحة التحكم</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              الحساب
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              العلامة التجارية
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              الموقع
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
                <CardDescription>تحديث معلومات حساب المدير</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">الاسم</Label>
                    <Input
                      id="adminName"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="اسم المدير"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">البريد الإلكتروني</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>
                <Button 
                  onClick={async () => {
                    try {
                      if (adminEmail) {
                        await updateAdminSettingMutation.mutateAsync({ 
                          key: 'admin_email', 
                          value: adminEmail 
                        });
                      }
                      if (adminName) {
                        await updateAdminSettingMutation.mutateAsync({ 
                          key: 'admin_name', 
                          value: adminName 
                        });
                      }
                      toast.success('تم تحديث المعلومات بنجاح');
                    } catch (error) {
                      toast.error('فشل في تحديث المعلومات');
                    }
                  }}
                  disabled={updateAdminSettingMutation.isPending}
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
                <CardDescription>تحديث كلمة مرور حساب المدير</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الجديدة"
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                  />
                </div>

                <Button 
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4 ml-2" />
                  )}
                  تغيير كلمة المرور
                </Button>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>ملاحظة:</strong> كلمة المرور الافتراضية هي <code className="bg-amber-100 px-1 rounded">admin123</code>. 
                    يُنصح بتغييرها فوراً لأسباب أمنية.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>شعار لوحة التحكم</CardTitle>
                  <CardDescription>رفع شعار يظهر في لوحة التحكم</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center">
                    {currentLogo ? (
                      <div className="space-y-4">
                        <img 
                          src={currentLogo} 
                          alt="Admin Logo" 
                          className="max-h-24 mx-auto object-contain"
                        />
                        <p className="text-sm text-stone-500">الشعار الحالي</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-stone-400" />
                        <p className="text-sm text-stone-500">لم يتم رفع شعار بعد</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadLogoMutation.isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    {uploadLogoMutation.isPending ? 'جاري الرفع...' : 'رفع شعار جديد'}
                  </Button>
                </CardContent>
              </Card>

              {/* Favicon Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>أيقونة الموقع (Favicon)</CardTitle>
                  <CardDescription>رفع أيقونة تظهر في تبويب المتصفح</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center">
                    {currentFavicon ? (
                      <div className="space-y-4">
                        <img 
                          src={currentFavicon} 
                          alt="Favicon" 
                          className="h-16 w-16 mx-auto object-contain"
                        />
                        <p className="text-sm text-stone-500">الأيقونة الحالية</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Globe className="h-12 w-12 mx-auto text-stone-400" />
                        <p className="text-sm text-stone-500">لم يتم رفع أيقونة بعد</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadFaviconMutation.isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    {uploadFaviconMutation.isPending ? 'جاري الرفع...' : 'رفع أيقونة جديدة'}
                  </Button>
                  <p className="text-xs text-stone-500 text-center">
                    يُفضل استخدام صورة مربعة بحجم 32x32 أو 64x64 بكسل
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Site Title */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>عنوان الموقع</CardTitle>
                <CardDescription>العنوان الذي يظهر في تبويب المتصفح</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={siteTitle}
                    onChange={(e) => {
                      // Update local state would go here
                    }}
                    placeholder="SHHEER CASE"
                    className="flex-1"
                  />
                  <Button 
                    onClick={async () => {
                      const input = document.querySelector('input[placeholder="SHHEER CASE"]') as HTMLInputElement;
                      if (input?.value) {
                        try {
                          await updateAdminSettingMutation.mutateAsync({ 
                            key: 'site_title', 
                            value: input.value 
                          });
                          toast.success('تم حفظ عنوان الموقع');
                          refetchAdminSettings();
                        } catch (error) {
                          toast.error('فشل في حفظ العنوان');
                        }
                      }
                    }}
                    disabled={updateAdminSettingMutation.isPending}
                  >
                    <Save className="h-4 w-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="site" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الموقع العامة</CardTitle>
                <CardDescription>إعدادات متقدمة للموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings && settings.length > 0 ? (
                    settings.map((setting) => (
                      <SettingRow
                        key={setting.id}
                        setting={setting}
                        onSave={handleSaveSetting}
                        isPending={upsertMutation.isPending}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-stone-500">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إعدادات مخصصة</p>
                    </div>
                  )}
                </div>

                {/* Add New Setting */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">إضافة إعداد جديد</h4>
                  <AddSettingForm onSave={handleSaveSetting} isPending={upsertMutation.isPending} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Individual setting row component
function SettingRow({ 
  setting, 
  onSave, 
  isPending 
}: { 
  setting: { id: number; key: string; value: string | null; type: string };
  onSave: (key: string, value: string, type: string) => Promise<void>;
  isPending: boolean;
}) {
  const [value, setValue] = useState(setting.value || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await onSave(setting.key, value, setting.type);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
      <div className="flex-shrink-0 w-48">
        <code className="text-sm font-mono text-stone-700">{setting.key}</code>
        <p className="text-xs text-stone-400 mt-1">النوع: {setting.type}</p>
      </div>
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsEditing(true);
          }}
          placeholder="أدخل القيمة"
        />
      </div>
      {isEditing && (
        <Button onClick={handleSave} disabled={isPending} size="sm">
          <Save className="h-4 w-4 ml-1" />
          حفظ
        </Button>
      )}
    </div>
  );
}

// Add new setting form
function AddSettingForm({ 
  onSave, 
  isPending 
}: { 
  onSave: (key: string, value: string, type: string) => Promise<void>;
  isPending: boolean;
}) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    if (!key) {
      toast.error('مفتاح الإعداد مطلوب');
      return;
    }
    await onSave(key, value, 'text');
    setKey('');
    setValue('');
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1 space-y-2">
        <Label>المفتاح</Label>
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="setting_key"
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label>القيمة</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="القيمة"
        />
      </div>
      <Button onClick={handleSubmit} disabled={isPending}>
        إضافة
      </Button>
    </div>
  );
}
