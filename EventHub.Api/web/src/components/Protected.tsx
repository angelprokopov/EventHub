import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from '../contexts/AuthContext'

export default function Protected({children}: {children: React.ReactNode}) {
    const {user} = useAuth();
    const loc = useLocation();
    if(!user) return <Navigate to="/login" replace state={{from: loc}} />;
    return <>{children}</>
}