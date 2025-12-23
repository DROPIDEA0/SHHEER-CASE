import { useState } from "react";
import { trpc } from "../../lib/trpc";
import AdminLayout from "../../components/admin/AdminLayout";
import { Facebook, Twitter, Instagram, Music, Camera, Save, Eye, EyeOff } from "lucide-react";

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Music,
  snapchat: Camera,
};

const platformNames = {
  facebook: "Facebook",
  twitter: "Twitter (X)",
  instagram: "Instagram",
  tiktok: "TikTok",
  snapchat: "Snapchat",
};

const platformColors = {
  facebook: "bg-blue-600",
  twitter: "bg-black",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  tiktok: "bg-black",
  snapchat: "bg-yellow-400",
};

export default function SocialMediaAdmin() {
  const { data: socialMediaLinks, isLoading, refetch } = trpc.admin.getSocialMediaLinks.useQuery();
  const updateMutation = trpc.admin.updateSocialMediaLink.useMutation();
  
  const [editingLinks, setEditingLinks] = useState<Record<number, string>>({});
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  const handleUrlChange = (id: number, url: string) => {
    setEditingLinks(prev => ({ ...prev, [id]: url }));
  };

  const handleSave = async (id: number) => {
    const url = editingLinks[id];
    if (!url) return;

    setSavingIds(prev => new Set(prev).add(id));
    try {
      await updateMutation.mutateAsync({ id, url });
      await refetch();
      setEditingLinks(prev => {
        const newLinks = { ...prev };
        delete newLinks[id];
        return newLinks;
      });
    } catch (error) {
      console.error("Failed to update social media link:", error);
      alert("Failed to update link");
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleToggleActive = async (id: number, currentState: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, isActive: !currentState });
      await refetch();
    } catch (error) {
      console.error("Failed to toggle social media:", error);
      alert("Failed to toggle social media");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media Links</h1>
          <p className="text-gray-600">Manage social media links displayed in the website footer</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {socialMediaLinks?.map((link) => {
              const Icon = platformIcons[link.platform as keyof typeof platformIcons];
              const platformName = platformNames[link.platform as keyof typeof platformNames];
              const platformColor = platformColors[link.platform as keyof typeof platformColors];
              const isEditing = link.id in editingLinks;
              const isSaving = savingIds.has(link.id);
              const currentUrl = isEditing ? editingLinks[link.id] : link.url;

              return (
                <div key={link.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Platform Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${platformColor} flex items-center justify-center text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{platformName}</h3>
                        
                        {/* Active/Inactive Toggle */}
                        <button
                          onClick={() => handleToggleActive(link.id, link.isActive)}
                          disabled={isSaving}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            link.isActive
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          } disabled:opacity-50`}
                        >
                          {link.isActive ? (
                            <>
                              <Eye className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Inactive
                            </>
                          )}
                        </button>
                      </div>

                      {/* URL Input */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={currentUrl || ""}
                          onChange={(e) => handleUrlChange(link.id, e.target.value)}
                          placeholder={`https://${link.platform}.com/yourprofile`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleSave(link.id)}
                          disabled={isSaving || !isEditing}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                      </div>

                      {/* Help Text */}
                      <p className="mt-2 text-sm text-gray-500">
                        Enter your {platformName} profile URL
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Only active social media links will be displayed in the footer</li>
            <li>Make sure to enter complete URLs (including https://)</li>
            <li>Links will appear in the order shown above</li>
            <li>Click the Active/Inactive button to show or hide each platform</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
