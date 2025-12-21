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
import { Plus, Pencil, Trash2, UserCog, Shield, Eye, Edit3, AlertCircle, Loader2, User, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800', icon: <Shield className="h-3 w-3" /> },
  admin: { label: 'Admin', color: 'bg-orange-100 text-orange-800', icon: <UserCog className="h-3 w-3" /> },
  editor: { label: 'Editor', color: 'bg-blue-100 text-blue-800', icon: <Edit3 className="h-3 w-3" /> },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-800', icon: <Eye className="h-3 w-3" /> },
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
      toast.success('User created successfully');
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
      toast.success('User updated successfully');
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
      toast.success('User deleted successfully');
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
      toast.error('Username is required');
      return;
    }

    if (!editingId && !form.password) {
      toast.error('Password is required');
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...form,
        password: form.password || undefined,
      });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      password: '',
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
            <h1 className="text-2xl font-bold text-stone-900">Admin Users Management</h1>
            <p className="text-stone-500 mt-1">Manage admin panel users and their permissions</p>
          </div>
          <Button onClick={openNewDialog} className="bg-olive-700 hover:bg-olive-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Admin User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users List</CardTitle>
            <CardDescription>All users with access to the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
              </div>
            ) : !adminUsers || adminUsers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No admin users found. Add a new admin user to get started.</AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-stone-400" />
                          {user.username}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>
                        <Badge className={roleLabels[user.role]?.color || 'bg-gray-100'}>
                          {roleLabels[user.role]?.icon}
                          <span className="ml-1">{roleLabels[user.role]?.label || user.role}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('en-US')
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
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
              <DialogTitle>{editingId ? 'Edit Admin User' : 'Add New Admin User'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update the admin user details' : 'Enter the new admin user details'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="admin"
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{editingId ? 'New Password (leave empty to keep current)' : 'Password *'}</Label>
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
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value: any) => setForm({ ...form, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin - Full Access</SelectItem>
                    <SelectItem value="admin">Admin - All except user management</SelectItem>
                    <SelectItem value="editor">Editor - Content editing only</SelectItem>
                    <SelectItem value="viewer">Viewer - Read only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Active Status</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-olive-700 hover:bg-olive-800"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingId ? 'Save Changes' : 'Add User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this admin user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
