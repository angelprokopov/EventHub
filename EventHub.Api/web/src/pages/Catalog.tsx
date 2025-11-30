import { useEffect, useState } from 'react';
import * as api from '../api/events';
import EventCard from '../components/EventCard';

export default function Catalog() {
    const [events, setEvents] = useState<api.Event[]>([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function loadEvents(search?: string) {
        try {
            setLoading(true);
            setError('');
            const data = await api.list(search ? { q: search } : undefined);
            setEvents(data);
        } catch (err) {
            let message = 'Failed to load events';
            if (err instanceof Error) message = err.message;
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadEvents();
    }, []);

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        void loadEvents(q.trim() || undefined);
    }

    return (
        <section className={"page"}>
            <div className="catalog-header">
                <div>
                    <h1>All Events</h1>
                    <p className="catalog-subtitle">
                        Browse upcoming meetups, workshops and community gatherings.
                    </p>
                </div>
                <p className="catalog-meta">
                    {events.length > 0 && !loading && `${events.length} event${events.length === 1 ? '' : 's'}`}
                </p>
            </div>

            <form onSubmit={handleSearch} className="toolbar">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search by title or description..."
                />
                <button className="btn btn-primary" type="submit">
                    Search
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {loading && <p className="muted">Loading events…</p>}

            {!loading && events.length === 0 && !error && (
                <div className="empty-state">
                    <h3>No events yet</h3>
                    <p>
                        Once events are created, they’ll appear here. If you’re logged in,
                        you can be the first to create one.
                    </p>
                </div>
            )}

            {!loading && events.length > 0 && (
                <div className="grid">
                    {events.map(e => (
                        <EventCard key={e.id} e={e} />
                    ))}
                </div>
            )}
        </section>
    );
}
    