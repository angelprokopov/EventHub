import {useEffect, useMemo, useState} from 'react';
import * as eventsApi from '../api/events';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';

export default function MyEvents() {
    const { user, token } = useAuth();
    const [events, setEvents] = useState<eventsApi.Event[]>([]);
    const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;
        async function load() {
            try {
                setLoading(true);
                setError('');
                const data = await eventsApi.list({});
                setEvents(data.filter(e => e.createdBy === user?.id));
            } catch (err) {
                let message = 'Failed to load events';
                if (err instanceof Error) message = err.message;
                setError(message);
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [token, user?.id]);

    const now = new Date();

    const filtered = useMemo(
        () =>
            events
                .slice()
                .sort(
                    (a, b) =>
                        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
                )
                .filter(e =>
                    view === 'upcoming'
                        ? new Date(e.startAt) >= now
                        : new Date(e.startAt) < now
                ),
        [events, view, now]
    );

    const upcomingCount = events.filter(e => new Date(e.startAt) >= now).length;
    const pastCount = events.length - upcomingCount;

    return (
        <section className="my-events-page">
            <header className="my-events-header">
                <div>
                    <h1>My Events</h1>
                    <p className="muted">
                        Manage the events you have created, see what is coming next and what
                        has already passed.
                    </p>
                </div>

                <div className="my-events-stats">
                    <div>
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{events.length}</span>
                    </div>
                    <div>
                        <span className="stat-label">Upcoming</span>
                        <span className="stat-value">{upcomingCount}</span>
                    </div>
                    <div>
                        <span className="stat-label">Past</span>
                        <span className="stat-value">{pastCount}</span>
                    </div>
                </div>
            </header>

            <div className="my-events-toggle">
                <button
                    type="button"
                    className={view === 'upcoming' ? 'active' : ''}
                    onClick={() => setView('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    type="button"
                    className={view === 'past' ? 'active' : ''}
                    onClick={() => setView('past')}
                >
                    Past
                </button>
            </div>

            {error && <p className="error">{error}</p>}
            {loading && <p className="muted">Loading your events…</p>}

            {!loading && filtered.length === 0 && !error && (
                <div className="empty-state">
                    <h3>No {view === 'upcoming' ? 'upcoming' : 'past'} events</h3>
                    <p>
                        When you create events, they will appear here. You can create one
                        from the navigation above.
                    </p>
                </div>
            )}

            {!loading && filtered.length > 0 && (
                <div className="my-events-grid">
                    {filtered.map(e => (
                        <EventCard key={e.id} e={e} />
                    ))}
                </div>
            )}
        </section>
    );
}
