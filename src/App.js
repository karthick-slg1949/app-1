// import React, { useState } from "react";
// import axios from "axios";
// import './App.css';

// function App() {
//   const [city, setCity] = useState("");
//   const [weatherData, setWeatherData] = useState(null);
//   const [error, setError] = useState(null);

//   const apiKey = '8977659be9ce39f5ceee90e90d04119e'
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//   const handleInputChange = (event) => {
//     setCity(event.target.value);
//   };

//   const getWeather = async () => {
//     try {
//       const response = await axios.get(url);
//       setWeatherData(response.data);
//       setError(null);
//     } catch (err) {
//       setError("City not found or invalid!");
//       setWeatherData(null);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       getWeather();
//     }
//   };

//   return (
//     <div className="app">
//       <div className="container">
//         <h1>Weather App</h1>
//         <input
//           type="text"
//           placeholder="Enter city"
//           value={city}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyPress}
//         />
//         <button onClick={getWeather}>Get Weather</button>

//         {error && <p className="error">{error}</p>}

//         {weatherData && (
//           <div className="weather-info">
//             <h2>{weatherData.name}, {weatherData.sys.country}</h2>
//             <p>{weatherData.weather[0].description}</p>
//             <h3>{weatherData.main.temp}°C</h3>
//             <p>Humidity: {weatherData.main.humidity}%</p>
//             <p>Wind Speed: {weatherData.wind.speed} m/s</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import axios from 'axios';
import Sunny from '../src/assets/Images/sunny.png';
import Rainy from '../src/assets/Images/rainy.png';
import Cloudy from '../src/assets/Images/cloudy.png';
import Snow from '../src/assets/Images/snow.png';
import LoadingGif from '../src/assets/Images/loading.gif';
import { useEffect, useState } from 'react';

const Weatherapp = () => {
    const [data, SetData] = useState({});
    const [location, SetLocation] = useState('');
    const [loading, SetLoading] = useState(false);
    const API_KEY = "8977659be9ce39f5ceee90e90d04119e";

    // Fetch default weather (Bengaluru)
    useEffect(() => {
        const fetchDefaultWeather = async () => {
            SetLoading(true);
            const defaultLocation = 'Bengaluru';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=metric&appid=${API_KEY}`;
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

    // Handle user input change
    const handleInputChange = (e) => {
        SetLocation(e.target.value);
    };

    // Search weather by location
    const search = async () => {
        if (location.trim() !== '') {
            SetLoading(true);
            const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
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

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    // Mapping weather conditions to images
    const weatherImages = {
        Clear: Sunny,
        Clouds: Cloudy,
        Rain: Rainy,
        Snow: Snow,
        Haze: Cloudy,
        Mist: Cloudy,
    };

    // Get weather image
    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

    // Background styles based on weather conditions
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

    // Date formatting for current day
    const currentDate = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const dayOfMonth = currentDate.getDate();
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

    return (
        <div className="container" style={{ backgroundImage }}>
            <div
                className="weather-app"
                style={{ backgroundImage: backgroundImage.replace('to right', 'to top') }}
            >
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
                {loading ? (
                    <img className="loader" src={LoadingGif} alt="loading" />
                ) : data.notFound ? (
                    <div className="not-found">Not Found 😒</div>
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
                )}
            </div>
        </div>
    );
};

export default Weatherapp;
