const About = () => {
  const technologies = [
    {
      category: "Frontend",
      items: [
        { name: "React.js", icon: "⚛️", description: "Library JavaScript untuk membangun antarmuka pengguna" },
        { name: "Vite", icon: "⚡", description: "Build tool yang cepat untuk pengembangan modern" },
        { name: "Tailwind CSS", icon: "🎨", description: "Framework CSS utility-first untuk styling cepat" }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", icon: "🟢", description: "Runtime JavaScript untuk backend" },
        { name: "Express", icon: "🚂", description: "Framework web minimalis untuk Node.js" },
        { name: "PostgreSQL", icon: "🐘", description: "Database relasional yang handal" }
      ]
    },
    {
      category: "Keamanan",
      items: [
        { name: "JWT", icon: "🔐", description: "JSON Web Token untuk autentikasi" },
        { name: "Bcrypt", icon: "🔒", description: "Hashing password untuk keamanan" },
        { name: "Cookie Parser", icon: "🍪", description: "Mengelola session dengan cookies" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Tentang <span className="text-blue-600">Website</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem Informasi Mahasiswa dibangun sebagai proyek UTS untuk mata kuliah React Lanjutan 2026
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transform transition hover:scale-105 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Informasi Proyek</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mata Kuliah</h3>
                    <p className="text-gray-600">React Lanjutan - 2026</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Status</h3>
                    <p className="text-gray-600">Fullstack Application dengan Autentikasi JWT</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fitur Utama</h3>
                    <p className="text-gray-600">CRUD Mahasiswa, Manajemen Status, Proteksi Rute</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lisensi</h3>
                    <p className="text-gray-600">Proyek Akademik - UTS React Lanjutan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Teknologi yang Digunakan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-300">
              <div className={`h-2 bg-gradient-to-r ${
                index === 0 ? 'from-blue-500 to-cyan-500' :
                index === 1 ? 'from-green-500 to-emerald-500' :
                'from-red-500 to-orange-500'
              }`}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{tech.category}</h3>
                <div className="space-y-4">
                  {tech.items.map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>© 2026 UTS React Lanjutan - Dibangun dengan ❤️ oleh Mahasiswa</p>
        </div>
      </div>
    </div>
  );
};

export default About;