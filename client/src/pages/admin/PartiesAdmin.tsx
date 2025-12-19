import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Users, User, Building, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const partyTypes = [
  { value: 'plaintiff', label: 'Plaintiff', color: 'bg-green-100 text-green-800', icon: User },
  { value: 'defendant', label: 'Defendant', color: 'bg-red-100 text-red-800', icon: Building },
  { value: 'third_party', label: 'Third Party', color: 'bg-blue-100 text-blue-800', icon: Globe },
];

type PartyType = 'plaintiff' | 'defendant' | 'third_party';

interface Party {
  id: number;
  partyType: PartyType;
  name: string;
  label: string | null;
  representative: string | null;
  role: string | null;
  additionalInfo: string | null;
  displayOrder: number | null;
}

export default function PartiesAdmin() {
  const { data: parties, isLoading, refetch } = trpc.admin.getOverviewParties.useQuery();
  const createMutation = trpc.admin.createOverviewParty.useMutation();
  const updateMutation = trpc.admin.updateOverviewParty.useMutation();
  const deleteMutation = trpc.admin.deleteOverviewParty.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [formData, setFormData] = useState({
    partyType: 'plaintiff' as PartyType,
    name: '',
    label: '',
    representative: '',
    role: '',
    additionalInfo: '',
    displayOrder: 0,
  });

  const resetForm = () => {
    setFormData({
      partyType: 'plaintiff',
      name: '',
      label: '',
      representative: '',
      role: '',
      additionalInfo: '',
      displayOrder: 0,
    });
    setEditingParty(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (party: Party) => {
    setEditingParty(party);
    setFormData({
      partyType: party.partyType,
      name: party.name,
      label: party.label || '',
      representative: party.representative || '',
      role: party.role || '',
      additionalInfo: party.additionalInfo || '',
      displayOrder: party.displayOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Party name is required');
      return;
    }
    try {
      if (editingParty) {
        await updateMutation.mutateAsync({
          id: editingParty.id,
          data: formData,
        });
        toast.success('Party updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Party created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Failed to save party');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this party?')) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Party deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete party');
    }
  };

  const getPartyTypeBadge = (type: string) => {
    const pt = partyTypes.find(p => p.value === type);
    return pt ? <Badge className={pt.color}>{pt.label}</Badge> : null;
  };

  const getPartyIcon = (type: string) => {
    const pt = partyTypes.find(p => p.value === type);
    return pt ? pt.icon : User;
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

  // Group parties by type
  const groupedParties = {
    plaintiff: parties?.filter(p => p.partyType === 'plaintiff') || [],
    defendant: parties?.filter(p => p.partyType === 'defendant') || [],
    third_party: parties?.filter(p => p.partyType === 'third_party') || [],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Case Parties</h1>
            <p className="text-stone-600 mt-1">Manage plaintiff, defendant, and third parties</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Party
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingParty ? 'Edit Party' : 'Add New Party'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="partyType">Party Type</Label>
                  <Select
                    value={formData.partyType}
                    onValueChange={(value) => setFormData({ ...formData, partyType: value as PartyType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {partyTypes.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Party name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Label/Title</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., The Plaintiff, The Defendant"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representative">Representative</Label>
                  <Input
                    id="representative"
                    value={formData.representative}
                    onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                    placeholder="Legal representative name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role/Description</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Role in the case"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Any additional details"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingParty ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Parties by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {partyTypes.map((pt) => {
            const Icon = pt.icon;
            const partyList = groupedParties[pt.value as keyof typeof groupedParties];
            return (
              <Card key={pt.value}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {pt.label}s ({partyList.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {partyList.length > 0 ? (
                    <div className="space-y-3">
                      {partyList.map((party) => (
                        <div
                          key={party.id}
                          className="p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-stone-900">{party.name}</h4>
                              {party.label && (
                                <p className="text-sm text-stone-500">{party.label}</p>
                              )}
                              {party.representative && (
                                <p className="text-xs text-stone-400 mt-1">Rep: {party.representative}</p>
                              )}
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => openEditDialog(party as Party)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(party.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-400">
                      <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No {pt.label.toLowerCase()}s added</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All Parties Table */}
        {parties && parties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Parties ({parties.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-stone-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-stone-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-stone-600">Representative</th>
                      <th className="text-left py-3 px-4 font-medium text-stone-600">Role</th>
                      <th className="text-right py-3 px-4 font-medium text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parties.map((party) => (
                      <tr key={party.id} className="border-b hover:bg-stone-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{party.name}</div>
                            {party.label && <div className="text-sm text-stone-500">{party.label}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4">{getPartyTypeBadge(party.partyType)}</td>
                        <td className="py-3 px-4 text-stone-600">{party.representative || '-'}</td>
                        <td className="py-3 px-4 text-stone-600">{party.role || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(party as Party)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(party.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
