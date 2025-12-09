import { useEffect, useMemo, useState } from 'react';
import * as eventsApi from '../api/events';
import EventCard from '../components/EventCard';
import '../styles/catalog.css'

type ViewMode = 'all' | 'upcoming' | 'past';

export default function Catalog() {
    const [events, setEvents] = useState<eventsApi.Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('all');

    async function loadEvents() {
        try {
            setLoading(true);
            setError('');

            const params: { q?: string; location?: string } = {};
            if (search.trim()) params.q = search.trim();
            if (location.trim()) params.location = location.trim();

            const data = await eventsApi.list(params);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        void loadEvents();
    }

    const now = new Date();

    const filteredEvents = useMemo(() => {
        const sorted = [...events].sort(
            (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        );

        if (viewMode === 'upcoming') {
            return sorted.filter(e => new Date(e.startAt) >= now);
        }

        if (viewMode === 'past') {
            return sorted.filter(e => new Date(e.startAt) < now);
        }

        return sorted;
    }, [events, viewMode, now]);

    const resultCount = filteredEvents.length;

    return (
        <section className="catalog-page">
            <div className="container">
                {/* Header */}
                <header className="catalog-header">
                    <div>
                        <h1>All events</h1>
                        <p className="muted">
                            Browse upcoming and past events created by the community.
                        </p>
                    </div>

                    <div className="catalog-stats">
                        <div>
                            <span className="stat-label">Total</span>
                            <span className="stat-value">{events.length}</span>
                        </div>
                        <div>
                            <span className="stat-label">Showing</span>
                            <span className="stat-value">{resultCount}</span>
                        </div>
                    </div>
                </header>

                {/* Toolbar */}
                <form className="catalog-toolbar" onSubmit={handleSubmit}>
                    <div className="catalog-search-group">
                        <label className="field-label" htmlFor="search">
                            Search
                        </label>
                        <input
                            id="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by title or description..."
                        />
                    </div>

                    <div className="catalog-search-group">
                        <label className="field-label" htmlFor="location">
                            Location
                        </label>
                        <input
                            id="location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="City or venue"
                        />
                    </div>

                    <div className="catalog-view-toggle">
                        <span className="field-label">Filter</span>
                        <div className="pill-toggle">
                            <button
                                type="button"
                                className={viewMode === 'all' ? 'active' : ''}
                                onClick={() => setViewMode('all')}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={viewMode === 'upcoming' ? 'active' : ''}
                                onClick={() => setViewMode('upcoming')}
                            >
                                Upcoming
                            </button>
                            <button
                                type="button"
                className={viewMode === 'past' ? 'active' : ''}
                onClick={() => setViewMode('past')}
              >
                Past
              </button>
            </div>
          </div>

          <div className="catalog-actions">
            <button type="submit" className="btn-primary small">
              Apply filters
            </button>
          </div>
        </form>

        {/* Error / loading */}
        {error && <p className="error">{error}</p>}
        {loading && <p className="muted">Loading events…</p>}

        {/* Empty state */}
        {!loading && !error && resultCount === 0 && (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>
              Try adjusting your search or filters. When new events are created,
              they will appear here.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && resultCount > 0 && (
          <div className="catalog-grid">
            {filteredEvents.map(e => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
