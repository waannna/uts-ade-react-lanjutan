import { useState } from 'react';

const usePopup = () => {
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    data: null,
    onConfirm: null
  });

  const showPopup = ({ type = 'info', title, message, data = null, onConfirm = null }) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      data,
      onConfirm
    });
  };

  const showSuccess = (message, title = 'Berhasil') => {
    showPopup({ type: 'success', title, message });
  };

  const showError = (message, title = 'Gagal') => {
    showPopup({ type: 'error', title, message });
  };

  const showWarning = (message, title = 'Peringatan', onConfirm = null) => {
    showPopup({ type: 'warning', title, message, onConfirm });
  };

  const showInfo = (message, title = 'Informasi') => {
    showPopup({ type: 'info', title, message });
  };

  const hidePopup = () => {
    setPopup({
      isOpen: false,
      type: 'info',
      title: '',
      message: '',
      data: null,
      onConfirm: null
    });
  };

  return {
    ...popup,
    showPopup,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hidePopup
  };
};

export default usePopup;