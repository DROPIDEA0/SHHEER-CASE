import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

// Session timeout: 15 minutes (in milliseconds)
const SESSION_TIMEOUT = 15 * 60 * 1000;

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const { data: user, isLoading } = trpc.adminAuth.me.useQuery();
  const logoutMutation = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      setLocation('/admin/login');
    },
  });

  // Update last activity time on user interaction
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check for session timeout
  useEffect(() => {
    const checkTimeout = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= SESSION_TIMEOUT && user) {
        // Session expired - auto logout
        console.log('[AdminProtectedRoute] Session timeout - logging out');
        logoutMutation.mutate();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTimeout);
  }, [lastActivity, user, logoutMutation]);

  // Add event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [updateActivity]);

  // Check authentication status
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not authenticated - redirect to login
        setLocation('/admin/login');
      } else {
        // Authenticated - allow access
        setIsChecking(false);
      }
    }
  }, [user, isLoading, setLocation]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#722f37] mx-auto mb-4" />
          <p className="text-stone-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
