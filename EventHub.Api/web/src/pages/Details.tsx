import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as eventsApi from '../api/events';
import * as commentsApi from '../api/comments';
import { useAuth } from '../contexts/AuthContext';

export default function Details() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [event, setEvent] = useState<eventsApi.Event | null>(null);
    const [comments, setComments] = useState<commentsApi.Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!eventId) return;

        eventsApi
            .get(eventId)
            .then(setEvent)
            .catch(err => {
                let message = 'Failed to load event';
                if (err instanceof Error) message = err.message;
                setError(message);
            });

        commentsApi
            .list(eventId)
            .then(setComments)
            .catch(err => {
                let message = 'Failed to load comments';
                if (err instanceof Error) message = err.message;
                setError(message);
            });
    }, [eventId]);

    const isOwner = user && event && user.id === event.createdBy;

    async function handleDeleteEvent() {
        if (!eventId || !token) return;
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

    if (!event) {
        return (
            <section>
                {error && <p className="error">{error}</p>}
                {!error && <p>Loading...</p>}
            </section>
        );
    }

    const likeCount = event.likes?.length ?? 0;

    return (
        <section>
            {error && <p className="error">{error}</p>}

            <img
                className="hero"
                src={event.imageUrl || 'https://picsum.photos/seed/hero/1200/400'}
                alt={event.title}
            />
            <h1>{event.title}</h1>
            <p className="muted">
                {new Date(event.startAt).toLocaleString()} — {event.location}
            </p>
            <p>{event.description}</p>
            <p>
                <strong>Likes:</strong> {likeCount}
            </p>

            <div className="actions">
                {user && (
                    <button type="button" onClick={handleToggleLike}>
                        Like
                    </button>
                )}
                {isOwner && (
                    <>
                        <Link to={`/events/${event.id}/edit`}>Edit</Link>
                        <button type="button" onClick={handleDeleteEvent}>
                            Delete
                        </button>
                    </>
                )}
            </div>

            <hr />
            <h2>Comments</h2>

            {user ? (
                <div className="comment-form">
          <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
          />
                    <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                    >
                        Post
                    </button>
                </div>
            ) : (
                <p>
                    <Link to="/login">Login</Link> to comment.
                </p>
            )}

            <ul className="comments">
                {comments.map(c => {
                    const canDelete = user?.id === c.authorId;
                    return (
                        <li key={c.id}>
                            <div className="comment-header">
                <span className="muted">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
                                {canDelete && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteComment(c.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p>{c.text}</p>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
