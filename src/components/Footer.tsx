import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="fluid-separator mb-12" />
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase opacity-30">
            &copy; {currentYear} {t('app_name')}. Built with Passion in Indonesia.
          </p>

          <div className="flex items-center gap-8">
            {['Instagram', 'Twitter', 'GitHub'].map(name => (
              <a 
                key={name} 
                href="#" 
                className="link-underline text-[11px] font-semibold tracking-[0.1em] uppercase opacity-30 hover:opacity-70 transition-opacity"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
