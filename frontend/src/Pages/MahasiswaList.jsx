import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from '../Components/Popup';
import MahasiswaCard from '../Components/MahasiswaCard';
import usePopup from '../hooks/usePopup';

const MahasiswaList = () => {
  const [mhs, setMhs] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMhs, setSelectedMhs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [sortBy, setSortBy] = useState('nama');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'list'
  const [stats, setStats] = useState({
    total: 0,
    aktif: 0,
    tidakAktif: 0,
    rataIpk: 0
  });
  
  const navigate = useNavigate();
  const popup = usePopup();

  const [formData, setFormData] = useState({ 
    name: '', 
    nim: '', 
    jurusan: '', 
    ipk: '', 
    isactive: true 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/mahasiswa', { withCredentials: true });
      setMhs(res.data);
      
      // Hitung statistik
      const aktif = res.data.filter(m => m.isactive).length;
      const tidakAktif = res.data.length - aktif;
      const totalIpk = res.data.reduce((sum, m) => sum + parseFloat(m.ipk), 0);
      const rataIpk = res.data.length > 0 ? (totalIpk / res.data.length).toFixed(2) : 0;
      
      setStats({
        total: res.data.length,
        aktif,
        tidakAktif,
        rataIpk
      });
    } catch (err) { 
      popup.showError('Sesi Anda telah berakhir. Silakan login kembali.', 'Sesi Habis');
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter dan sort data
  const filteredData = mhs
    .filter(m => {
      // Filter pencarian
      const matchesSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.jurusan.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter status
      const matchesStatus = 
        filterStatus === 'semua' ? true :
        filterStatus === 'aktif' ? m.isactive :
        filterStatus === 'tidakAktif' ? !m.isactive : true;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'nama') return a.name.localeCompare(b.name);
      if (sortBy === 'nim') return a.nim.localeCompare(b.nim);
      if (sortBy === 'ipk') return b.ipk - a.ipk;
      if (sortBy === 'status') return (b.isactive === a.isactive) ? 0 : b.isactive ? 1 : -1;
      return 0;
    });

  const handleShowDetail = (item) => {
    setSelectedMhs(item);
    setIsDetailOpen(true);
  };

  const handleShowEdit = (item) => {
    setSelectedMhs(item);
    setFormData({ 
      name: item.name, 
      nim: item.nim, 
      jurusan: item.jurusan, 
      ipk: item.ipk, 
      isactive: item.isactive 
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...formData, ipk: parseFloat(formData.ipk) };
      await axios.post('http://localhost:5000/api/mahasiswa', dataToSend, { withCredentials: true });
      popup.showSuccess('Data mahasiswa berhasil ditambahkan!', 'Sukses');
      setIsPopupOpen(false);
      setFormData({ name: '', nim: '', jurusan: '', ipk: '', isactive: true });
      fetchData();
    } catch (err) { 
      popup.showError(err.response?.data?.message || 'NIM sudah terdaftar atau data tidak valid', 'Gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...formData, ipk: parseFloat(formData.ipk) };
      await axios.put(`http://localhost:5000/api/mahasiswa/${selectedMhs.id}`, dataToSend, { withCredentials: true });
      popup.showSuccess('Data mahasiswa berhasil diperbarui!', 'Sukses');
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      popup.showError('Gagal memperbarui data. Silakan coba lagi.', 'Gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    popup.showWarning('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus', async () => {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/mahasiswa/${id}`, { withCredentials: true });
        popup.showSuccess('Data mahasiswa berhasil dihapus!', 'Sukses');
        fetchData();
      } catch (err) {
        popup.showError('Gagal menghapus data. Silakan coba lagi.', 'Gagal');
      } finally {
        setLoading(false);
      }
    });
  };

  const toggleStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      const selectedItem = mhs.find(item => item.id === id);
      await axios.put(`http://localhost:5000/api/mahasiswa/${id}`, 
        { ...selectedItem, isactive: !currentStatus }, { withCredentials: true });
      popup.showSuccess(`Status mahasiswa berhasil diubah menjadi ${!currentStatus ? 'Aktif' : 'Tidak Aktif'}`, 'Sukses');
      fetchData();
    } catch (err) {
      popup.showError('Gagal mengubah status. Silakan coba lagi.', 'Gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const csv = [
      ['Nama', 'NIM', 'Jurusan', 'IPK', 'Status'],
      ...filteredData.map(m => [m.name, m.nim, m.jurusan, m.ipk, m.isactive ? 'Aktif' : 'Tidak Aktif'])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-mahasiswa-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    popup.showSuccess('Data berhasil diekspor!', 'Ekspor Berhasil');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 transform animate-bounce-slow">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="text-gray-700 font-semibold text-lg">Memproses data...</span>
            <div className="loading-dots text-blue-600 text-2xl"></div>
          </div>
        </div>
      )}

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
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 animate-bounce">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {popup.type === 'error' && (
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 animate-shake">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {popup.type === 'warning' && (
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 animate-pulse">
                <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-gray-700 text-lg mb-6">{popup.message}</p>
          {popup.type === 'warning' && popup.onConfirm && (
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  popup.onConfirm();
                  popup.hidePopup();
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition transform hover:scale-105"
              >
                Ya, Hapus
              </button>
              <button
                onClick={popup.hidePopup}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition transform hover:scale-105"
              >
                Batal
              </button>
            </div>
          )}
          {popup.type !== 'warning' && (
            <button
              onClick={popup.hidePopup}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
            >
              Tutup
            </button>
          )}
        </div>
      </Popup>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Manajemen Mahasiswa
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Kelola data mahasiswa dengan mudah dan efisien
              </p>
            </div>
            
            <div className="flex gap-3">
              {/* Export Button */}
              <button
                onClick={handleExportData}
                disabled={filteredData.length === 0}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV</span>
              </button>

              {/* Add Button */}
              <button 
                onClick={() => {
                  setFormData({ name: '', nim: '', jurusan: '', ipk: '', isactive: true });
                  setIsPopupOpen(true);
                }} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg transform transition hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Mahasiswa</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <StatCard
              title="Total Mahasiswa"
              value={stats.total}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              color="blue"
            />
            <StatCard
              title="Mahasiswa Aktif"
              value={stats.aktif}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="green"
            />
            <StatCard
              title="Tidak Aktif"
              value={stats.tidakAktif}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="red"
            />
            <StatCard
              title="Rata-rata IPK"
              value={stats.rataIpk}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              color="purple"
              suffix=""
            />
          </div>
        </div>

        {/* Filter & Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Cari Mahasiswa</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, NIM, atau jurusan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Filter Status</span>
                </span>
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidakAktif">Tidak Aktif</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span>Urutkan</span>
                </span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="nama">Nama (A-Z)</option>
                <option value="nim">NIM</option>
                <option value="ipk">IPK (Tertinggi)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-bold text-blue-600">{filteredData.length}</span> dari <span className="font-bold text-gray-800">{mhs.length}</span> mahasiswa
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredData.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <MahasiswaCard 
                  key={item.id} 
                  mhs={item} 
                  onDelete={handleDelete} 
                  onToggle={toggleStatus}
                  onEdit={handleShowEdit}
                  onDetail={handleShowDetail}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">NIM</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jurusan</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">IPK</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {item.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.nim}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.jurusan}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.ipk >= 3.5 ? 'bg-green-100 text-green-700' :
                          item.ipk >= 3.0 ? 'bg-blue-100 text-blue-700' :
                          item.ipk >= 2.5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.ipk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.isactive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.isactive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleShowDetail(item)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShowEdit(item)}
                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 p-2 rounded-lg hover:bg-yellow-200 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-lg hover:bg-red-200 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                </div>
                <svg className="w-32 h-32 text-gray-300 mx-auto relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak Ada Data</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'semua' 
                  ? 'Tidak ada mahasiswa yang sesuai dengan filter yang Anda pilih.' 
                  : 'Belum ada data mahasiswa. Mulai dengan menambahkan data baru.'}
              </p>
              {(searchTerm || filterStatus !== 'semua') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('semua');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105"
                >
                  Reset Filter
                </button>
              )}
              {!searchTerm && filterStatus === 'semua' && (
                <button
                  onClick={() => {
                    setFormData({ name: '', nim: '', jurusan: '', ipk: '', isactive: true });
                    setIsPopupOpen(true);
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Tambah Mahasiswa Pertama</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal TAMBAH */}
        <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Tambah Mahasiswa Baru" type="info">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  placeholder="Masukkan NIM"
                  value={formData.nim} 
                  onChange={(e) => setFormData({...formData, nim: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                <select
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                  value={formData.jurusan}
                  onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                  required
                >
                  <option value="">Pilih Jurusan</option>
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknik Komputer">Teknik Komputer</option>
                  <option value="Manajemen Informatika">Manajemen Informatika</option>
                  <option value="Teknik Elektro">Teknik Elektro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IPK</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="4" 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  placeholder="Masukkan IPK (0-4)"
                  value={formData.ipk} 
                  onChange={(e) => setFormData({...formData, ipk: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Awal</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.isactive === true}
                      onChange={() => setFormData({...formData, isactive: true})}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.isactive === false}
                      onChange={() => setFormData({...formData, isactive: false})}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Tidak Aktif</span>
                  </label>
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </form>
        </Popup>

        {/* Modal EDIT */}
        <Popup isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Data Mahasiswa" type="warning">
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                  value={formData.nim} 
                  onChange={(e) => setFormData({...formData, nim: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                <select
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition bg-white"
                  value={formData.jurusan}
                  onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                  required
                >
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknik Komputer">Teknik Komputer</option>
                  <option value="Manajemen Informatika">Manajemen Informatika</option>
                  <option value="Teknik Elektro">Teknik Elektro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IPK</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="4" 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                  value={formData.ipk} 
                  onChange={(e) => setFormData({...formData, ipk: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.isactive === true}
                      onChange={() => setFormData({...formData, isactive: true})}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.isactive === false}
                      onChange={() => setFormData({...formData, isactive: false})}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span>Tidak Aktif</span>
                  </label>
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-3 rounded-xl font-bold hover:from-yellow-700 hover:to-orange-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Menyimpan...' : 'Update Data'}
            </button>
          </form>
        </Popup>

        {/* Modal DETAIL */}
        <Popup isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Detail Mahasiswa" type="success">
          {selectedMhs && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -mt-5 -mx-5 p-6 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      {selectedMhs.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">{selectedMhs.name}</h3>
                    <p className="text-blue-100">{selectedMhs.nim}</p>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Jurusan</p>
                  <p className="font-semibold text-gray-800">{selectedMhs.jurusan}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">IPK</p>
                  <p className={`text-2xl font-bold ${
                    selectedMhs.ipk >= 3.5 ? 'text-green-600' :
                    selectedMhs.ipk >= 3.0 ? 'text-blue-600' :
                    selectedMhs.ipk >= 2.5 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{selectedMhs.ipk}</p>
                </div>
              </div>

              {/* Status dengan Progress Bar */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Status Akademik</p>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    selectedMhs.isactive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedMhs.isactive ? 'AKTIF' : 'TIDAK AKTIF'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedMhs.isactive ? 'Terdaftar aktif' : 'Tidak terdaftar'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      selectedMhs.isactive ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: selectedMhs.isactive ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Informasi Tambahan</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedMhs.isactive 
                        ? 'Mahasiswa ini terdaftar sebagai mahasiswa aktif di sistem akademik.'
                        : 'Mahasiswa ini saat ini tidak aktif dalam sistem akademik.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Cepat */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleShowEdit(selectedMhs);
                  }}
                  className="bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Data</span>
                </button>
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    toggleStatus(selectedMhs.id, selectedMhs.isactive);
                  }}
                  className={`py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    selectedMhs.isactive 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {selectedMhs.isactive ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <span>{selectedMhs.isactive ? 'Nonaktifkan' : 'Aktifkan'}</span>
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .loading-dots:after {
          content: '.';
          animation: dots 1.5s steps(5, end) infinite;
        }
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60% { content: '...'; }
          80%, 100% { content: ''; }
        }
      `}</style>
    </div>
  );
};

// Komponen Stat Card
const StatCard = ({ title, value, icon, color, suffix = '' }) => {
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
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600'
    }
  };

  return (
    <div className={`${colors[color].bg} rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-300`}>
      <div className={`h-2 bg-gradient-to-r ${colors[color].gradient}`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-white shadow-md ${colors[color].text}`}>
            {icon}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-800">{value}{suffix}</p>
            <p className="text-sm text-gray-600 mt-1">{title}</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <span className="flex items-center">
            <span className={`w-2 h-2 rounded-full bg-${color}-500 mr-2`}></span>
            Update real-time
          </span>
        </div>
      </div>
    </div>
  );
};

export default MahasiswaList;