import { Link } from 'react-router-dom';
import type { Event as EventModel } from '../api/events';
import { useCityImage } from '../hooks/useCityImage';

type Props = {
    e: EventModel;
    variant?: 'default' | 'dashboard';
};

export default function EventCard({ e, variant = 'default' }: Props) {
    const wrapperClass =
        variant === 'dashboard'
            ? 'event-card event-card--dashboard'
            : 'event-card';

    const cityImage = useCityImage(e.location, e.imageUrl);
    const imgSrc = cityImage || 'https://picsum.photos/400';

    const description =
        e.description.length > 80
            ? `${e.description.slice(0, 80)}…`
            : e.description;

    return (
        <article className={wrapperClass}>
            <Link to={`/events/${e.id}`}>
                <div style={{ position: 'relative' }}>
                    <img src={imgSrc} alt={e.title} />
                    <span className="event-card-pill">Science</span>
                </div>

                <div className="event-card-body">
                    <div className="event-card-top">
                        <h3 className="event-card-title">{e.title}</h3>
                    </div>
                    <p className="event-card-meta">
                        {new Date(e.startAt).toLocaleDateString()} · {e.location}
                    </p>
                    <p className="event-card-description">{description}</p>
                </div>
            </Link>
        </article>
    );
}
