import {useEffect, useRef} from 'react'
import L from 'leaflet'

type MapProps = {
    address: string
}

export default function Map({ address }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(!mapRef.current || !address) return

        // Creating the map
        const map = L.map(mapRef.current, {
            zoomControl: false,
            scrollWheelZoom: false,
        }).setView([42.6977, 23.3219], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Geocode the address using OpenStreetMap Nominatim
        const controller = new AbortController();

        async function geocode() {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        address,
                    )}`,
                    {
                        headers: {
                            // helps to be polite towards the API
                            'Accept-Language': 'en',
                        },
                        signal: controller.signal,
                    },
                );

                const data: Array<{ lat: string; lon: string }> = await res.json();
                if (data[0]) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    const pos: [number, number] = [lat, lon];

                    map.setView(pos, 14);
                    L.marker(pos).addTo(map).bindPopup(address).openPopup();
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Geocoding failed', err);
                }
            }
        }

        void geocode();
        return() => {
            controller.abort()
            map.remove()
        }
    }, [address])
    return (
        <div
            ref={mapRef}
            style={{
                height: 300,
                width: '100%',
                borderRadius: 12,
                overflow: 'hidden',
            }}
        />
    )
}