import { Link } from 'react-router-dom';
import type { Event } from '../api/events';

export default function EventCard({ e }: { e: Event }) {
    const date = new Date(e.startAt);
    const priceLabel =
        e.price && e.price > 0 ? `${e.price.toFixed(2)} €` : 'Free';

    return (
        <article className="event-card">
            <img
                src={e.imageUrl || 'https://picsum.photos/seed/eventhub/600/300'}
                alt={e.title}
            />
            <div className="event-card-body">
                <div className="event-card-top">
          <span className="badge-date">
            {date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            })}
          </span>
                    <span className="badge-price">{priceLabel}</span>
                </div>

                <h3 className="event-card-title">
                    <Link to={`/events/${e.id}`}>{e.title}</Link>
                </h3>

                <p className="muted event-card-meta">
                    {date.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}{' '}
                    · {e.location}
                </p>

                <p className="event-card-description">
                    {e.description.length > 120
                        ? `${e.description.slice(0, 117)}…`
                        : e.description}
                </p>
            </div>
        </article>
    );
}
