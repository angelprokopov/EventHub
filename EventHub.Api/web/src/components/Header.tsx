import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <Link to="/" className="logo">
                EventHub
            </Link>

            <nav className="nav">
                <NavLink
                    to="/events"
                    className={({ isActive }) =>
                        'nav-link' + (isActive ? ' active' : '')
                    }
                >
                    Events
                </NavLink>
                {user && (
                    <NavLink
                        to="/events/create"
                        className={({ isActive }) =>
                            'nav-link' + (isActive ? ' active' : '')
                        }
                    >
                        Create
                    </NavLink>
                )}
                {user && (
                    <NavLink
                        to="/me/events"
                        className={({ isActive }) =>
                            'nav-link' + (isActive ? ' active' : '')
                        }
                    >
                        My Events
                    </NavLink>
                )}
            </nav>

            <div className="header-right">
                {!user ? (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' active' : '')
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                'nav-link ml' + (isActive ? ' active' : '')
                            }
                        >
                            Register
                        </NavLink>
                    </>
                ) : (
                    <>
                        <span className="muted">Hi, {user.displayName}</span>
                        <button type="button" className="btn btn-ghost" onClick={logout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
