import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';

const ProtectedRoute = () => {
    // We grab the authentication status directly from Redux
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // If they are not authenticated, redirect them to the Login page.
    // If they are authenticated, render the child routes (<Outlet />).
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
