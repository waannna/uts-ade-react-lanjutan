import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotFound from '../Pages/NotFound'; // Kita buat file ini di bawah

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');

  // Jika token tidak ada, tampilkan 404 daripada redirect ke login
  if (!token) {
    return <NotFound />;
  }

  return children;
};

export default ProtectedRoute;