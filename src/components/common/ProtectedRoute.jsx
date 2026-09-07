import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen text="Memeriksa otentikasi..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node,
};

export default ProtectedRoute;