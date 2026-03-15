import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    aktif: 0,
    tidakAktif: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/mahasiswa', { withCredentials: true });
      const data = res.data;
      const aktif = data.filter(m => m.isactive).length;
      const tidakAktif = data.length - aktif;
      
      setStats({
        total: data.length,
        aktif,
        tidakAktif
      });
    } catch (err) {
      console.error('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 animate-fadeIn">
              Selamat Datang di
              <span className="block text-gray-800 mt-2">Sistem Informasi Mahasiswa</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp">
              Kelola data mahasiswa dengan mudah, cepat, dan aman. Pantau status keaktifan, 
              kelola nilai IPK, dan perbarui informasi akademik dalam satu platform terintegrasi.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              title="Total Mahasiswa"
              value={stats.total}
              color="blue"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              loading={loading}
            />
            
            <StatCard
              title="Mahasiswa Aktif"
              value={stats.aktif}
              color="green"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              loading={loading}
            />
            
            <StatCard
              title="Mahasiswa Tidak Aktif"
              value={stats.tidakAktif}
              color="red"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              loading={loading}
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-16 text-center animate-fadeInUp">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Akses Cepat</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <QuickActionButton
                to="/mahasiswa"
                color="blue"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              >
                Kelola Mahasiswa
              </QuickActionButton>
              
              <QuickActionButton
                to="/about"
                color="purple"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Tentang Aplikasi
              </QuickActionButton>
              
              <QuickActionButton
                to="/contact"
                color="green"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              >
                Hubungi Kami
              </QuickActionButton>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Manajemen Data"
              description="Kelola data mahasiswa dengan mudah melalui antarmuka yang intuitif dan responsif."
              icon="📊"
            />
            <FeatureCard
              title="Keamanan Terjamin"
              description="Sistem dilengkapi dengan autentikasi JWT dan enkripsi password untuk keamanan data."
              icon="🔒"
            />
            <FeatureCard
              title="Update Real-time"
              description="Perubahan data dapat langsung dilihat dan diakses secara real-time."
              icon="⚡"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
};

// Komponen Stat Card
const StatCard = ({ title, value, color, icon, loading }) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-600',
      gradient: 'from-green-500 to-green-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-600',
      gradient: 'from-red-500 to-red-600'
    }
  };

  return (
    <div className={`${colors[color].bg} rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-300`}>
      <div className={`h-2 bg-gradient-to-r ${colors[color].gradient}`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white shadow-md ${colors[color].text}`}>
            {icon}
          </div>
          {loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <span className={`text-4xl font-bold ${colors[color].text}`}>{value}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {value === 0 ? 'Belum ada data' : 'Data terkini'}
        </p>
      </div>
    </div>
  );
};

// Komponen Quick Action Button
const QuickActionButton = ({ to, children, color, icon }) => {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <a
      href={to}
      className={`${colors[color]} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition hover:scale-105 flex items-center space-x-2`}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};

// Komponen Feature Card
const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;