type UnsplashPhoto = {
    urls: { regular: string };
};

type UnsplashSearchResponse = {
    results: UnsplashPhoto[];
};

const UNSPLASH_BASE = 'https://api.unsplash.com';

export async function fetchCityImage(city: string): Promise<string | null> {
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!key) {
        console.warn('Missing VITE_UNSPLASH_ACCESS_KEY');
        return null;
    }
    const url =
        `${UNSPLASH_BASE}/search/photos` +
        `?query=${encodeURIComponent(city)}+city` +
        `&orientation=landscape&per_page=1&client_id=${key}`;

    const res = await fetch(url);

    if (!res.ok) {
        console.warn('Unsplash error:', res.status, await res.text());
        return null;
    }

    const data = (await res.json()) as UnsplashSearchResponse;
    const first = data.results[0];

    return first?.urls.regular ?? null;
}