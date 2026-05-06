import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 transition-colors duration-300" style={{ borderColor: 'var(--border-color)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500 sm:flex-row">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {currentYear} {t('app_name')}. Built with Passion in Indonesia.
          </p>

          <div className="flex items-center gap-6">
            {[Instagram, Twitter, Github, Mail].map((Icon, i) => (
              <a key={i} href="#" className="transition-colors hover:text-blue-600">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
