import axios from 'axios';
import Sunny from '../assets/Images/sunny.png';
import Rainy from '../assets/Images/rainy.png';
import Cloudy from '../assets/Images/cloudy.png';
import Snow from '../assets/Images/snow.png';
import LoadingGif from '../assets/Images/loading.gif';
import { useEffect, useState } from 'react';

const Weatherapp = () => {
    const [data, SetData] = useState({});
    const [location, SetLocation] = useState('');
    const [loading, SetLoading] = useState(false);
    const API_KEY = "8977659be9ce39f5ceee90e90d04119e";

    useEffect(() => {
        const fetchDefaultWeather = async () => {
            SetLoading(true);
            const defaultLocation = 'Bengaluru';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${API_KEY}`;
            try {
                const response = await axios.get(url);
                SetData(response.data);
            } catch (error) {
                console.error('Error fetching default weather:', error);
            } finally {
                SetLoading(false);
            }
        };
        fetchDefaultWeather();
    }, []);

    const handleInputChange = (e) => {
        SetLocation(e.target.value);
    };

    const search = async () => {
        if (location.trim() !== '') {
            SetLoading(true);
            const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${API_KEY}`;
            try {
                const response = await axios.get(API_URL);
                if (response.data.cod !== 200) {
                    SetData({ notFound: true });
                } else {
                    SetData(response.data);
                    SetLocation('');
                }
            } catch (error) {
                SetData({ notFound: true });
                console.error('Error fetching weather data:', error);
            } finally {
                SetLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    const weatherImages = {
        Clear: Sunny,
        Clouds: Cloudy,
        Rain: Rainy,
        Snow: Snow,
        Haze: Cloudy,
        Mist: Cloudy,
    };

    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

    const backgroundImages = {
        Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
        Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
        Snow: 'linear-gradient(to right, #aff2ff, #fff)',
        Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Mist: 'linear-gradient(to right, #57d6d4, #71eeec)',
    };

    const backgroundImage = data.weather
        ? backgroundImages[data.weather[0].main]
        : 'linear-gradient(to right, #f3b07c, #fcd283)';

    const currentDate = new Date();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const dayofMonth = currentDate.getDate();
    const formattedDate = `${dayOfWeek}, ${dayofMonth} ${month}`;

    return (
        <div className="container" style={{ backgroundImage }}>
            <div className="weather-app" style={{ backgroundImage: backgroundImage && backgroundImage.replace ? backgroundImage.replace('to right', 'to top') : null }}>
          <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">{data.name}</div>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
                    </div>
                </div>      
                {
                    loading ? (
                        <img className='loader' src={LoadingGif} alt='loading' />
                    ) : data.notFound ? (
                        <div className='not-found'>Not Found 😒</div>
                    ) : (
                        <>
                            <div className="weather">
                                <img src={weatherImage} alt="weather" />
                                <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
                                <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
                            </div>
                            <div className="weather-date">
                                <p>{formattedDate}</p>
                            </div>
                            <div className="weather-data">
                                <div className="humidity">
                                    <div className="date-name">Humidity</div>
                                    <i className="fa-solid fa-droplet"></i>
                                    <div className="data">{data.main ? data.main.humidity : null}%</div>
                                </div>
                                <div className="wind">
                                    <div className="date-name">Wind</div>
                                    <i className="fa-solid fa-wind"></i>
                                    <div className="data">{data.wind ? data.wind.speed : null} km/h</div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Weatherapp;

