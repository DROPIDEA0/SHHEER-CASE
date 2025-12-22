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
      toast.success('Protection settings updated successfully');
      refetchProtection();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const createUserMutation = trpc.siteProtection.createAccessUser.useMutation({
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

  const updateUserMutation = trpc.siteProtection.updateAccessUser.useMutation({
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

  const deleteUserMutation = trpc.siteProtection.deleteAccessUser.useMutation({
    onSuccess: () => {
      toast.success('User deleted successfully');
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
      toast.error('Username is required');
      return;
    }

    if (!editingId && !form.password) {
      toast.error('Password is required');
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
          <h1 className="text-2xl font-bold text-stone-900">Site Protection</h1>
          <p className="text-stone-500 mt-1">Secure the site with password protection and manage authorized users</p>
        </div>

        {/* Protection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Protection Settings
            </CardTitle>
            <CardDescription>
              When protection is enabled, visitors must enter a username and password to access the site
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
                    {protectionEnabled ? 'Protection Enabled' : 'Protection Disabled'}
                  </p>
                  <p className="text-sm text-stone-500">
                    {protectionEnabled 
                      ? 'Site is password protected' 
                      : 'Site is publicly accessible'
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
              <Label>Login Page Message (Optional)</Label>
              <Textarea
                value={protectionMessage}
                onChange={(e) => setProtectionMessage(e.target.value)}
                placeholder="This site is protected. Please login to continue."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSaveProtection}
              className="bg-[#722f37] hover:bg-[#8b3a44] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              disabled={updateProtectionMutation.isPending}
            >
              {updateProtectionMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Access Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Authorized Users</CardTitle>
                <CardDescription>Users who can access the site when protection is enabled</CardDescription>
              </div>
              <Button onClick={openNewDialog} className="bg-[#722f37] hover:bg-[#8b3a44] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add User
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
                  No authorized users yet. Add users to allow them access when site protection is enabled.
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
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

        {/* Add/Edit User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update the user details' : 'Enter the new user details'}
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
                    placeholder="username"
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {editingId ? 'New Password (leave empty to keep current)' : 'Password *'}
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
                <Label>Name (Optional)</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                />
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
                  className="bg-[#722f37] hover:bg-[#8b3a44] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) && (
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
                Are you sure you want to delete this user? They will no longer be able to access the site.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
