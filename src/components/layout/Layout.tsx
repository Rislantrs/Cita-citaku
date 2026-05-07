import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../lib/AuthContext';
import { LogIn, LogOut, Menu, Sun, Moon } from 'lucide-react';
import BrandMark from '../BrandMark';
import Footer from '../Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // List of paths where footer should be hidden
  const hideFooterPaths = ['/counselor', '/test', '/admin', '/dashboard'];
  const shouldHideFooter = hideFooterPaths.some(path => pathname.startsWith(path));

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300" style={{ backgroundColor: 'rgba(var(--bg-secondary), 0.7)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <BrandMark size="sm" />
            </Link>

            <nav className="hidden md:flex space-x-8 items-center px-6 py-2 rounded-full border transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <Link to="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Beranda</Link>
              <Link to="/about-test" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Tentang Tes</Link>
              <Link to="/roadmap" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Eksplor Profesi</Link>
              <Link to="/explore-projects" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Tantangan Proyek</Link>
              <Link to="/counselor" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Konselor AI</Link>
              <Link to="/community" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Komunitas</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-3 rounded-full border transition-all hover:scale-110"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                {theme === 'light' ? <Moon size={20} className="text-blue-600" /> : <Sun size={20} className="text-yellow-400" />}
              </button>

              {!loading && (
                user ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">Dasbor</Link>
                    <button onClick={logout} className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <button onClick={loginWithGoogle} className="flex items-center space-x-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group">
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2" aria-label="Toggle Menu">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-4 shadow-lg absolute w-full backdrop-blur-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <Link to="/" className="block font-semibold px-2 py-2">Beranda</Link>
            <Link to="/about-test" className="block font-semibold px-2 py-2">Tentang Tes</Link>
            <Link to="/roadmap" className="block font-semibold px-2 py-2">Eksplor Profesi</Link>
            <Link to="/explore-projects" className="block font-semibold px-2 py-2">Tantangan Proyek</Link>
            <Link to="/counselor" className="block font-semibold px-2 py-2">Konselor AI</Link>
            <Link to="/community" className="block font-semibold px-2 py-2">Komunitas</Link>
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              {!loading && (
                user ? (
                  <>
                    <Link to="/dashboard" className="block font-semibold px-2 py-2">Dasbor</Link>
                    <button onClick={logout} className="block text-left w-full text-rose-500 font-semibold px-2 py-2">Keluar</button>
                  </>
                ) : (
                  <button onClick={loginWithGoogle} className="flex items-center gap-2 w-full text-left font-semibold px-2 py-2 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl mt-2">
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
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  );
}
