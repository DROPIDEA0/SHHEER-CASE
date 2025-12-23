import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Video, Play, ExternalLink, Copy, Upload, Link, Loader2 } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: string | null;
  displayOrder: number | null;
  isActive: boolean | null;
}

export default function VideosAdmin() {
  const { data: videos, isLoading, refetch } = trpc.admin.getVideos.useQuery();
  const createMutation = trpc.admin.createVideo.useMutation();
  const updateMutation = trpc.admin.updateVideo.useMutation();
  const deleteMutation = trpc.admin.deleteVideo.useMutation();
  const uploadVideoMutation = trpc.admin.uploadVideo.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    displayOrder: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '',
      displayOrder: 0,
      isActive: true,
    });
    setEditingVideo(null);
    setUploadMethod('url');
    setIsUploading(false);
    setUploadProgress(0);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (video: VideoItem) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration || '',
      displayOrder: video.displayOrder || 0,
      isActive: video.isActive ?? true,
    });
    setUploadMethod('url');
    setIsDialogOpen(true);
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, WebM, OGG, or MOV)');
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Video file size must be less than 500MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          setUploadProgress(30);
          const base64Data = (reader.result as string).split(',')[1];
          
          setUploadProgress(50);
          const result = await uploadVideoMutation.mutateAsync({
            fileName: file.name,
            fileData: base64Data,
            contentType: file.type,
          });
          
          setUploadProgress(100);
          setFormData({ ...formData, videoUrl: result.url });
          toast.success('Video uploaded successfully!');
          setIsUploading(false);
        } catch (error: any) {
          console.error('Video upload error:', error);
          toast.error(error?.message || 'Failed to upload video to server');
          setIsUploading(false);
          setUploadProgress(0);
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read video file');
        setIsUploading(false);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('File read error:', error);
      toast.error('Failed to process video file');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image file size must be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const result = await uploadVideoMutation.mutateAsync({
          fileName: `thumbnail-${file.name}`,
          fileData: base64Data,
          contentType: file.type,
        });
        
        setFormData({ ...formData, thumbnailUrl: result.url });
        toast.success('Thumbnail uploaded successfully!');
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    }
  };

  const handleSave = async () => {
    if (!formData.videoUrl) {
      toast.error('Video URL is required');
      return;
    }
    try {
      if (editingVideo) {
        await updateMutation.mutateAsync({
          id: editingVideo.id,
          data: formData,
        });
        toast.success('Video updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Video created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Failed to save video');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Video deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete video');
    }
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
            <h1 className="text-2xl font-bold text-stone-900">Videos Management</h1>
            <p className="text-stone-600 mt-1">Manage case presentation videos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Video title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Video description"
                    rows={3}
                  />
                </div>

                {/* Video Source Selection */}
                <div className="space-y-2">
                  <Label>Video Source *</Label>
                  <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'url' | 'upload')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        URL / Link
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="mt-3">
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://..."
                      />
                      <p className="text-xs text-stone-500 mt-1">Direct video URL (MP4, WebM) or YouTube/Vimeo link</p>
                    </TabsContent>
                    
                    <TabsContent value="upload" className="mt-3">
                      <div className="space-y-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleVideoUpload}
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-24 border-dashed"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-6 w-6 animate-spin" />
                              <span>Uploading... {uploadProgress}%</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-6 w-6" />
                              <span>Click to upload video</span>
                              <span className="text-xs text-stone-400">MP4, WebM, OGG, MOV (max 500MB)</span>
                            </div>
                          )}
                        </Button>
                        
                        {formData.videoUrl && uploadMethod === 'upload' && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                            ✓ Video uploaded successfully
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {formData.videoUrl && (
                    <div className="mt-2 p-2 bg-stone-50 rounded text-xs">
                      <span className="text-stone-500">Current URL: </span>
                      <span className="text-stone-700 break-all">{formData.videoUrl}</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://... or upload"
                      className="flex-1"
                    />
                    <input
                      type="file"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailUpload}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.thumbnailUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.thumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="h-20 w-auto rounded border"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="5:30"
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
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
                    {editingVideo ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Videos Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Videos ({videos?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {videos && videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Video Preview */}
                    <div className="aspect-video bg-stone-900 relative">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="h-8 w-8 text-stone-900 ml-1" />
                        </div>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-stone-900">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-stone-500 line-clamp-2 mt-1">{video.description}</p>
                      )}
                      {/* Video URL Display */}
                      <div className="mt-3 p-2 bg-stone-50 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500 flex-shrink-0">URL:</span>
                          <a 
                            href={video.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline truncate flex-1"
                          >
                            {video.videoUrl}
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(video.videoUrl);
                              toast.success('URL copied!');
                            }}
                            className="text-stone-400 hover:text-stone-600 flex-shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <a 
                            href={video.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 flex-shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <a 
                          href={video.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" /> Watch Video
                        </a>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(video as VideoItem)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-500">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No videos yet</p>
                <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
