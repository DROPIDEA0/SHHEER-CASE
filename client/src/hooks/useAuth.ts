import { trpc } from '@/lib/trpc';

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const logout = async () => {
    await logoutMutation.mutateAsync();
    await refetch();
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    logout,
    refetch,
  };
}
