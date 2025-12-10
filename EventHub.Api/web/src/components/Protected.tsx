import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Protected() {
    const {user} = useAuth();
    const loc = useLocation();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{from: loc}}
            />
        );
    }

    // Render all nested protected routes
    return <Outlet/>;
}