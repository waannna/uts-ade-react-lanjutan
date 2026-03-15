import { useEffect } from 'react';

const Popup = ({ isOpen, onClose, onSubmit, children, title, type = 'info' }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-500',
    error: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-500',
    info: 'bg-blue-50 border-blue-500'
  };

  const titleColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl w-96 max-w-lg transform transition-all animate-slideIn border-l-4 ${typeStyles[type]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className={`text-xl font-bold ${titleColors[type]}`}>{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;