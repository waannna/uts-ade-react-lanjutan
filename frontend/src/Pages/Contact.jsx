import { useState } from 'react';
import Popup from '../Components/Popup';
import usePopup from '../hooks/usePopup';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: 'Ade',
    ttl: 'Jakarta, 15 Maret 2000',
    training: 'React Lanjutan',
    instructor: 'Arya Segara',
    email: 'ade@student.example.com',
    phone: '0812-3456-7890'
  });

  const [isEditing, setIsEditing] = useState(false);
  const popup = usePopup();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    popup.showSuccess('Data kontak berhasil diperbarui!', 'Berhasil');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendMessage = () => {
    popup.showSuccess('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.', 'Pesan Terkirim');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Global Popup */}
      <Popup 
        isOpen={popup.isOpen} 
        onClose={popup.hidePopup} 
        title={popup.title}
        type={popup.type}
      >
        <div className="text-center">
          {popup.type === 'success' && (
            <>
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{popup.message}</p>
              <button
                onClick={popup.hidePopup}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Tutup
              </button>
            </>
          )}
        </div>
      </Popup>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Hubungi <span className="text-purple-600">Kami</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Jangan ragu untuk menghubungi kami jika ada pertanyaan atau masukan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profil Pengembang</span>
                </h2>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TTL</label>
                      <input
                        type="text"
                        name="ttl"
                        value={formData.ttl}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pelatihan</label>
                      <input
                        type="text"
                        name="training"
                        value={formData.training}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instruktur</label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <ContactInfoItem
                      icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                      label="Nama"
                      value={formData.name}
                      color="purple"
                    />
                    
                    <ContactInfoItem
                      icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                      label="TTL"
                      value={formData.ttl}
                      color="blue"
                    />
                    
                    <ContactInfoItem
                      icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      }
                      label="Pelatihan"
                      value={formData.training}
                      color="green"
                    />
                    
                    <ContactInfoItem
                      icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      }
                      label="Instruktur"
                      value={formData.instructor}
                      color="red"
                    />
                    
                    <ContactInfoItem
                      icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                      label="Email"
                      value={formData.email}
                      color="yellow"
                    />
                    
                    <ContactInfoItem
                      icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      }
                      label="Telepon"
                      value={formData.phone}
                      color="indigo"
                    />
                    
                    <button
                      onClick={handleEdit}
                      className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Profil</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>Kirim Pesan</span>
                </h2>
              </div>
              
              <div className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Subjek"
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition"
                  />
                  
                  <textarea
                    rows="4"
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition"
                  ></textarea>
                  
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
                  >
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Lokasi Kampus</span>
                </h2>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-500">Map akan ditampilkan di sini</p>
                    <p className="text-sm text-gray-400 mt-2">Jl. Contoh No. 123, Jakarta</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Jam Kerja</p>
                    <p className="font-semibold text-gray-700">Senin - Jumat</p>
                    <p className="text-sm text-gray-600">08:00 - 17:00</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Respon</p>
                    <p className="font-semibold text-gray-700">Maks. 24 Jam</p>
                    <p className="text-sm text-gray-600">Hari Kerja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Contact Info Item
const ContactInfoItem = ({ icon, label, value, color }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Contact;