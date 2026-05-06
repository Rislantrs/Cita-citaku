import { useTranslation } from 'react-i18next';

type BrandMarkProps = {
  className?: string;
  showLabel?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'h-10 w-10 rounded-2xl',
  md: 'h-12 w-12 rounded-2xl',
  lg: 'h-16 w-16 rounded-3xl',
};

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
};

export default function BrandMark({ className = '', showLabel = true, showTagline = false, size = 'md' }: BrandMarkProps) {
  const { t } = useTranslation();
  const logoSrc = (import.meta as any).env?.VITE_BRAND_LOGO_URL as string | undefined;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative overflow-hidden ${sizeClasses[size]} border border-blue-100 bg-[linear-gradient(135deg,#2563eb,#60a5fa)] shadow-[0_12px_30px_rgba(37,99,235,0.22)]`}>
        {logoSrc ? (
          <img src={logoSrc} alt={t('app_name')} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="brandMarkGlow" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#eff6ff" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="40" height="40" rx="14" fill="url(#brandMarkGlow)" fillOpacity="0.16" />
            <path d="M24 10.5L29.2 18.8L38.5 24L29.2 29.2L24 37.5L18.8 29.2L9.5 24L18.8 18.8L24 10.5Z" fill="white" fillOpacity="0.92" />
            <path d="M24 16.6L26.7 21.3L31.4 24L26.7 26.7L24 31.4L21.3 26.7L16.6 24L21.3 21.3L24 16.6Z" fill="#2563eb" fillOpacity="0.92" />
          </svg>
        )}
      </div>
      {showLabel && (
        <div className="leading-tight">
          <p className={`font-black tracking-tight text-slate-950 ${textSizeClasses[size]}`}>{t('app_name')}</p>
          {showTagline && <p className="text-xs font-medium uppercase tracking-[0.24em] text-blue-500">Explore your future</p>}
        </div>
      )}
    </div>
  );
}