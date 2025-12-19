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
import { Plus, Pencil, Trash2, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categories = [
  { value: 'foundation', label: 'Foundation', color: 'bg-blue-100 text-blue-800' },
  { value: 'investment_deal', label: 'Investment Deal', color: 'bg-green-100 text-green-800' },
  { value: 'swift_operations', label: 'SWIFT Operations', color: 'bg-purple-100 text-purple-800' },
  { value: 'critical_failure', label: 'Critical Failure', color: 'bg-red-100 text-red-800' },
  { value: 'legal_proceedings', label: 'Legal Proceedings', color: 'bg-orange-100 text-orange-800' },
];

type Category = 'foundation' | 'investment_deal' | 'swift_operations' | 'critical_failure' | 'legal_proceedings';

interface TimelineEvent {
  id: number;
  date: string;
  time: string | null;
  title: string;
  description: string | null;
  category: Category;
  displayOrder: number | null;
  isActive: boolean | null;
}

export default function TimelineAdmin() {
  const { data: events, isLoading, refetch } = trpc.admin.getTimelineEvents.useQuery();
  const createMutation = trpc.admin.createTimelineEvent.useMutation();
  const updateMutation = trpc.admin.updateTimelineEvent.useMutation();
  const deleteMutation = trpc.admin.deleteTimelineEvent.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    title: '',
    description: '',
    category: 'foundation' as Category,
    displayOrder: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      title: '',
      description: '',
      category: 'foundation',
      displayOrder: 0,
      isActive: true,
    });
    setEditingEvent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      time: event.time || '',
      title: event.title,
      description: event.description || '',
      category: event.category,
      displayOrder: event.displayOrder || 0,
      isActive: event.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingEvent) {
        await updateMutation.mutateAsync({
          id: editingEvent.id,
          data: formData,
        });
        toast.success('Event updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Event created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Event deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? <Badge className={cat.color}>{cat.label}</Badge> : null;
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
            <h1 className="text-2xl font-bold text-stone-900">Timeline Events</h1>
            <p className="text-stone-600 mt-1">Manage chronological case events</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time (Optional)</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {editingEvent ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>All Events ({events?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {events && events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-24 text-center">
                      <div className="flex items-center justify-center gap-1 text-stone-500 text-sm">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </div>
                      {event.time && (
                        <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-stone-900 truncate">{event.title}</h3>
                        {getCategoryBadge(event.category)}
                      </div>
                      {event.description && (
                        <p className="text-sm text-stone-600 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(event as TimelineEvent)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No timeline events yet</p>
                <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
