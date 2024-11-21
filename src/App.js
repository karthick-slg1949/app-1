import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = '8977659be9ce39f5ceee90e90d04119e'
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const getWeather = async () => {
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      setError("City not found or invalid!");
      setWeatherData(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={getWeather}>Get Weather</button>

        {error && <p className="error">{error}</p>}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            <p>{weatherData.weather[0].description}</p>
            <h3>{weatherData.main.temp}°C</h3>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
