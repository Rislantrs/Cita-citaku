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
  const logoSrc = (import.meta as any).env?.VITE_BRAND_LOGO_URL || '/logo.webp?v=1';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative overflow-hidden ${sizeClasses[size]} border border-blue-100 bg-white shadow-[0_12px_30px_rgba(37,99,235,0.12)]`}>
        <img src={logoSrc} alt={t('app_name')} className="h-full w-full object-contain p-1" />
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