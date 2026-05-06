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
                  <button onClick={loginWithGoogle} className="flex items-center space-x-2 bg-slate-950 text-white px-6 py-3 rounded-full text-sm font-black transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5">
                    <LogIn size={16} />
                    <span>Masuk</span>
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
                  <button onClick={loginWithGoogle} className="block text-left w-full font-bold px-2 py-2">Masuk dengan Google</button>
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
