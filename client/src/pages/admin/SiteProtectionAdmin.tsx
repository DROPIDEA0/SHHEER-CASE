import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Shield, ShieldCheck, ShieldOff, AlertCircle, Loader2, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

interface SiteAccessUserForm {
  username: string;
  password: string;
  name: string;
  isActive: boolean;
}

const defaultForm: SiteAccessUserForm = {
  username: '',
  password: '',
  name: '',
  isActive: true,
};

export default function SiteProtectionAdmin() {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SiteAccessUserForm>(defaultForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [protectionEnabled, setProtectionEnabled] = useState(false);
  const [protectionMessage, setProtectionMessage] = useState('');

  const { data: protection, refetch: refetchProtection } = trpc.siteProtection.getSettings.useQuery();
  const { data: accessUsers, isLoading, refetch } = trpc.siteProtection.getAccessUsers.useQuery();

  useEffect(() => {
    if (protection) {
      setProtectionEnabled(protection.isEnabled || false);
      setProtectionMessage(protection.message || '');
    }
  }, [protection]);

  const updateProtectionMutation = trpc.siteProtection.updateSettings.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث إعدادات الحماية بنجاح');
      refetchProtection();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const createUserMutation = trpc.siteProtection.createAccessUser.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المستخدم بنجاح');
      setIsDialogOpen(false);
      setForm(defaultForm);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateUserMutation = trpc.siteProtection.updateAccessUser.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث المستخدم بنجاح');
      setIsDialogOpen(false);
      setForm(defaultForm);
      setEditingId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteUserMutation = trpc.siteProtection.deleteAccessUser.useMutation({
    onSuccess: () => {
      toast.success('تم حذف المستخدم بنجاح');
      setDeleteId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSaveProtection = () => {
    updateProtectionMutation.mutate({
      isEnabled: protectionEnabled,
      message: protectionMessage,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.username) {
      toast.error('اسم المستخدم مطلوب');
      return;
    }

    if (!editingId && !form.password) {
      toast.error('كلمة المرور مطلوبة');
      return;
    }

    if (editingId) {
      updateUserMutation.mutate({
        id: editingId,
        ...form,
        password: form.password || undefined,
      });
    } else {
      createUserMutation.mutate(form);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      password: '',
      name: user.name || '',
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteUserMutation.mutate({ id: deleteId });
    }
  };

  const openNewDialog = () => {
    setEditingId(null);
    setForm(defaultForm);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">حماية الموقع</h1>
          <p className="text-stone-500 mt-1">تأمين الموقع بكلمة مرور وإدارة المستخدمين المصرح لهم</p>
        </div>

        {/* Protection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إعدادات الحماية
            </CardTitle>
            <CardDescription>
              عند تفعيل الحماية، لن يتمكن أي شخص من تصفح الموقع إلا بإدخال اسم مستخدم وكلمة مرور
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
              <div className="flex items-center gap-3">
                {protectionEnabled ? (
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                ) : (
                  <ShieldOff className="h-8 w-8 text-stone-400" />
                )}
                <div>
                  <p className="font-medium text-stone-900">
                    {protectionEnabled ? 'الحماية مفعلة' : 'الحماية معطلة'}
                  </p>
                  <p className="text-sm text-stone-500">
                    {protectionEnabled 
                      ? 'الموقع محمي بكلمة مرور' 
                      : 'الموقع متاح للجميع'
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={protectionEnabled}
                onCheckedChange={setProtectionEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label>رسالة صفحة تسجيل الدخول (اختياري)</Label>
              <Textarea
                value={protectionMessage}
                onChange={(e) => setProtectionMessage(e.target.value)}
                placeholder="هذا الموقع محمي. يرجى تسجيل الدخول للمتابعة."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSaveProtection}
              className="bg-olive-700 hover:bg-olive-800"
              disabled={updateProtectionMutation.isPending}
            >
              {updateProtectionMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              حفظ الإعدادات
            </Button>
          </CardContent>
        </Card>

        {/* Access Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>المستخدمون المصرح لهم</CardTitle>
                <CardDescription>المستخدمون الذين يمكنهم الوصول للموقع عند تفعيل الحماية</CardDescription>
              </div>
              <Button onClick={openNewDialog} className="bg-olive-700 hover:bg-olive-800">
                <Plus className="h-4 w-4 mr-2" />
                إضافة مستخدم
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
              </div>
            ) : !accessUsers || accessUsers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  لا يوجد مستخدمين حتى الآن. قم بإضافة مستخدمين للسماح لهم بالوصول للموقع عند تفعيل الحماية.
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-stone-400" />
                          {user.username}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'نشط' : 'معطل'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteId(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'قم بتعديل بيانات المستخدم' : 'أدخل بيانات المستخدم الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المستخدم *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="username"
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {editingId ? 'كلمة المرور الجديدة (اتركها فارغة للإبقاء على القديمة)' : 'كلمة المرور *'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الاسم (اختياري)</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="الاسم الكامل"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>الحالة</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  className="bg-olive-700 hover:bg-olive-800"
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingId ? 'حفظ التعديلات' : 'إضافة'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف هذا المستخدم؟ لن يتمكن من الوصول للموقع بعد ذلك.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
