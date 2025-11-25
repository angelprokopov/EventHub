export async function getWeatherData(city: string) {
    const key = import.meta.env.VITE_WEATHER_KEY;
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`
    )

    if(!res.ok) {
        throw new Error("Failed to fetch weather data");
    }

    return res.json()
}