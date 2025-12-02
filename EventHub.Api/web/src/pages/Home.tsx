import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {useEffect, useState} from 'react';
import * as eventsApi from '../api/events'
import EventCard from "../components/EventCard.tsx";

export default function Home() {
    const { user } = useAuth();
    const [nextEvents, setNextEvents] = useState<eventsApi.Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const upcoming = await eventsApi.getUpcoming()
            setNextEvents(upcoming)
            setLoading(false)
        }
        load()
    }, []);

    return (
        <section className="page">
            <>
                <section className="home-hero">
                    <div className="home-hero-inner">
                        <div className="home-hero-left">
                            <span className="home-pill">Community events, in one place</span>
                            <h1>Welcome to EventHub</h1>
                            <p className="home-subtitle">
                                Discover meetups, conferences, and workshops around you.
                                Share your own events and grow your community.
                            </p>

                            <div className="home-actions">
                                <Link to="/events" className="btn btn-primary">
                                    Browse events
                                </Link>

                                {user ? (
                                    <Link to="/events/create" className="btn btn-ghost">
                                        Create an event
                                    </Link>
                                ) : (
                                    <Link to="/register" className="btn btn-ghost">
                                        Get started
                                    </Link>
                                )}
                            </div>

                            <div className="home-stats">
                                <div>
                                    <span className="home-stats-number">24</span>
                                    <span className="home-stats-label">Upcoming events</span>
                                </div>
                                <div>
                                    <span className="home-stats-number">120+</span>
                                    <span className="home-stats-label">Members</span>
                                </div>
                                <div>
                                    <span className="home-stats-number">5</span>
                                    <span className="home-stats-label">Cities</span>
                                </div>
                            </div>
                        </div>
                        <div className="home-hero-right" aria-hidden="true">
                            <div className="home-hero-card">
                                <h4>Plan your next event</h4>
                                <p className="muted">
                                    Create an event in minutes, share a link, and track interest.
                                </p>
                            </div>
                            <div className="home-hero-card">
                                <h2>Next events</h2>
                                {loading && <p>Loading...</p>}
                                {!loading && nextEvents.length === 0 && (<p>No upcoming events yet.</p>)}
                                <div className="grid">
                                    {nextEvents.map(e=>(<EventCard key={e.id} e={e}/>))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="home-features">
                    <h2>Why use EventHub?</h2>
                    <div className="home-features-grid">
                        <article className="home-feature-card">
                            <h3>Easy event creation</h3>
                            <p>
                                Set a title, date, location, and description – publish with a single click.
                            </p>
                        </article>
                        <article className="home-feature-card">
                            <h3>Stay in the loop</h3>
                            <p>
                                See all upcoming events in one catalog and track details on a dedicated page.
                            </p>
                        </article>
                        <article className="home-feature-card">
                            <h3>Engage your community</h3>
                            <p>
                                Likes and comments help you understand interest and collect feedback.
                            </p>
                        </article>
                    </div>
                </section>
            </>
        </section>

    );
}
