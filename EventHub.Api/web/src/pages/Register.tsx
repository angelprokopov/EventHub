import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await register(email, password, displayName);
            nav('/');
        } catch (err) {
            let message = 'Registration failed';

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
                    <h1>Register</h1>
                    {error && <p className="error">{error}</p>}
                    <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Display name"
                    />
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button className="btn btn-primary">Create account</button>
                </form>
            </div>
        </section>
    );
}
