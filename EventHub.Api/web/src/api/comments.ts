import { http } from './httpClient';


export type Comment = { id: string; eventId: string; authorId: string; text: string; createdAt: string };
export function list(eventId: string) { return http<Comment[]>(`/api/events/${eventId}/comments`); }
export function create(eventId: string, text: string, token: string) {
    return http<Comment>(`/api/events/${eventId}/comments`, { method: 'POST', body: JSON.stringify({ text }) }, token);
}
export function remove(eventId: string, id: string, token: string) {
    return http<void>(`/api/events/${eventId}/comments/${id}`, { method: 'DELETE' }, token);
}