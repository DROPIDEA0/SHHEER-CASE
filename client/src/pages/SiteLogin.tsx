import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, User, AlertCircle, Shield } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface SiteLoginProps {
  message?: string;
  onSuccess: () => void;
}

export default function SiteLogin({ message, onSuccess }: SiteLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.siteProtection.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'فشل تسجيل الدخول');
      }
      setIsLoading(false);
    },
    onError: (err) => {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsLoading(true);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] p-4 rounded-xl">
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-[#722f37]" />
              <CardTitle className="text-xl font-bold text-stone-800">
                موقع محمي
              </CardTitle>
            </div>
            <CardDescription className="text-stone-500">
              {message || 'يرجى تسجيل الدخول للوصول إلى هذا الموقع'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-stone-700">
                اسم المستخدم
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-700">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  dir="ltr"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#722f37] hover:bg-[#8b3a44]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          {/* Footer Credit */}
          <div className="mt-6 pt-4 border-t border-stone-200">
            <p className="text-center text-xs text-stone-400">
              الدعم التقني والتصميم من قبل شركة{' '}
              <a 
                href="https://dropidea.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#722f37] hover:text-[#8b3a44] font-medium"
              >
                دروب أيديا
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
