import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 pb-24 lg:pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="fluid-separator mb-12" />
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--text-secondary)' }}>
            &copy; {currentYear} {t('app_name')}. Built with Passion in Indonesia.
          </p>

          <div className="flex items-center gap-8">
            {['Instagram', 'Twitter', 'GitHub'].map(name => (
              <a 
                key={name} 
                href="#" 
                className="text-[11px] font-semibold tracking-widest uppercase transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
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
