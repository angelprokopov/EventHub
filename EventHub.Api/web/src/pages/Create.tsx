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
    category: string;
};

type EventCreatePayload = Pick<
    api.Event,
    'title' | 'description' | 'startAt' | 'location' | 'price' | 'imageUrl' | 'category'
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
        category:'',
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
            category: values.category,
        };

        const created = await api.create(payload, token);
        nav(`/events/${created.id}`);
    }

    return (
        <section className="page create-page">
            <div className="form-card">
                <header className="form-header">
                    <h1>Create Event</h1>
                    <p className="muted">
                        Add the details for your event. You can always edit them later.
                    </p>
                </header>

                <form onSubmit={submit} className="form-grid">
                    <div className="field">
                        <label htmlFor="title" className="field-label">Title</label>
                        <input
                            id="title"
                            name="title"
                            value={values.title}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="description" className="field-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={values.description}
                            onChange={onChange}
                            required
                        />
                        <p className="field-help">
                            Briefly describe what people can expect at your event.
                        </p>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="startAt" className="field-label">Date &amp; time</label>
                            <input
                                id="startAt"
                                type="datetime-local"
                                name="startAt"
                                value={values.startAt}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="location" className="field-label">Location</label>
                            <input
                                id="location"
                                name="location"
                                value={values.location}
                                onChange={onChange}
                                placeholder="City, venue or address"
                                required
                            />
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="category" className="field-label">Category</label>
                            <input
                                id="category"
                                name="category"
                                value={values.category}
                                onChange={onChange}
                                placeholder="e.g. Tech, Music, Workshop"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="price" className="field-label">Price (optional)</label>
                            <input
                                id="price"
                                name="price"
                                value={values.price}
                                onChange={onChange}
                                placeholder="0 for free"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="imageUrl" className="field-label">Image URL</label>
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            value={values.imageUrl}
                            onChange={onChange}
                            placeholder="Link to a cover image"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary wide">
                            Create event
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}