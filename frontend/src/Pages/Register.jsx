import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Popup from '../Components/Popup';
import usePopup from '../hooks/usePopup';

const Register = () => {
  const [form, setForm] = useState({ gmail: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const popup = usePopup();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/register', form);
      popup.showSuccess('Akun Anda berhasil dibuat! Silakan login.', 'Registrasi Berhasil');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      popup.showError(
        err.response?.data?.message || 'Gagal melakukan registrasi', 
        'Registrasi Gagal'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {/* Global Popup */}
      <Popup 
        isOpen={popup.isOpen} 
        onClose={popup.hidePopup} 
        title={popup.title}
        type={popup.type}
      >
        <div className="text-center">
          <div className="mb-4">
            {popup.type === 'success' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {popup.type === 'error' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-4">{popup.message}</p>
          {popup.type === 'success' && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div className="bg-green-600 h-1.5 rounded-full animate-progress"></div>
            </div>
          )}
          <button
            onClick={popup.hidePopup}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tutup
          </button>
        </div>
      </Popup>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
            <div className="bg-white/20 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Buat Akun Baru</h2>
            <p className="text-green-100 mt-2">Bergabung dengan Sistem Informasi Mahasiswa</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    placeholder="nama@gmail.com"
                    value={form.gmail}
                    onChange={(e) => setForm({...form, gmail: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    placeholder="usernameanda"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    placeholder="•••••••• (min. 6 karakter)"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})} 
                    required 
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <p className="text-center text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;