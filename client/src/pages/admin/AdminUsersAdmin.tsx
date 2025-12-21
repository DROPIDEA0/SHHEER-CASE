import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, UserCog, Shield, Eye, Edit3, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin: { label: 'مدير عام', color: 'bg-red-100 text-red-800', icon: <Shield className="h-3 w-3" /> },
  admin: { label: 'مدير', color: 'bg-orange-100 text-orange-800', icon: <UserCog className="h-3 w-3" /> },
  editor: { label: 'محرر', color: 'bg-blue-100 text-blue-800', icon: <Edit3 className="h-3 w-3" /> },
  viewer: { label: 'مشاهد', color: 'bg-gray-100 text-gray-800', icon: <Eye className="h-3 w-3" /> },
};

interface AdminUserForm {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  isActive: boolean;
}

const defaultForm: AdminUserForm = {
  username: '',
  password: '',
  name: '',
  email: '',
  role: 'editor',
  isActive: true,
};

export default function AdminUsersAdmin() {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminUserForm>(defaultForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: adminUsers, isLoading, refetch } = trpc.adminAuth.getAdminUsers.useQuery();

  const createMutation = trpc.adminAuth.createAdminUser.useMutation({
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

  const updateMutation = trpc.adminAuth.updateAdminUser.useMutation({
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

  const deleteMutation = trpc.adminAuth.deleteAdminUser.useMutation({
    onSuccess: () => {
      toast.success('تم حذف المستخدم بنجاح');
      setDeleteId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

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
      updateMutation.mutate({
        id: editingId,
        ...form,
        password: form.password || undefined, // Only update password if provided
      });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      password: '', // Don't show password
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">إدارة المشرفين</h1>
            <p className="text-stone-500 mt-1">إدارة مستخدمي لوحة التحكم والصلاحيات</p>
          </div>
          <Button onClick={openNewDialog} className="bg-olive-700 hover:bg-olive-800">
            <Plus className="h-4 w-4 mr-2" />
            إضافة مشرف
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المشرفين</CardTitle>
            <CardDescription>جميع المستخدمين الذين لديهم صلاحية الوصول للوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
              </div>
            ) : !adminUsers || adminUsers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>لا يوجد مشرفين حتى الآن. قم بإضافة مشرف جديد.</AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>آخر دخول</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>
                        <Badge className={roleLabels[user.role]?.color || 'bg-gray-100'}>
                          {roleLabels[user.role]?.icon}
                          <span className="mr-1">{roleLabels[user.role]?.label || user.role}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'نشط' : 'معطل'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('ar-SA')
                          : 'لم يسجل دخول'
                        }
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

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل مشرف' : 'إضافة مشرف جديد'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'قم بتعديل بيانات المشرف' : 'أدخل بيانات المشرف الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المستخدم *</Label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>{editingId ? 'كلمة المرور الجديدة (اتركها فارغة للإبقاء على القديمة)' : 'كلمة المرور *'}</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="أحمد محمد"
                />
              </div>

              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>الدور</Label>
                <Select
                  value={form.role}
                  onValueChange={(value: any) => setForm({ ...form, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">مدير عام - جميع الصلاحيات</SelectItem>
                    <SelectItem value="admin">مدير - جميع الصلاحيات ما عدا إدارة المشرفين</SelectItem>
                    <SelectItem value="editor">محرر - تعديل المحتوى فقط</SelectItem>
                    <SelectItem value="viewer">مشاهد - عرض فقط</SelectItem>
                  </SelectContent>
                </Select>
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
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
                هل أنت متأكد من حذف هذا المشرف؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
