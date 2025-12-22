import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import SiteLogin from "../pages/SiteLogin";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [needsAuth, setNeedsAuth] = useState(true);
  
  const { data: settings } = trpc.siteProtection.getSettings.useQuery();
  const { data: accessCheck, refetch: refetchAccess, isLoading: accessLoading } = trpc.siteProtection.checkAccess.useQuery();

  useEffect(() => {
    console.log('[ProtectedRoute] useEffect triggered', { 
      accessCheck, 
      accessLoading,
      protectionEnabled: settings?.protectionEnabled 
    });
    
    if (!settings?.protectionEnabled) {
      console.log('[ProtectedRoute] Protection disabled, allowing access');
      setNeedsAuth(false);
      return;
    }

    if (accessCheck?.hasAccess) {
      console.log('[ProtectedRoute] Has access, allowing entry');
      setNeedsAuth(false);
    } else if (!accessLoading) {
      console.log('[ProtectedRoute] No access, showing login');
      setNeedsAuth(true);
    }
  }, [accessCheck, accessLoading, settings]);

  const handleLoginSuccess = async () => {
    console.log('[ProtectedRoute] Login successful, refetching access after delay');
    
    // Wait for cookie to be set properly
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await refetchAccess();
    console.log('[ProtectedRoute] Refetch result:', result.data);
    
    if (result.data?.hasAccess) {
      console.log('[ProtectedRoute] Access granted after refetch');
      setNeedsAuth(false);
    } else {
      console.log('[ProtectedRoute] Still no access after refetch, reloading page');
      // Force page reload to ensure cookie is properly set
      window.location.reload();
    }
  };

  if (!settings?.protectionEnabled) {
    return <>{children}</>;
  }

  if (needsAuth) {
    return (
      <SiteLogin 
        message={settings?.message}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return <>{children}</>;
}
