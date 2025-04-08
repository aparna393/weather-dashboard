import { useState, useEffect } from 'react';
import './index.css';
import { Sun, Moon } from 'lucide-react';

const API_KEY = '58828b3a21853f23be33f2e91cdc5ed6';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Update body class for global dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
      setHistory((prev) => {
        const updated = [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())];
        return updated.slice(0, 5);
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-700 text-white'
          : 'bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800'
      } flex flex-col items-center justify-start p-10 transition-all duration-500`}
    >
      {/* Theme Toggle Button */}
      <div className="self-end mr-6 mb-4">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
        >
          {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-800" />}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6">🌤️ Weather Dashboard</h1>

      {/* Input & Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter city..."
          className="px-4 py-2 rounded-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={getWeather}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && <p className="mb-4 animate-pulse">Fetching weather...</p>}

      {/* Weather Card */}
      {weather && weather.main && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center space-y-2 w-full max-w-md mb-6">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
            className="mx-auto"
          />
          <p className="text-3xl">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {(weather.wind.speed * 3.6).toFixed(2)} km/h</p>
        </div>
      )}

      {/* Recent Search History */}
      {history.length > 0 && (
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Recent Searches</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCity(item);
                  getWeather();
                }}
                className="px-3 py-1 bg-blue-200 dark:bg-gray-700 rounded-full text-sm hover:bg-blue-300 dark:hover:bg-gray-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
