import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const popup = usePopup();

  const handleLogout = () => {
    popup.showWarning('Apakah Anda yakin ingin keluar?', 'Konfirmasi Logout', () => {
      Cookies.remove('token');
      popup.showSuccess('Anda telah berhasil logout.', 'Sampai Jumpa!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Global Popup */}
      <Popup 
        isOpen={popup.isOpen} 
        onClose={popup.hidePopup} 
        title={popup.title}
        type={popup.type}
      >
        <div className="text-center">
          {popup.type === 'warning' ? (
            <>
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-6">{popup.message}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    popup.onConfirm();
                    popup.hidePopup();
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Ya, Logout
                </button>
                <button
                  onClick={popup.hidePopup}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Batal
                </button>
              </div>
            </>
          ) : popup.type === 'success' ? (
            <>
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{popup.message}</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div className="bg-green-600 h-1.5 rounded-full animate-progress"></div>
              </div>
            </>
          ) : null}
        </div>
      </Popup>

      <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="font-bold text-xl tracking-tight">Data<span className="text-blue-200">Mahasiswa</span></h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" active={isActive('/')}>Beranda</NavLink>
              <NavLink to="/mahasiswa" active={isActive('/mahasiswa')}>Mahasiswa</NavLink>
              <NavLink to="/about" active={isActive('/about')}>Tentang</NavLink>
              <NavLink to="/contact" active={isActive('/contact')}>Kontak</NavLink>
              
              <button 
                onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-600 animate-slideDown">
            <div className="px-4 py-3 space-y-2">
              <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Beranda</MobileNavLink>
              <MobileNavLink to="/mahasiswa" onClick={() => setIsMenuOpen(false)}>Mahasiswa</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>Tentang</MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Kontak</MobileNavLink>
              
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

// Komponen NavLink untuk desktop
const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-white text-blue-700 font-semibold shadow-md' 
        : 'hover:bg-white/20 hover:scale-105'
    }`}
  >
    {children}
  </Link>
);

// Komponen NavLink untuk mobile
const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-lg hover:bg-white/20 transition"
  >
    {children}
  </Link>
);

export default Navbar;