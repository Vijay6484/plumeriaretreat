import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Snowflake, Wind } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 5,
  });
  
  // For a real app, fetch actual weather data from an API
  useEffect(() => {
    // Simulating API call
    const timer = setTimeout(() => {
      // This would be replaced with actual API data
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  return (
    <section className="py-12 bg-brunswick-green/10">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  {getWeatherIcon()}
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold font-montserrat text-brunswick-green">Current Weather</h3>
                    <p className="text-black/70">Plumeria Retreat Lakeside</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-brunswick-green">{weather.temperature}°F</div>
                    <div className="text-sm text-black/70">Temperature</div>
                  </div>
                  
                  <div className="text-center px-4 border-l border-brunswick-green/20">
                    <div className="text-3xl font-bold text-brunswick-green">{weather.humidity}%</div>
                    <div className="text-sm text-black/70">Humidity</div>
                  </div>
                  
                  <div className="text-center px-4 border-l border-brunswick-green/20">
                    <div className="flex items-center justify-center">
                      <Wind size={16} className="mr-1 text-brunswick-green" />
                      <span className="text-3xl font-bold text-brunswick-green">{weather.windSpeed}</span>
                    </div>
                    <div className="text-sm text-black/70">Wind (mph)</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-brunswick-green/20 text-center text-black/70">
                <p>Perfect weather for outdoor activities! Plan your visit today.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default WeatherWidget;