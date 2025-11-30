import { useEffect, useState } from 'react';
import * as api from '../api/events';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';


export default function MyEvents() {
    const {user} = useAuth();
    const [events, setEvents] = useState<api.Event[]>([]);
    useEffect(() => {
        api.list().then(all => setEvents(all.filter(e => e.createdBy === user?.id)));
    }, [user]);
    return (
        <section className={"page"}>
            <h1>My Events</h1>
            <div className="grid">
                {events.map(e => <EventCard key={e.id} e={e}/>)}
            </div>
        </section>
    )
}