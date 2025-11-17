import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import * as api from '../api/events';
import { useAuth } from '../contexts/AuthContext';

type EventFormValues = {
    title: string;
    description: string;
    startAt: string;
    location: string;
    price: string;
    imageUrl: string;
};

type EventUpdatePayload = Pick<
    api.Event,
    'title' | 'description' | 'startAt' | 'location' | 'price' | 'imageUrl'
>;

export default function Edit() {
    const { eventId } = useParams();
    const { token } = useAuth();
    const nav = useNavigate();

    const { values, setValues, onChange } = useForm<EventFormValues>({
        title: '',
        description: '',
        startAt: '',
        location: '',
        price: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (!eventId) return;

        api.get(eventId).then(e =>
            setValues({
                title: e.title,
                description: e.description,
                startAt: e.startAt.slice(0, 16),
                location: e.location,
                price: e.price?.toString() ?? '',
                imageUrl: e.imageUrl,
            }),
        );
    }, [eventId, setValues]);

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!token || !eventId) return;

        const payload: EventUpdatePayload = {
            title: values.title,
            description: values.description,
            startAt: values.startAt,
            location: values.location,
            imageUrl: values.imageUrl,
            price: values.price ? Number(values.price) : undefined,
        };

        await api.update(eventId, payload, token);
        nav(`/events/${eventId}`);
    }

    return (
        <form onSubmit={submit} className="form">
            <h1>Edit Event</h1>
            <input name="title" value={values.title} onChange={onChange} required />
            <textarea
                name="description"
                value={values.description}
                onChange={onChange}
                required
            />
            <input
                type="datetime-local"
                name="startAt"
                value={values.startAt}
                onChange={onChange}
                required
            />
            <input
                name="location"
                value={values.location}
                onChange={onChange}
                required
            />
            <input name="price" value={values.price} onChange={onChange} />
            <input name="imageUrl" value={values.imageUrl} onChange={onChange} />
            <button>Save</button>
        </form>
    );
}
