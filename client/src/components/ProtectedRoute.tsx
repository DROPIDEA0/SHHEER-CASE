import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import SiteLogin from '@/pages/SiteLogin';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const { data: protection, isLoading: protectionLoading } = trpc.siteProtection.getSettings.useQuery();
  const { data: accessCheck, isLoading: accessLoading, refetch: refetchAccess } = trpc.siteProtection.checkAccess.useQuery();

  useEffect(() => {
    if (!protectionLoading && !accessLoading) {
      // If protection is not enabled, allow access
      if (!protection?.isEnabled) {
        setNeedsAuth(false);
        setIsChecking(false);
        return;
      }

      // If protection is enabled, check if user has access
      if (accessCheck?.hasAccess) {
        setNeedsAuth(false);
      } else {
        setNeedsAuth(true);
        setLoginMessage(protection.message || 'يرجى تسجيل الدخول للوصول إلى هذا الموقع');
      }
      setIsChecking(false);
    }
  }, [protection, accessCheck, protectionLoading, accessLoading]);

  const handleLoginSuccess = () => {
    refetchAccess();
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#722f37] mx-auto mb-4" />
          <p className="text-stone-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (needsAuth) {
    return <SiteLogin message={loginMessage} onSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
}
