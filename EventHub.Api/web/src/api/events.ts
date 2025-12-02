import { http } from './httpClient';


export type Event = {
    id: string;
    title: string;
    description: string;
    startAt: string;
    location: string;
    price?: number;
    imageUrl: string;
    createdBy: string;
    likesCount: number;
};

// List events, optionally with filters (search, location)
export function list(params?: { q?: string; location?: string }) {
    const qs = new URLSearchParams();

    if (params?.q) {
        qs.append('q', params.q);
    }

    if (params?.location) {
        qs.append('location', params.location);
    }

    const query = qs.toString();

    return http<Event[]>(`/api/events${query ? `?${query}` : ''}`);
}

export function get(id: string) {
    return http<Event>(`/api/events/${id}`);
}

export function create(data: Partial<Event>, token: string) {
    return http<Event>(
        `/api/events`,
        { method: 'POST', body: JSON.stringify(data) },
        token,
    );
}

export function update(id: string, data: Partial<Event>, token: string) {
    return http<void>(
        `/api/events/${id}`,
        { method: 'PUT', body: JSON.stringify(data) },
        token,
    );
}

export function remove(id: string, token: string) {
    return http<void>(`/api/events/${id}`, { method: 'DELETE' }, token);
}

export function toggleLike(id: string, token: string) {
    return http<{ likes: number }>(
        `/api/events/${id}/like`,
        { method: 'POST' },
        token,
    );
}

export function getUpcoming() {
    return http<Event[]>('/api/events/upcoming');
}

export function search(query: string) {
    const trimmed = query.trim();

    // If nothing typed → just load all events
    if (!trimmed) {
        return list();
    }

    return list({ q: trimmed });
}