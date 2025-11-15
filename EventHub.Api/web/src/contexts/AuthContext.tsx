import {createContext, useContext, useEffect, useMemo, useState} from 'react'
import * as authApi from '../api/auth'

type User = {id:string, email:string, displayName:string} | null;
type AuthContextType = {
    user: User;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('auth');
        if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed.user);
            setToken(parsed.token);
        }
    }, [])

    const value = useMemo(() => ({
        user,
        token,
        async login(email: string, password: string) {
            const res = await authApi.login({email, password});
            const u = {id: res.userId, email: res.email, displayName: res.displayName};
            setUser(u);
            setToken(res.token);
            localStorage.setItem('auth', JSON.stringify({user:u, token: res.token}));
        },
        async register(email: string, password: string, displayName: string) {
            const res = await authApi.register({email, password, displayName});
            const u = {id: res.userId, email: res.email, displayName: res.displayName};
            setUser(u);
            setToken(res.token);
            localStorage.setItem('auth', JSON.stringify({user: u, token: res.token}));
        },
        logout() {setUser(null); setToken(null);localStorage.removeItem('auth');}
    }), [user, token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error('useAuth must be used within the AuthProvider');
    return ctx;
}