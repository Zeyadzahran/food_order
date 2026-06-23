import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    clearError();
  }, [name, email, password, confirmPassword, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password });
      navigate(redirectTo, { replace: true });
    } catch {
      // Error is handled in store
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row-reverse -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      {/* Right Branding Panel (Reversed for visual variation vs login) */}
      <div className="hidden md:flex md:w-1/2 bg-surface-900 text-primary-50 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract graphic */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900 via-surface-900 to-surface-900 opacity-50"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary-500 rounded-lg rotate-45 opacity-20"></div>
        
        <div className="relative z-10 text-right">
          <h1 className="font-display font-black text-4xl tracking-tighter text-accent uppercase mb-2">CRAVE</h1>
          <p className="font-display text-xl font-bold tracking-wide text-surface-400">Join the Club</p>
        </div>

        <div className="relative z-10 mt-auto text-right">
          <h2 className="heading-xl text-white mb-6">
            Make <br/> it <br/> <span className="text-accent">yours.</span>
          </h2>
          <p className="font-body text-lg text-surface-400 max-w-sm ml-auto">
            Create an account to save favorites, track your orders in real-time, and get exclusive access.
          </p>
        </div>
      </div>

      {/* Left Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-surface-50">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h1 className="heading-lg text-surface-900 mb-2">{t('auth.create_account')}</h1>
            <p className="font-body text-surface-500">{t('auth.register_subtitle')}</p>
          </div>

          {(error || validationError) && (
            <div className="mb-6 p-4 bg-accent/10 border-l-4 border-accent text-accent font-body font-medium">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('auth.full_name')}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            <Input
              label={t('auth.confirm_password')}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 shadow-solid hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              isLoading={isLoading}
            >
              {t('auth.sign_up')}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-surface-200 text-center md:text-left font-body font-medium text-surface-600">
            {t('auth.already_have_account')}{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 underline decoration-2 underline-offset-4">
              {t('auth.login_instead')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
