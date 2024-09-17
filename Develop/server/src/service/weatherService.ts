import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  results: any;
  lat: number;
  lng: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvindex: number;
  weather: string;
  constructor(temp: number, feelsLike: number, humidity: number, windSpeed: number, uvindex: number, weather: string) {
    this.temperature = temp;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvindex = uvindex;
    this.weather = weather;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = `api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`;
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = '';

  }
  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
   }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { results, lat, lng } = locationData;
    return { results, lat, lng };
  }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    return `${this.baseURL}geocode/jason?address=${this.cityName}&key=${this.apiKey}`;
   }
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}onecall?lat=${coordinates.lat}&lon=${coordinates.lng}&exclude=minutely,hourly&appid=${this.apiKey}`;
   }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
   }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
   }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const currentWeather = response.current;
    return {
      temperature: currentWeather.temp,
      feelsLike: currentWeather.feels_like,
      humidity: currentWeather.humidity,
      windSpeed: currentWeather.wind_speed,
      uvindex: currentWeather.uvi,
      weather: currentWeather.weather[0].description,
    };
   }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast = weatherData.map((day: any) => {
      return {
        temperature: day.temp.day,
        feelslike: day.feels_like.day,
        humidity: day.humidity,
        windspeed: day.wind_speed,
        uvindex: day.uvi,
        weather: day.weather[0].description,
      };
   });

   forecast.unshift({
    temperature: currentWeather.temperature,
    feelslike: currentWeather.feelsLike,
    humidity: currentWeather.humidity,
    windspeed: currentWeather.windSpeed,
    uvindex: currentWeather.uvindex,
    weather: currentWeather.weather,
   });

    return forecast;
  }
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.daily);
    return { currentWeather, forecast };
   }
}

export default new WeatherService();
