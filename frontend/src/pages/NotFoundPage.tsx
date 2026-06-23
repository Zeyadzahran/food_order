import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <h1 className="font-display font-black text-9xl text-primary-500 tracking-tighter mb-4 shadow-solid bg-surface-900 border-8 border-surface-900 leading-none px-6 py-2 select-none">
        404
      </h1>
      <h2 className="heading-md uppercase text-surface-900 mb-4 tracking-widest">{t('errors.not_found_title', 'Page Not Found')}</h2>
      <p className="font-body text-surface-500 mb-10 max-w-sm">
        {t('errors.not_found_desc', "Looks like this page got eaten. It doesn't exist anymore.")}
      </p>
      <Link to="/">
        <Button size="lg" className="shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all">
          {t('common.go_home', 'Go Home')}
        </Button>
      </Link>
    </div>
  );
}
