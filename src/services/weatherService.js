import axios from 'axios';

const API_KEY = '4cfaada1e6830435fee63c6fa8d6b9c7';

export const getLocation = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    if (response.data.length === 0) {
      throw new Error('Location not found');
    }
    const locationData = {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      name: response.data[0].name
    };
    console.log('Location data:', locationData);
    return locationData;
  } catch (error) {
    console.error("Error fetching location data", error);
    throw error;
  }
};

export const getWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
    console.log('Weather data:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
};

export const getCitySuggestions = async (query) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    const suggestions = response.data.map(item => item.name);
    console.log('City suggestions:', suggestions);
    return suggestions;
  } catch (error) {
    console.error("Error fetching city suggestions", error);
    throw error;
  }
};

export const checkCity = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const cityExists = response.data.length > 0;
    console.log('City check data:', cityExists);
    return cityExists;
  } catch (error) {
    console.error("Error checking city data", error);
    throw error;
  }
};