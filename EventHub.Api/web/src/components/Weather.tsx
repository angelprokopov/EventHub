import {useEffect, useState} from 'react'
import {getWeatherData} from "../api/weather.ts";

type weatherInfo = {
    main: {
        temperature: number,
        feels_like: number,
        humidity: number,
    }
    weather: {
        description: string,
        icon: string,
    }[]
}

export default function Weather({city}:{city:string}) {
    const [data, setData] = useState<weatherInfo | null>(null);
    const [error, setError] = useState('');
    useEffect(() => {
        async function load(){
            try{
                const info = await getWeatherData(city)
                setData(info)
            }catch(err){
                setError('Weather unavailable')
            }
        }

        if(city) {
            void load()
        }
    }, [city]);

    if(error) return <p className="error">{error}</p>
    if(!data) return <p className="muted">Loading weather...</p>

    const icon = data.weather?.[0]?.icon
    return (
        <div className="weather-box">
            <h3>Weather</h3>
            {icon && (
                <img
                    alt={"weather icon"}
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    style={{width:60}}
                />
            )}
            <p><strong>{data.weather[0].description}</strong></p>
            <p>Temperature: {data.main.temperature}°C</p>
            <p>Feels like: {data.main.feels_like}°C</p>
            <p>Humidity: {data.main.humidity}%</p>
        </div>
    )
}