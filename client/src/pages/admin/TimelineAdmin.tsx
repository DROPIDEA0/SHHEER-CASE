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
import { Plus, Pencil, Trash2, Clock, Calendar, Link2, X, FileText, Tag, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'wouter';

// Default categories (fallback if no dynamic categories exist)
const defaultCategories = [
  { value: 'foundation', label: 'Foundation', color: '#5d6d4e' },
  { value: 'investment_deal', label: 'Investment Deal', color: '#c4a35a' },
  { value: 'swift_operations', label: 'SWIFT Operations', color: '#3b82f6' },
  { value: 'critical_failure', label: 'Critical Failure', color: '#722f37' },
  { value: 'legal_proceedings', label: 'Legal Proceedings', color: '#9333ea' },
];

type Category = string;

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
  const { data: dynamicCategories } = trpc.admin.getTimelineCategories.useQuery();
  const { data: allEvidence } = trpc.admin.getEvidenceItems.useQuery();
  
  const createMutation = trpc.admin.createTimelineEvent.useMutation();
  const updateMutation = trpc.admin.updateTimelineEvent.useMutation();
  const deleteMutation = trpc.admin.deleteTimelineEvent.useMutation();
  const addEvidenceMutation = trpc.admin.addEvidenceToEvent.useMutation();
  const removeEvidenceMutation = trpc.admin.removeEvidenceFromEvent.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false);
  const [selectedEventForEvidence, setSelectedEventForEvidence] = useState<TimelineEvent | null>(null);
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

  // Use dynamic categories if available, otherwise use defaults
  const categories = dynamicCategories && dynamicCategories.length > 0
    ? dynamicCategories.map(c => ({ value: c.key, label: c.label, color: c.color || '#5d6d4e' }))
    : defaultCategories;

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

  const openEvidenceDialog = (event: TimelineEvent) => {
    setSelectedEventForEvidence(event);
    setIsEvidenceDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingEvent) {
        await updateMutation.mutateAsync({
          id: editingEvent.id,
          data: formData as any,
        });
        toast.success('Event updated successfully');
      } else {
        await createMutation.mutateAsync(formData as any);
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

  const handleAddEvidence = async (evidenceId: number) => {
    if (!selectedEventForEvidence) return;
    try {
      await addEvidenceMutation.mutateAsync({
        eventId: selectedEventForEvidence.id,
        evidenceId,
        displayOrder: 0,
      });
      toast.success('Evidence linked to event');
    } catch (error) {
      toast.error('Failed to link evidence');
    }
  };

  const handleRemoveEvidence = async (evidenceId: number) => {
    if (!selectedEventForEvidence) return;
    try {
      await removeEvidenceMutation.mutateAsync({
        eventId: selectedEventForEvidence.id,
        evidenceId,
      });
      toast.success('Evidence unlinked from event');
    } catch (error) {
      toast.error('Failed to unlink evidence');
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.value === category);
    if (!cat) return null;
    return (
      <Badge 
        className="text-white" 
        style={{ backgroundColor: cat.color }}
      >
        {cat.label}
      </Badge>
    );
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
            <p className="text-stone-600 mt-1">Manage chronological case events with attached evidence</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/timeline-categories">
              <Button variant="outline">
                <Tag className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
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
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.label}
                            </div>
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
                    <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="bg-[#5d6d4e] hover:bg-[#5d6d4e]/90">
                      {editingEvent ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                        variant="outline"
                        size="sm"
                        onClick={() => openEvidenceDialog(event as TimelineEvent)}
                        className="text-[#5d6d4e] border-[#5d6d4e]/30"
                      >
                        <Link2 className="h-4 w-4 mr-1" />
                        Evidence
                      </Button>
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

        {/* Evidence Linking Dialog */}
        <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Link Evidence to: {selectedEventForEvidence?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-stone-600">
                Select evidence items to attach to this timeline event. They will appear with View/Download buttons on the public site.
              </p>
              
              {allEvidence && allEvidence.length > 0 ? (
                <div className="grid gap-3">
                  {allEvidence.map((evidence) => (
                    <EvidenceLinkItem
                      key={evidence.id}
                      evidence={evidence}
                      eventId={selectedEventForEvidence?.id || 0}
                      onAdd={() => handleAddEvidence(evidence.id)}
                      onRemove={() => handleRemoveEvidence(evidence.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-stone-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No evidence items available</p>
                  <Link href="/admin/evidence">
                    <Button variant="outline" className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Evidence First
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// Sub-component for evidence linking
function EvidenceLinkItem({ evidence, eventId, onAdd, onRemove }: {
  evidence: any;
  eventId: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const { data: linkedEvidence } = trpc.admin.getEventEvidence.useQuery({ eventId }, { enabled: eventId > 0 });
  const isLinked = linkedEvidence?.some(e => e.id === evidence.id);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isLinked ? 'border-[#5d6d4e] bg-[#5d6d4e]/5' : 'border-stone-200'}`}>
      <Checkbox
        checked={isLinked}
        onCheckedChange={(checked) => {
          if (checked) {
            onAdd();
          } else {
            onRemove();
          }
        }}
      />
      {evidence.thumbnailUrl && (
        <img src={evidence.thumbnailUrl} alt="" className="w-12 h-12 object-cover rounded" />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-stone-900 truncate">{evidence.title}</h4>
        <p className="text-xs text-stone-500">{evidence.category}</p>
      </div>
      {evidence.fileUrl && (
        <a href={evidence.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#5d6d4e] hover:underline">
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
