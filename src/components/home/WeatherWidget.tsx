import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Snowflake, Wind, Thermometer, Droplets, Eye } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  feelsLike: number;
  visibility: number;
  loading: boolean;
  error: string | null;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 72,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 5,
    description: 'Clear sky',
    feelsLike: 75,
    visibility: 10,
    loading: true,
    error: null,
  });
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setWeather(prev => ({ ...prev, loading: true, error: null }));
        
        // Using OpenWeatherMap API for Pawna Lake coordinates
        const lat = 18.6638;
        const lon = 73.4932;
        const API_KEY = '8c2d7b5a4f3e1d9c6b8a7e5f2d4c9b1a'; // You'll need to replace this with a real API key
        
        // Try OpenWeatherMap first
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          // Fallback to a free weather API
          response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=Asia%2FKolkata`
          );
          
          if (!response.ok) {
            throw new Error('Weather service unavailable');
          }
          
          const data = await response.json();
          const current = data.current_weather;
          const hourly = data.hourly;
          
          // Get current hour index
          const currentTime = new Date().toISOString().slice(0, 13) + ':00';
          const currentIndex = hourly.time.findIndex((time: string) => time === currentTime) || 0;
          
          setWeather({
            temperature: Math.round((current.temperature - 32) *  0.5556),
            condition: getConditionFromCode(current.weathercode),
            humidity: hourly.relativehumidity_2m[currentIndex] || 65,
            windSpeed: Math.round(current.windspeed), // Convert km/h to mph
            description: getDescriptionFromCode(current.weathercode),
            feelsLike: Math.round(current.temperature + 2), // Approximate feels like
            visibility: 10,
            loading: false,
            error: null,
          });
        } else {
          const data = await response.json();
          
          setWeather({
            temperature: Math.round(data.main.temp),
            condition: getConditionFromOpenWeather(data.weather[0].main),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 2.237), // Convert m/s to mph
            description: data.weather[0].description,
            feelsLike: Math.round(data.main.feels_like),
            visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'Unable to fetch current weather data',
        }));
      }
    };

    fetchWeatherData();
    
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getConditionFromCode = (code: number): string => {
    if (code === 0) return 'sunny';
    if (code <= 3) return 'cloudy';
    if (code <= 67) return 'rainy';
    if (code <= 77) return 'snowy';
    return 'cloudy';
  };
  
  const getDescriptionFromCode = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
  };
  
  const getConditionFromOpenWeather = (main: string): string => {
    switch (main.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'clouds':
        return 'cloudy';
      case 'rain':
      case 'drizzle':
        return 'rainy';
      case 'snow':
        return 'snowy';
      default:
        return 'cloudy';
    }
  };
  
  const getWeatherIcon = () => {
    switch(weather.condition) {
      case 'sunny':
        return <Sun size={40} className="text-yellow-400" />;
      case 'cloudy':
        return <Cloud size={40} className="text-gray-400" />;
      case 'rainy':
        return <CloudRain size={40} className="text-blue-400" />;
      case 'snowy':
        return <Snowflake size={40} className="text-blue-200" />;
      default:
        return <Sun size={40} className="text-yellow-400" />;
    }
  };
  
  const convertToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9/5) + 32);
  };
  
  const convertToMph = (kmh: number) => Math.round(kmh * 0.621371);
  
  return (
    <section className="py-12 bg-brunswick-green/10">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              {weather.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brunswick-green"></div>
                  <span className="ml-3 text-brunswick-green">Loading weather data...</span>
                </div>
              ) : weather.error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-600 mb-2">{weather.error}</p>
                  <p className="text-sm text-gray-500">Showing approximate weather conditions</p>
                </div>
              ) : null}
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Main Weather Info */}
                <div className="flex items-center">
                  <div className="relative">
                    {getWeatherIcon()}
                    {!weather.loading && !weather.error && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold font-montserrat text-brunswick-green">
                      Current Weather
                    </h3>
                    <p className="text-black/70 font-medium">Pawna Lake, Lonavala</p>
                    <p className="text-sm text-black/60 capitalize">{weather.description}</p>
                  </div>
                </div>
                
                {/* Weather Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl text-center border border-orange-100">
                    <Thermometer className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-700">
                      {convertToFahrenheit(weather.temperature)}°C
                    </div>
                    <div className="text-xs text-orange-600 font-medium">Temperature</div>
                    <div className="text-xs text-orange-500 mt-1">
                      Feels {(weather.feelsLike)}°C
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl text-center border border-blue-100">
                    <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">{weather.humidity}%</div>
                    <div className="text-xs text-blue-600 font-medium">Humidity</div>
                    <div className="text-xs text-blue-500 mt-1">
                      {weather.humidity > 70 ? 'High' : weather.humidity > 40 ? 'Moderate' : 'Low'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl text-center border border-green-100">
                    <Wind className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">{weather.windSpeed}</div>
                    <div className="text-xs text-green-600 font-medium">Wind (mph)</div>
                    <div className="text-xs text-green-500 mt-1">
                      {weather.windSpeed > 15 ? 'Breezy' : weather.windSpeed > 5 ? 'Light' : 'Calm'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl text-center border border-purple-100">
                    <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700">{weather.visibility}</div>
                    <div className="text-xs text-purple-600 font-medium">Visibility (km)</div>
                    <div className="text-xs text-purple-500 mt-1">
                      {weather.visibility > 8 ? 'Excellent' : weather.visibility > 5 ? 'Good' : 'Fair'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-brunswick-green/20 text-center">
                <p className="text-brunswick-green font-medium">
                  {weather.temperature > 25 ? '🌞 Perfect weather for lake activities!' : 
                   weather.temperature > 15 ? '🌤️ Great weather for outdoor adventures!' : 
                   '🌥️ Cozy weather for cottage relaxation!'}
                </p>
                <p className="text-xs text-black/60 mt-1">
                  Last updated: {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default WeatherWidget;