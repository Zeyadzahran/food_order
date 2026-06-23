import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('All fields are required');
      return;
    }

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch {
      // Error is handled in store
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      {/* Left Branding Panel */}
      <div className="hidden md:flex md:w-1/2 bg-primary-900 text-primary-50 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract graphic */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <h1 className="font-display font-black text-4xl tracking-tighter text-accent uppercase mb-2">CRAVE</h1>
          <p className="font-display text-xl font-bold tracking-wide text-primary-200">Editorial Street Food</p>
        </div>

        <div className="relative z-10 mt-auto">
          <h2 className="heading-xl text-white mb-6">
            Bite into <br/> something <br/> <span className="text-primary-400">extraordinary.</span>
          </h2>
          <p className="font-body text-lg text-primary-200 max-w-sm">
            Sign in to start craving, tracking orders, and securing the freshest meals in town.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-surface-50">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h1 className="heading-lg text-surface-900 mb-2">{t('auth.welcome_back')}</h1>
            <p className="font-body text-surface-500">{t('auth.login_subtitle')}</p>
          </div>

          {(error || validationError) && (
            <div className="mb-6 p-4 bg-accent/10 border-l-4 border-accent text-accent font-body font-medium">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 shadow-solid hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              isLoading={isLoading}
            >
              {t('auth.log_in')}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-surface-200 text-center md:text-left font-body font-medium text-surface-600">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 underline decoration-2 underline-offset-4">
              {t('auth.register_now')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
