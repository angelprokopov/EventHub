import { http } from './httpClient';


export type Event = {
    id: string; title: string; description: string; startAt: string; location: string; price?: number; imageUrl: string; createdBy: string; likesCount: number;
}


export function list(params?: { q?: string; location?: string }) {
    const qs = new URLSearchParams(params as any).toString();
    return http<Event[]>(`/api/events${qs ? `?${qs}` : ''}`);
}
export function get(id: string) { return http<Event>(`/api/events/${id}`); }
export function create(data: Partial<Event>, token: string) {
    return http<Event>(`/api/events`, { method: 'POST', body: JSON.stringify(data) }, token);
}

export function update(id: string, data: Partial<Event>, token: string) {
    return http<void>(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token);
}
export function remove(id: string, token: string) {
    return http<void>(`/api/events/${id}`, { method: 'DELETE' }, token);
}
export function toggleLike(id: string, token: string) {
    return http<{ likes: number }>(`/api/events/${id}/like`, { method: 'POST' }, token);
}