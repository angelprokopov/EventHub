import { useEffect, useState } from 'react';
import { fetchCityImage } from '../api/unsplash';

export function useCityImage(
    location: string | undefined,
    explicitImageUrl?: string
) {
    const [url, setUrl] = useState<string | undefined>(explicitImageUrl);

    useEffect(() => {
        if (explicitImageUrl || !location) return;

        let cancelled = false;

        (async () => {
            try {
                const img = await fetchCityImage(location);
                if (!cancelled && img) {
                    setUrl(img);
                }
            } catch (err) {
                console.error('Failed to load city image', err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [location, explicitImageUrl]);

    return url;
}
