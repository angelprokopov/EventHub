export const API_BASE = import.meta.env.VITE_API_URL ?? "https://eventhubapi-hehvaravgzcpbdf5.canadacentral-01.azurewebsites.net";

export async function http<T>(
    path: string,                     // 👈 must start with '/'
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
            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }
            throw new Error('Server returned invalid JSON response');
        }
    }

    if (!res.ok) {
        const obj =
            data && typeof data === 'object'
                ? (data as { message?: string; error?: string })
                : {};
        const message =
            obj.message ||
            obj.error ||
            text ||
            `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return data as T;
}