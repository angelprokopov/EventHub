import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import * as api from "../api/events";
import { useState } from "react";
import '../styles/home.css'
import EditIcon from '../assets/icons/edit.svg'
import HearIcon from '../assets/icons/heart.svg'
import CalendarIcon from '../assets/icons/calendar.svg'

export default function Home() {
    const [nextEvent, setNextEvent] = useState<api.Event | null>(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        api.list().then(events => {
            const sorted = [...events].sort(
                (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
            );
            setNextEvent(sorted[0]);
        });
    }, []);

    return (
        <div className="home-container">

            {/* ========== HERO SECTION ========== */}
            <section className="hero">

                <span className="tagline" data-aos="fade-up">
                    COMMUNITY EVENTS, IN ONE PLACE
                </span>

                <h1 className="hero-title" data-aos="fade-up" data-aos-delay="150">
                    Welcome to <span>EventHub</span>
                </h1>

                <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="300">
                    Discover meetups, conferences and workshops around you.
                    Share your own events and grow your community.
                </p>

                <div className="hero-buttons" data-aos="fade-up" data-aos-delay="450">
                    <Link to="/events" className="btn-primary glow">
                        Browse events
                    </Link>
                    <Link to="/events/create" className="btn-secondary">
                        Create an event
                    </Link>
                </div>

                <div className="stats" data-aos="fade-up" data-aos-delay="600">
                    <div>
                        <h3>24</h3>
                        <span>Upcoming events</span>
                    </div>
                    <div>
                        <h3>120+</h3>
                        <span>Members</span>
                    </div>
                    <div>
                        <h3>5</h3>
                        <span>Cities</span>
                    </div>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="wave-divider"></div>

            {/* ========== NEXT EVENT SECTION ========== */}
            {nextEvent && (
                <section className="next-event-section" data-aos="fade-up">
                    <h2>Next events</h2>

                    <div className="event-card">
                        <img src={nextEvent.imageUrl} alt={nextEvent.title} className="event-img" />

                        <div className="event-content">
                            <span className="category-tag">{nextEvent.category}</span>
                            <h3>{nextEvent.title}</h3>

                            <p className="event-info">
                                {new Date(nextEvent.startAt).toLocaleDateString()} · {nextEvent.location}
                            </p>

                            <p className="event-description">
                                {nextEvent.description.slice(0, 120)}...
                            </p>

                            <Link to={`/events/${nextEvent.id}`} className="btn-primary small">
                                View details
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ========== FEATURES SECTION ========== */}
            <section className="features" data-aos="fade-up">
                <h2>Why use EventHub?</h2>

                <div className="feature-grid">
                    <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
                        <img src={EditIcon} className="feature-icon" />
                        <h3>Easy event creation</h3>
                        <p>Set a title, date, location and description and publish with one click.</p>
                    </div>

                    <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                        <img src={CalendarIcon} className="feature-icon" />
                        <h3>Stay in the loop</h3>
                        <p>See upcoming events in one catalog and track details on a dedicated page.</p>
                    </div>

                    <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
                        <img src={HearIcon} className="feature-icon" />
                        <h3>Engage your community</h3>
                        <p>Likes and comments help you understand interest and collect feedback.</p>
                    </div>
                </div>
            </section>

        </div>
    );
}
