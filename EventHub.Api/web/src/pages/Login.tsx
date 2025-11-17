import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type LocationState = {
    from?: {
        pathname: string;
    };
};

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Safely read the redirect target
    const from = (location.state as LocationState | null)?.from?.pathname ?? '/';

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await login(email, password);
            nav(from);
        } catch (err) {
            let message = 'Login failed';

            if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
        }
    }

    return (
        <section className="page-center">
            <div className="card">
                <form onSubmit={submit} className="form">
                    <h1>Login</h1>
                    {error && <p className="error">{error}</p>}
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button className="btn btn-primary">Login</button>
                </form>
            </div>
        </section>
    );
}
