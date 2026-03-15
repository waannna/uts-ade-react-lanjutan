import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import MahasiswaList from './Pages/MahasiswaList';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Navbar from './Components/Navbar';
import NotFound from './Pages/NotFound';
import Popup from './Components/Popup';
import usePopup from './hooks/usePopup';

// --- Komponen Proteksi Halaman ---
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();
  const popup = usePopup();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        popup.showError('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'Akses Ditolak');
      }
    }
  }, [location]);

  if (isAuth === null) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat...</p>
      </div>
    </div>
  );

  if (isAuth === false) return <NotFound />;

  return children;
};

function App() {
  const [globalPopup, setGlobalPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Fungsi untuk menampilkan popup global
  const showGlobalPopup = (type, title, message) => {
    setGlobalPopup({ isOpen: true, type, title, message });
  };

  const hideGlobalPopup = () => {
    setGlobalPopup({ ...globalPopup, isOpen: false });
  };

  return (
    <Router>
      {/* Global Popup */}
      <Popup 
        isOpen={globalPopup.isOpen} 
        onClose={hideGlobalPopup} 
        title={globalPopup.title}
        type={globalPopup.type}
      >
        <div className="text-center">
          <div className="mb-4">
            {globalPopup.type === 'success' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {globalPopup.type === 'error' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {globalPopup.type === 'warning' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-6">{globalPopup.message}</p>
          <button
            onClick={hideGlobalPopup}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tutup
          </button>
        </div>
      </Popup>

      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Terproteksi */}
        <Route path="/" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Home />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/mahasiswa" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <MahasiswaList />
            </>
          </ProtectedRoute>
        } />

        <Route path="/about" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <About />
            </>
          </ProtectedRoute>
        } />

        <Route path="/contact" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Contact />
            </>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;