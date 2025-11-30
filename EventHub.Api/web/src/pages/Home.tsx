import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
    const { user } = useAuth();

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
                                <div className="home-hero-badge">Tonight · 19:00</div>
                                <h3>React Sofia Meetup</h3>
                                <p className="muted">Talks · Networking · Pizza</p>
                                <p className="home-hero-card-footer">38 people attending</p>
                            </div>

                            <div className="home-hero-card secondary">
                                <h4>Plan your next event</h4>
                                <p className="muted">
                                    Create an event in minutes, share a link, and track interest.
                                </p>
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
