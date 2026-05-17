import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../lib/AuthContext';
import { LogOut, Menu, Sun, Moon, X, Home, BookOpen, Map, MessageSquare, Users } from 'lucide-react';
import BrandMark from '../BrandMark';
import Footer from '../Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const hideFooterPaths = ['/counselor', '/test', '/admin', '/dashboard'];
  const shouldHideFooter = hideFooterPaths.some(path => pathname.startsWith(path));

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/about-test', label: 'Tentang Tes' },
    { to: '/roadmap', label: 'Eksplor Profesi' },
    { to: '/explore-projects', label: 'Proyek' },
    { to: '/counselor', label: 'Konselor AI' },
    { to: '/community', label: 'Komunitas' },
  ];

  // Mobile bottom tab bar links (5 most important)
  const mobileNavLinks = [
    { to: '/', label: 'Beranda', icon: Home },
    { to: '/roadmap', label: 'Profesi', icon: Map },
    { to: '/explore-projects', label: 'Proyek', icon: BookOpen },
    { to: '/counselor', label: 'AI Chat', icon: MessageSquare },
    { to: '/community', label: 'Komunitas', icon: Users },
  ];

  const isDark = theme === 'dark';

  // Dynamic header background for both light and dark mode
  const headerBg = scrolled 
    ? 'var(--header-bg)'
    : 'transparent';
  const headerBorder = scrolled
    ? '1px solid var(--border-color)'
    : '1px solid transparent';

  return (
    <div className="page-shell min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* ─── HEADER ─── */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]' 
            : ''
        }`}
        style={{ 
          backgroundColor: headerBg, 
          borderBottom: headerBorder,
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            
            {/* Brand */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <BrandMark size="sm" />
            </Link>

            {/* Desktop Nav — minimal pill shape */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 text-[13px] font-semibold transition-all rounded-full ${
                      isActive 
                        ? (isDark ? 'text-blue-400 bg-blue-950/60' : 'text-blue-700 bg-blue-50/80 shadow-sm')
                        : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-950 hover:bg-white/70')
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all hover:scale-110 ${
                  isDark 
                    ? 'text-yellow-400 hover:text-yellow-300 bg-white/10 border border-white/10' 
                    : 'text-slate-500 hover:text-slate-950 bg-white/70 border border-slate-200/70'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {!loading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <Link to="/dashboard" className={`text-[13px] font-semibold transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}>Dasbor</Link>
                    <button 
                      onClick={logout} 
                      className={`click-feedback flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                        isDark 
                          ? 'text-slate-400 bg-white/10 border border-white/10 hover:text-white hover:bg-white/15' 
                          : 'text-slate-600 bg-white/70 border border-slate-200/70 hover:text-slate-950 hover:bg-white'
                      }`}
                    >
                      <LogOut size={14} />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={loginWithGoogle} 
                    className="click-feedback flex items-center gap-2.5 bg-slate-950 text-white border border-slate-950 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Masuk dengan Google</span>
                  </button>
                )
              )}
            </div>

            {/* Mobile — only hamburger + theme toggle (tab bar handles navigation) */}
            <div className="lg:hidden flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-white/10 border border-white/10 text-yellow-400' 
                    : 'bg-white/70 border border-slate-200/70 text-slate-600 hover:text-slate-950'
                }`}
                aria-label="Ubah tema terang/gelap"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-white/10 border border-white/10 text-slate-300' 
                    : 'bg-white/70 border border-slate-200/70 text-slate-600 hover:text-slate-950'
                }`}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — clean slide (for login/logout + extra links) */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            menuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <div className="px-6 py-6 space-y-1">
            {navLinks.map(link => {
              const isActive = pathname === link.to;
              return (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`block font-semibold px-3 py-3 rounded-xl text-[15px] transition-colors ${
                    isActive 
                      ? (isDark ? 'text-blue-400 bg-blue-950/40' : 'text-blue-700 bg-blue-50/80')
                      : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-950 hover:bg-white/70')
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="fluid-separator my-4" />
            {!loading && (
              user ? (
                <>
                  <Link to="/dashboard" className="block font-semibold px-3 py-3 text-[15px] opacity-60 hover:opacity-100" style={{ color: 'var(--text-primary)' }}>Dasbor</Link>
                  <button onClick={logout} className="block text-left w-full text-rose-500 font-semibold px-3 py-3 text-[15px]">Keluar</button>
                </>
              ) : (
                <button 
                  onClick={loginWithGoogle} 
                  className="click-feedback flex items-center gap-2 w-full font-semibold px-3 py-3 text-[15px] text-white bg-slate-950 border border-slate-950 rounded-xl mt-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Lanjutkan dengan Google
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 page-enter pb-20 lg:pb-0">
        {children}
      </main>

      {!shouldHideFooter && <Footer />}

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <nav className="mobile-bottom-nav lg:hidden" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavLinks.map(link => {
            const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all min-w-[56px] ${
                  isActive 
                    ? (isDark ? 'text-blue-400' : 'text-blue-600')
                    : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-bold leading-none ${isActive ? '' : 'opacity-70'}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
