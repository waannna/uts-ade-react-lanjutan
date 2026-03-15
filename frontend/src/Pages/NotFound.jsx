import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Animation */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-white opacity-10 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500 text-white px-6 py-3 rounded-full transform -rotate-12 animate-bounce">
              <span className="text-2xl font-bold">ERROR</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-6">
          <h2 className="text-4xl font-bold text-white">Halaman Tidak Ditemukan</h2>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>

          {/* Illustration */}
          <div className="flex justify-center my-8">
            <svg className="w-48 h-48 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
    
            <Link
              to="/login"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Halaman Login</span>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-500 mb-4">Atau coba salah satu halaman berikut:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/" className="text-gray-400 hover:text-white transition">Beranda</Link>
              <span className="text-gray-600">•</span>
              <Link to="/about" className="text-gray-400 hover:text-white transition">Tentang</Link>
              <span className="text-gray-600">•</span>
              <Link to="/contact" className="text-gray-400 hover:text-white transition">Kontak</Link>
              <span className="text-gray-600">•</span>
              <Link to="/register" className="text-gray-400 hover:text-white transition">Daftar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;