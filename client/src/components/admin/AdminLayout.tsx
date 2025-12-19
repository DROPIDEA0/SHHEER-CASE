import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Clock, 
  FolderOpen, 
  Video, 
  Users, 
  PanelTop,
  PanelBottom,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/header', label: 'Header', icon: PanelTop },
  { href: '/admin/hero', label: 'Hero Section', icon: FileText },
  { href: '/admin/parties', label: 'Case Parties', icon: Users },
  { href: '/admin/timeline', label: 'Timeline Events', icon: Clock },
  { href: '/admin/evidence', label: 'Evidence', icon: FolderOpen },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/footer', label: 'Footer', icon: PanelBottom },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-semibold text-olive-800">Admin Panel</span>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="h-4 w-4 mr-2" />
            View Site
          </Button>
        </Link>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-stone-200 transition-transform duration-300",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-stone-200 bg-gradient-to-r from-olive-700 to-olive-800">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
          <span className="font-serif text-lg text-white">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== '/admin' && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer",
                    isActive 
                      ? "bg-olive-100 text-olive-800 font-medium" 
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-olive-700")} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-olive-200 flex items-center justify-center">
              <span className="text-olive-800 font-medium text-sm">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-stone-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Home className="h-4 w-4 mr-1" />
                Site
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
