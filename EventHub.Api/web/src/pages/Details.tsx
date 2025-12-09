import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as eventsApi from '../api/events';
import * as commentsApi from '../api/comments';
import { useAuth } from '../contexts/AuthContext';
import Map from '../components/Map';
import Weather from '../components/Weather';
import {useCityImage} from "../hooks/useCityImage.ts";
import '../styles/details.css'

export default function Details() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [event, setEvent] = useState<eventsApi.Event | null>(null);
    const [comments, setComments] = useState<commentsApi.Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const cityImageUrl = useCityImage(event?.location, event?.location);

    useEffect(() => {
        if (!eventId) return;

        async function load() {
            try {
                setLoading(true);
                setError('');
                const [eventData, commentData] = await Promise.all([
                    eventsApi.get(eventId!),
                    commentsApi.list(eventId!),
                ]);
                setEvent(eventData);
                setComments(commentData);
            } catch (err) {
                let message = 'Failed to load event details';
                if (err instanceof Error) message = err.message;
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [eventId]);

    const isOwner = user && event && user.id === event.createdBy;
    const likeCount = event?.likesCount ?? 0;

    async function handleDeleteEvent() {
        if (!eventId || !token) return;
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await eventsApi.remove(eventId, token);
            navigate('/events');
        } catch (err) {
            let message = 'Failed to delete event';
            if (err instanceof Error) message = err.message;
            setError(message);
        }
    }

    async function handleToggleLike() {
        if (!eventId || !token) return;
        try {
            await eventsApi.toggleLike(eventId, token);
            const updated = await eventsApi.get(eventId);
            setEvent(updated);
        } catch (err) {
            let message = 'Failed to like event';
            if (err instanceof Error) message = err.message;
            setError(message);
        }
    }

    async function handleAddComment() {
        if (!eventId || !token || !commentText.trim()) return;
        try {
            const created = await commentsApi.create(eventId, commentText.trim(), token);
            setComments(prev => [created, ...prev]);
            setCommentText('');
        } catch (err) {
            let message = 'Failed to add comment';
            if (err instanceof Error) message = err.message;
            setError(message);
        }
    }

    async function handleDeleteComment(id: string) {
        if (!eventId || !token) return;
        try {
            await commentsApi.remove(eventId, id, token);
            setComments(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            let message = 'Failed to delete comment';
            if (err instanceof Error) message = err.message;
            setError(message);
        }
    }

    if (loading) {
        return (
            <section className="details-page">
                <div className="details-loading container">
                    <p className="muted">Loading event…</p>
                </div>
            </section>
        );
    }

    if (!event) {
        return (
            <section className="details-page">
                <div className="container">
                    {error ? <p className="error">{error}</p> : <p className="error">Event not found.</p>}
                </div>
            </section>
        );
    }

    const date = new Date(event.startAt);
    const heroImg = cityImageUrl ?? 'https://picsum.photos/seed/event/1200/500'
    return (
        <section className="details-page">
            {/* HERO */}
            <div className="details-hero">
                <img
                    className="details-hero-img"
                    src={heroImg}
                    alt={event.title}
                />
                <div className="details-hero-overlay" />
                <div className="details-hero-content container">
                    <span className="details-pill">{event.category || 'Event'}</span>
                    <h1>{event.title}</h1>
                    <p className="details-meta-line">
                        {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                        {event.location}
                    </p>
                </div>
            </div>

            <main className="details-main container">
                {error && <p className="error">{error}</p>}

                <div className="details-layout">
                    {/* LEFT: main info */}
                    <article className="details-body">
                        <h2>About this event</h2>
                        <p className="details-description">{event.description}</p>

                        <div className="details-section-grid">
                            <div className="details-card">
                                <h3>Location</h3>
                                <p className="muted">{event.location}</p>
                                <div className="details-map-wrapper">
                                    <Map address={event.location} />
                                </div>
                            </div>

                            <div className="details-card">
                                <h3>Weather</h3>
                                <p className="muted">
                                    Current conditions near <strong>{event.location}</strong>
                                </p>
                                <div className="details-weather-wrapper">
                                    <Weather city={event.location} />
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* RIGHT: meta + actions */}
                    <aside className="details-sidebar">
                        <div className="details-card">
                            <h3>Event details</h3>
                            <ul className="details-meta-list">
                                <li>
                                    <span>Date</span>
                                    <strong>{date.toLocaleDateString()}</strong>
                                </li>
                                <li>
                                    <span>Time</span>
                                    <strong>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                                </li>
                                {event.category && (
                                    <li>
                                        <span>Category</span>
                                        <strong>{event.category}</strong>
                                    </li>
                                )}
                                {typeof event.price === 'number' && (
                                    <li>
                                        <span>Price</span>
                                        <strong>{event.price === 0 ? 'Free' : `${event.price.toFixed(2)} лв.`}</strong>
                                    </li>
                                )}
                                <li>
                                    <span>Likes</span>
                                    <strong>{likeCount}</strong>
                                </li>
                            </ul>

                            <div className="details-actions">
                                {user ? (
                                    <button type="button" className="btn-primary small" onClick={handleToggleLike}>
                                        {likeCount > 0 ? 'Like again' : 'Like this event'}
                                    </button>
                                ) : (
                                    <Link to="/login" className="btn-secondary small">
                                        Login to like
                                    </Link>
                                )}

                                {isOwner && (
                                    <div className="details-owner-actions">
                                        <Link to={`/events/${event.id}/edit`} className="btn-secondary small">
                                            Edit event
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn-danger small"
                                            onClick={handleDeleteEvent}
                                        >
                                            Delete event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* COMMENTS */}
                <section className="details-comments">
                    <div className="details-comments-header">
                        <h2>Comments</h2>
                        <span className="muted">{comments.length} comment{comments.length === 1 ? '' : 's'}</span>
                    </div>

                    {user ? (
                        <div className="comment-form">
              <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this event…"
              />
                            <button
                                type="button"
                                onClick={handleAddComment}
                                className="btn-primary small"
                                disabled={!commentText.trim()}
                            >
                                Post comment
                            </button>
                        </div>
                    ) : (
                        <p className="muted">
                            <Link to="/login">Login</Link> to leave a comment.
                        </p>
                    )}

                    <ul className="comments-list">
                        {comments.map(c => {
                            const canDelete = user?.id === c.id;
                            return (
                                <li key={c.id} className="comment-item">
                                    <div className="comment-header">
                                        <div>
                      <span className="comment-author">
                        {c.authorName || 'User'}
                      </span>
                                            <span className="comment-date">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                                        </div>
                                        {canDelete && (
                                            <button
                                                type="button"
                                                className="comment-delete"
                                                onClick={() => handleDeleteComment(c.id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <p className="comment-text">{c.text}</p>
                                </li>
                            );
                        })}
                        {comments.length === 0 && (
                            <li className="muted">No comments yet. Be the first to share your thoughts.</li>
                        )}
                    </ul>
                </section>
            </main>
        </section>
    );
}
