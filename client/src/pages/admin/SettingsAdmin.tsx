import { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      toast.error('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await uploadLogoMutation.mutateAsync({ imageData: base64 });
        toast.success('Logo uploaded successfully');
        refetchAdminSettings();
      } catch (error) {
        toast.error('Failed to upload logo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await uploadFaviconMutation.mutateAsync({ imageData: base64 });
        toast.success('Favicon uploaded successfully');
        refetchAdminSettings();
      } catch (error) {
        toast.error('Failed to upload favicon');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSetting = async (key: string, value: string, type: string) => {
    try {
      await upsertMutation.mutateAsync({ key, value, type });
      toast.success('Setting saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save setting');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
          <p className="text-stone-600 mt-1">Manage site and admin panel settings</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Site
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update admin account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Name</Label>
                    <Input
                      id="adminName"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Admin name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
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
                      if (adminName) {
                        await updateAdminSettingMutation.mutateAsync({
                          key: 'adminName',
                          value: adminName
                        });
                      }
                      if (adminEmail) {
                        await updateAdminSettingMutation.mutateAsync({
                          key: 'adminEmail',
                          value: adminEmail
                        });
                      }
                      toast.success('Information updated successfully');
                    } catch (error) {
                      toast.error('Failed to update information');
                    }
                  }}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update admin account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {changePasswordMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Change Password
                </Button>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> The default password is <code className="bg-amber-100 px-1 rounded">admin123</code>. 
                    It is recommended to change it immediately for security reasons.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Panel Logo</CardTitle>
                  <CardDescription>Upload a logo for the admin panel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 rounded-lg">
                    {adminSettings?.adminLogoUrl ? (
                      <div className="space-y-2 text-center">
                        <img
                          src={adminSettings.adminLogoUrl}
                          alt="Admin Logo"
                          className="max-h-24 mx-auto object-contain"
                        />
                        <p className="text-sm text-stone-500">Current logo</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-stone-400" />
                        <p className="text-sm text-stone-500">No logo uploaded yet</p>
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
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadLogoMutation.isPending ? 'Uploading...' : 'Upload New Logo'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Site Favicon</CardTitle>
                  <CardDescription>Upload an icon for the browser tab</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 rounded-lg">
                    {adminSettings?.faviconUrl ? (
                      <div className="space-y-2 text-center">
                        <img
                          src={adminSettings.faviconUrl}
                          alt="Favicon"
                          className="h-16 w-16 mx-auto object-contain"
                        />
                        <p className="text-sm text-stone-500">Current favicon</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Globe className="h-12 w-12 mx-auto text-stone-400" />
                        <p className="text-sm text-stone-500">No favicon uploaded yet</p>
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
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadFaviconMutation.isPending ? 'Uploading...' : 'Upload New Favicon'}
                  </Button>
                  <p className="text-xs text-stone-500 text-center">
                    Recommended: Square image 32x32 or 64x64 pixels
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Site Title</CardTitle>
                <CardDescription>The title shown in the browser tab</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    defaultValue={settings?.find(s => s.key === 'siteTitle')?.value || ''}
                    placeholder="Enter site title"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        handleSaveSetting('siteTitle', input.value, 'string');
                      }
                    }}
                  />
                  <Button
                    onClick={async (e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                      if (input) {
                        try {
                          await upsertMutation.mutateAsync({
                            key: 'siteTitle',
                            type: 'string',
                            value: input.value
                          });
                          toast.success('Site title saved');
                          refetchAdminSettings();
                        } catch (error) {
                          toast.error('Failed to save title');
                        }
                      }
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Tab */}
          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>General Site Settings</CardTitle>
                <CardDescription>Advanced site configuration</CardDescription>
              </CardHeader>
              <CardContent>
                {settings && settings.length > 0 ? (
                  <div className="space-y-4">
                    {settings.map((setting) => (
                      <SettingItem
                        key={setting.id}
                        setting={setting}
                        onSave={handleSaveSetting}
                        isPending={upsertMutation.isPending}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No custom settings</p>
                  </div>
                )}

                {/* Add New Setting */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Add New Setting</h4>
                  <AddSettingForm onSave={handleSaveSetting} isPending={upsertMutation.isPending} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminLayout>
  );
}

// SettingItem Component
function SettingItem({ setting, onSave, isPending }: { setting: any; onSave: (key: string, value: string, type: string) => void; isPending: boolean }) {
  const [value, setValue] = useState(setting.value || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(setting.key, value, setting.type);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="flex-shrink-0 w-48">
        <code className="text-sm font-mono text-stone-700">{setting.key}</code>
        <p className="text-xs text-stone-400 mt-1">Type: {setting.type}</p>
      </div>
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => {
            if (value !== setting.value) {
              setIsEditing(true);
            }
          }}
          placeholder="Enter value"
        />
      </div>
      {isEditing && (
        <Button onClick={handleSave} disabled={isPending} size="sm">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      )}
    </div>
  );
}

// AddSettingForm Component
function AddSettingForm({ onSave, isPending }: { onSave: (key: string, value: string, type: string) => void; isPending: boolean }) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    if (!key) {
      toast.error('Setting key is required');
      return;
    }
    await onSave(key, value, 'string');
    setKey('');
    setValue('');
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1 space-y-2">
        <Label>Key</Label>
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="setting_key"
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label>Value</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
        />
      </div>
      <Button onClick={handleSubmit} disabled={isPending}>
        Add
      </Button>
    </div>
  );
}
