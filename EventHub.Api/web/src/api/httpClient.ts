export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function http<T>(path:string, options: RequestInit = {}, token?: string | null): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`,{
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        ...options
    })
    if(res.status !== 200)
        throw new Error(await res.text());
    return res.json();
}