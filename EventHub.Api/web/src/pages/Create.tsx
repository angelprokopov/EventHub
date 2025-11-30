import { useNavigate } from 'react-router-dom';
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

type EventCreatePayload = Pick<
    api.Event,
    'title' | 'description' | 'startAt' | 'location' | 'price' | 'imageUrl'
>;

export default function Create() {
    const { token } = useAuth();
    const nav = useNavigate();

    const { values, onChange } = useForm<EventFormValues>({
        title: '',
        description: '',
        startAt: '',
        location: '',
        price: '',
        imageUrl: '',
    });

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!token) return;

        const payload: EventCreatePayload = {
            title: values.title,
            description: values.description,
            startAt: values.startAt,
            location: values.location,
            imageUrl: values.imageUrl,
            price: values.price ? Number(values.price) : undefined,
        };

        const created = await api.create(payload, token);
        nav(`/events/${created.id}`);
    }

    return (
        <section className="page">
            <form onSubmit={submit} className="form">
                <h1>Create Event</h1>
                <input
                    name="title"
                    value={values.title}
                    onChange={onChange}
                    placeholder="Title"
                    required
                />
                <textarea
                    name="description"
                    value={values.description}
                    onChange={onChange}
                    placeholder="Description"
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
                    placeholder="Location"
                    required
                />
                <input
                    name="price"
                    value={values.price}
                    onChange={onChange}
                    placeholder="Price (optional)"
                />
                <input
                    name="imageUrl"
                    value={values.imageUrl}
                    onChange={onChange}
                    placeholder="Image URL"
                />
                <button>Create</button>
            </form>
        </section>

    );
}
