import AdminLayout from '@/components/admin/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FolderOpen, Video, Users, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  const statCards = [
    { 
      title: 'Timeline Events', 
      value: stats?.timelineCount || 0, 
      icon: Clock, 
      href: '/admin/timeline',
      color: 'bg-blue-500'
    },
    { 
      title: 'Evidence Items', 
      value: stats?.evidenceCount || 0, 
      icon: FolderOpen, 
      href: '/admin/evidence',
      color: 'bg-green-500'
    },
    { 
      title: 'Videos', 
      value: stats?.videoCount || 0, 
      icon: Video, 
      href: '/admin/videos',
      color: 'bg-purple-500'
    },
    { 
      title: 'Case Parties', 
      value: stats?.partyCount || 0, 
      icon: Users, 
      href: '/admin/parties',
      color: 'bg-orange-500'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-stone-600 mt-1">
            Welcome to SHHEER Case Admin Panel. Manage all website content from here.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                )}
                <Link href={stat.href}>
                  <Button variant="link" className="p-0 h-auto mt-2 text-olive-700">
                    Manage <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/timeline">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Clock className="h-5 w-5 mr-3 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Add Timeline Event</div>
                    <div className="text-xs text-stone-500">Create new chronological event</div>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/evidence">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <FolderOpen className="h-5 w-5 mr-3 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Upload Evidence</div>
                    <div className="text-xs text-stone-500">Add documents or images</div>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/hero">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Video className="h-5 w-5 mr-3 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Edit Hero Section</div>
                    <div className="text-xs text-stone-500">Update main landing content</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Website Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Header & Navigation', href: '/admin/header', status: 'Configured' },
                { name: 'Hero Section', href: '/admin/hero', status: 'Configured' },
                { name: 'Case Overview', href: '/admin/parties', status: 'Configured' },
                { name: 'Timeline', href: '/admin/timeline', status: `${stats?.timelineCount || 0} events` },
                { name: 'Evidence Gallery', href: '/admin/evidence', status: `${stats?.evidenceCount || 0} items` },
                { name: 'Video Section', href: '/admin/videos', status: `${stats?.videoCount || 0} videos` },
                { name: 'Footer', href: '/admin/footer', status: 'Configured' },
              ].map((section) => (
                <Link key={section.name} href={section.href}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors">
                    <span className="font-medium text-stone-700">{section.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-500">{section.status}</span>
                      <ArrowRight className="h-4 w-4 text-stone-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help & Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Managing Timeline</h4>
                <p className="text-sm text-blue-700">
                  Add events with dates, descriptions, and link them to evidence items for a complete case narrative.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-1">Uploading Evidence</h4>
                <p className="text-sm text-green-700">
                  Upload images, documents, and screenshots. Categorize them for easy filtering on the public site.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-medium text-purple-800 mb-1">Content Updates</h4>
                <p className="text-sm text-purple-700">
                  All changes are saved automatically. The public website updates in real-time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
