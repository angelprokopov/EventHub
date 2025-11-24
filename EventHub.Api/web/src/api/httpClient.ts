export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5173/';

export async function http<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    const text = await res.text();

    let data: unknown = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            // Non-JSON body
            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }
            throw new Error('Server returned invalid JSON response');
        }
    }

    if (!res.ok) {
        // ✅ Safely handle null / non-object bodies
        const obj =
            data && typeof data === 'object'
                ? (data as { message?: string; error?: string })
                : {};

        const message =
            obj.message ||
            obj.error ||
            text || // fall back to raw text if present
            `Request failed with status ${res.status}`;

        throw new Error(message);
    }

    return data as T;
}