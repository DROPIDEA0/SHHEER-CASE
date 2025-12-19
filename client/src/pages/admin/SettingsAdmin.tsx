import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Settings } from 'lucide-react';

interface Setting {
  id: number;
  key: string;
  value: string | null;
  type: string;
}

export default function SettingsAdmin() {
  const { data: settings, isLoading, refetch } = trpc.admin.getSiteSettings.useQuery();
  const upsertMutation = trpc.admin.upsertSiteSetting.useMutation();

  const [newSetting, setNewSetting] = useState({ key: '', value: '', type: 'text' });

  const handleSaveSetting = async (key: string, value: string, type: string = 'text') => {
    try {
      await upsertMutation.mutateAsync({ key, value, type });
      toast.success('Setting saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save setting');
    }
  };

  const handleAddNewSetting = async () => {
    if (!newSetting.key) {
      toast.error('Setting key is required');
      return;
    }
    await handleSaveSetting(newSetting.key, newSetting.value, newSetting.type);
    setNewSetting({ key: '', value: '', type: 'text' });
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

  // Group settings by common prefixes
  const groupedSettings: Record<string, Setting[]> = {};
  settings?.forEach((setting) => {
    const prefix = setting.key.split('_')[0] || 'general';
    if (!groupedSettings[prefix]) {
      groupedSettings[prefix] = [];
    }
    groupedSettings[prefix].push(setting as Setting);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Site Settings</h1>
          <p className="text-stone-600 mt-1">Manage general website configuration</p>
        </div>

        {/* Add New Setting */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Setting</CardTitle>
            <CardDescription>Create a new configuration key-value pair</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="newKey">Key</Label>
                <Input
                  id="newKey"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  placeholder="setting_key"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="newValue">Value</Label>
                <Input
                  id="newValue"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                  placeholder="Setting value"
                />
              </div>
              <Button onClick={handleAddNewSetting} disabled={upsertMutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Settings */}
        {settings && settings.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Current Settings ({settings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.map((setting) => (
                  <SettingRow
                    key={setting.id}
                    setting={setting as Setting}
                    onSave={handleSaveSetting}
                    isPending={upsertMutation.isPending}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-stone-500">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No settings configured yet</p>
                <p className="text-sm mt-1">Add your first setting above</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Settings Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Settings</CardTitle>
            <CardDescription>Common settings you might want to configure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'site_title', description: 'Website title shown in browser tab' },
                { key: 'site_description', description: 'Meta description for SEO' },
                { key: 'analytics_id', description: 'Google Analytics tracking ID' },
                { key: 'contact_email', description: 'Primary contact email address' },
                { key: 'social_twitter', description: 'Twitter/X profile URL' },
                { key: 'social_linkedin', description: 'LinkedIn profile URL' },
              ].map((suggestion) => {
                const exists = settings?.some(s => s.key === suggestion.key);
                return (
                  <div
                    key={suggestion.key}
                    className={`p-4 rounded-lg border ${exists ? 'bg-green-50 border-green-200' : 'bg-stone-50 border-stone-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded">{suggestion.key}</code>
                        <p className="text-xs text-stone-500 mt-1">{suggestion.description}</p>
                      </div>
                      {exists ? (
                        <span className="text-xs text-green-600 font-medium">Configured</span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewSetting({ ...newSetting, key: suggestion.key })}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
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
  setting: Setting; 
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
        <p className="text-xs text-stone-400 mt-1">Type: {setting.type}</p>
      </div>
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsEditing(true);
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
