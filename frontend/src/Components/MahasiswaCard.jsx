import { useState } from 'react';

const MahasiswaCard = ({ mhs, onEdit, onDelete, onToggle, onDetail }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Fungsi untuk menentukan warna berdasarkan IPK
  const getIPKColor = (ipk) => {
    if (ipk >= 3.5) return 'text-green-600 bg-green-100';
    if (ipk >= 3.0) return 'text-blue-600 bg-blue-100';
    if (ipk >= 2.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Fungsi untuk mendapatkan inisial nama
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fungsi untuk mendapatkan warna background berdasarkan nama
  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-yellow-500 to-orange-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={`relative group rounded-2xl transition-all duration-300 transform ${
        isHovered ? 'scale-105 shadow-2xl z-10' : 'shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card dengan efek gradient border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
        mhs.isactive 
          ? 'from-green-400 to-blue-500' 
          : 'from-gray-400 to-gray-500'
        } opacity-75 blur transition-all duration-300 ${
        isHovered ? 'opacity-100 blur-md' : 'opacity-75'
      }`}></div>
      
      {/* Main Card */}
      <div className={`relative bg-white rounded-2xl overflow-hidden border-2 ${
        mhs.isactive ? 'border-green-500' : 'border-gray-300'
      }`}>
        {/* Header dengan gradient */}
        <div className={`bg-gradient-to-r ${
          mhs.isactive 
            ? 'from-green-500 to-blue-600' 
            : 'from-gray-600 to-gray-700'
        } p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Avatar dengan inisial */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAvatarColor(mhs.name)} flex items-center justify-center shadow-lg transform transition group-hover:rotate-6`}>
                <span className="text-white font-bold text-xl">
                  {getInitials(mhs.name)}
                </span>
              </div>
              
              <div>
                <h3 className="font-bold text-lg truncate max-w-[150px]">
                  {mhs.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    NIM: {mhs.nim}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status Badge dengan animasi */}
            <div className={`relative ${
              mhs.isactive ? 'animate-pulse' : ''
            }`}>
              <div className={`absolute inset-0 rounded-full ${
                mhs.isactive ? 'bg-green-400' : 'bg-red-400'
              } blur-md`}></div>
              <span className={`relative px-3 py-1 rounded-full text-xs font-bold ${
                mhs.isactive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {mhs.isactive ? '● AKTIF' : '○ TIDAK AKTIF'}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Jurusan Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jurusan</p>
                  <p className="font-semibold text-sm text-gray-800 truncate max-w-[100px]">
                    {mhs.jurusan}
                  </p>
                </div>
              </div>
            </div>

            {/* IPK Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getIPKColor(mhs.ipk)}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">IPK</p>
                  <p className={`font-bold text-lg ${getIPKColor(mhs.ipk).split(' ')[0]}`}>
                    {mhs.ipk}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar (IPK Visual) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Indeks Prestasi</span>
              <span className="font-semibold text-gray-700">
                {((mhs.ipk / 4) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r ${
                  mhs.ipk >= 3.5 ? 'from-green-500 to-green-600' :
                  mhs.ipk >= 3.0 ? 'from-blue-500 to-blue-600' :
                  mhs.ipk >= 2.5 ? 'from-yellow-500 to-yellow-600' :
                  'from-red-500 to-red-600'
                }`}
                style={{ width: `${(mhs.ipk / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {/* Detail Button */}
            <button 
              onClick={() => onDetail(mhs)}
              className="relative group/btn overflow-hidden bg-blue-50 text-blue-600 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 flex items-center justify-center space-x-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              <svg className="w-4 h-4 relative z-10 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="relative z-10 group-hover/btn:text-white transition-colors text-sm">Detail</span>
            </button>

            {/* Edit Button */}
            <button 
              onClick={() => onEdit(mhs)}
              className="relative group/btn overflow-hidden bg-yellow-50 text-yellow-600 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-200 flex items-center justify-center space-x-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              <svg className="w-4 h-4 relative z-10 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="relative z-10 group-hover/btn:text-white transition-colors text-sm">Edit</span>
            </button>

            {/* Toggle Status Button */}
            <button 
              onClick={() => onToggle(mhs.id, mhs.isactive)}
              className={`col-span-2 relative group/btn overflow-hidden py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 ${
                mhs.isactive 
                  ? 'bg-orange-50 text-orange-600 hover:shadow-orange-200' 
                  : 'bg-green-50 text-green-600 hover:shadow-green-200'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ${
                mhs.isactive 
                  ? 'from-orange-500 to-red-500' 
                  : 'from-green-500 to-emerald-500'
              }`}></div>
              <svg className="w-4 h-4 relative z-10 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mhs.isactive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span className="relative z-10 group-hover/btn:text-white transition-colors text-sm">
                {mhs.isactive ? 'Nonaktifkan' : 'Aktifkan'}
              </span>
            </button>

            {/* Delete Button */}
            <button 
              onClick={() => onDelete(mhs.id)}
              className="col-span-2 relative group/btn overflow-hidden bg-red-50 text-red-600 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-200 flex items-center justify-center space-x-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              <svg className="w-5 h-5 relative z-10 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="relative z-10 group-hover/btn:text-white transition-colors font-bold">Hapus Mahasiswa</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-3xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-3xl"></div>
      </div>
    </div>
  );
};

export default MahasiswaCard;