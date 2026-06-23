import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h1 className="heading-md uppercase text-accent mb-4">{t('errors.something_went_wrong')}</h1>
      <p className="font-body text-surface-500 mb-8 max-w-md bg-surface-100 p-4 border-l-4 border-accent text-left rtl:text-right rtl:border-r-4 rtl:border-l-0">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <Button onClick={resetErrorBoundary} size="lg" className="shadow-solid hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
        {t('common.try_again')}
      </Button>
    </div>
  );
}

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      {children}
    </ReactErrorBoundary>
  );
}
