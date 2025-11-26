import {useEffect, useState} from 'react'
import {getWeatherData} from "../api/weather.ts";

type WeatherInfo = {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: { description: string; icon: string }[];
};

export default function Weather({ city }: { city: string }) {
    const [data, setData] = useState<WeatherInfo | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const info = await getWeatherData(city);
                setData(info);
            } catch {
                setError('Weather unavailable');
            }
        }

        if (city) {
            void load();
        }
    }, [city]);

    if (error) return <p className="error">{error}</p>;
    if (!data) return <p className="muted">Loading weather…</p>;

    const icon = data.weather?.[0]?.icon;
    const description = data.weather?.[0]?.description ?? '';

    return (
        <div className="weather-card">
            <div className="weather-header">
                <h3>Weather</h3>
            </div>

            <div className="weather-body">
                {icon && (
                    <img
                        alt="weather icon"
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        className="weather-icon"
                    />
                )}

                <div className="weather-main">
                    <p className="weather-description">
                        {description.charAt(0).toUpperCase() + description.slice(1)}
                    </p>
                    <p>
                        <strong>Temperature:</strong>{' '}
                        {data.main.temp.toFixed(1)}°C
                    </p>
                    <p>
                        <strong>Feels like:</strong>{' '}
                        {data.main.feels_like.toFixed(1)}°C
                    </p>
                    <p>
                        <strong>Humidity:</strong> {data.main.humidity}%
                    </p>
                </div>
            </div>
        </div>
    );
}