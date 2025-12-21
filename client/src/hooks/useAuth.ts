import { trpc } from '@/lib/trpc';

export function useAuth() {
  // Try OAuth auth first
  const { data: oauthUser, isLoading: oauthLoading, refetch: refetchOAuth } = trpc.auth.me.useQuery();
  // Also check local admin auth
  const { data: adminUser, isLoading: adminLoading, refetch: refetchAdmin } = trpc.adminAuth.me.useQuery();
  
  const logoutMutation = trpc.auth.logout.useMutation();
  const adminLogoutMutation = trpc.adminAuth.logout.useMutation();

  // Use admin user if available, otherwise use OAuth user
  const user = adminUser || oauthUser;
  const isLoading = oauthLoading || adminLoading;

  const logout = async () => {
    // Logout from both systems
    if (adminUser) {
      await adminLogoutMutation.mutateAsync();
    }
    if (oauthUser) {
      await logoutMutation.mutateAsync();
    }
    await refetchOAuth();
    await refetchAdmin();
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const refetch = async () => {
    await refetchOAuth();
    await refetchAdmin();
  };

  return {
    user,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    logout,
    refetch,
  };
}
