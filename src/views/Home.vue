<template>
  <div class="background">
    <div class="container">
      <div class="search-box">
        <input v-model="location" @input="fetchSuggestions" placeholder="Введите название города" />
        <button @click="getWeather">Поиск</button>
        <button @click="getWeatherByLocation">Мое местоположение</button>
      </div>
      
      <ul v-if="suggestions.length && location.length > 0" class="suggestions-list">
        <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
          {{ suggestion }}
        </li>
      </ul>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <div v-if="weatherData && weatherData.main" class="weather-container">
        <h2>Текущая погода</h2>
        <WeatherCard :weather="weatherData" />
      </div>
      
      <div class="popular-cities">
        <h2>Популярные города</h2>
        <div class="city-cards">
          <WeatherCard v-for="city in filteredPopularCities" :key="city.name" :weather="city.weather" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLocation, getWeather, getCitySuggestions, checkCity } from '@/services/weatherService'
import WeatherCard from '@/components/WeatherCard.vue'

export default {
  name: 'HomeView',
  components: {
    WeatherCard
  },
  data() {
    return {
      location: '',
      weatherData: null,
      errorMessage: '',
      suggestions: [],
      popularCities: [
        { name: 'Москва', weather: null },
        { name: 'Нью-Йорк', weather: null },
        { name: 'Лондон', weather: null },
        { name: 'Токио', weather: null },
        { name: 'Париж', weather: null },
        { name: 'Берлин', weather: null }
      ]
    }
  },
  computed: {
    filteredPopularCities() {
      return this.popularCities.filter(city => city.weather);
    }
  },
  methods: {
    async fetchSuggestions() {
      if (this.location.length < 3) {
        this.suggestions = [];
        return;
      }
      try {
        this.suggestions = await getCitySuggestions(this.location);
      } catch (error) {
        console.error("Error fetching city suggestions", error);
      }
    },
    selectSuggestion(suggestion) {
      this.location = suggestion;
      this.suggestions = [];
      this.getWeather();
    },
    async getWeather() {
      if (!this.location) {
        this.errorMessage = 'Пожалуйста, введите название города';
        return;
      }
      try {
        this.errorMessage = '';
        
        // Check if the location is a valid city
        const isCity = await checkCity(this.location);
        if (!isCity) {
          throw new Error('Invalid city name');
        }

        // Get latitude and longitude based on location
        const locationData = await getLocation(this.location);
        console.log('Location data:', locationData);
        const { lat: latitude, lon: longitude } = locationData || {};
        if (!latitude || !longitude) {
          throw new Error('Location not found');
        }

        // Get current weather using latitude and longitude
        const weatherData = await getWeather(latitude, longitude);
        console.log('Weather data:', weatherData);
        this.weatherData = weatherData;
      } catch (error) {
        console.error("Error fetching weather data", error);
        this.errorMessage = 'Город не найден. Пожалуйста, введите корректное название города';
      }
    },
    async getWeatherByLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherData = await getWeather(latitude, longitude);
            console.log('Weather data:', weatherData);
            this.weatherData = weatherData;
          } catch (error) {
            console.error("Error fetching weather data", error);
            this.errorMessage = 'Не удалось получить данные о погоде для вашего местоположения';
          }
        });
      } else {
        this.errorMessage = 'Геолокация не поддерживается вашим браузером';
      }
    },
    async fetchPopularCitiesWeather() {
      for (let city of this.popularCities) {
        try {
          const locationData = await getLocation(city.name);
          const weatherData = await getWeather(locationData.lat, locationData.lon);
          city.weather = weatherData;
        } catch (error) {
          console.error(`Error fetching weather data for ${city.name}`, error);
        }
      }
    }
  },
  mounted() {
    this.fetchPopularCitiesWeather();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f0f0;
  overflow: hidden;
  position: relative;
  padding: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.search-box input {
  padding: 15px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  transition: border-color 0.3s ease-in-out;
  flex: 1;
  margin-right: 10px;
  background: #f0f0f0;
  color: #333;
}

.search-box input::placeholder {
  color: #aaa;
}

.search-box input:focus {
  outline: none;
  background: #e0e0e0;
}

.search-box button {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  background-color: #007bff;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
  margin-left: 10px;
}

.search-box button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestions-list li {
  padding: 15px;
  cursor: pointer;
  color: #333;
}

.suggestions-list li:hover {
  background-color: #e0e0e0;
}

h2 {
  margin: 20px 0;
  font-size: 32px;
  color: #333;
  animation: fadeIn 1s ease-in-out;
}

.weather-container {
  background: rgba(240, 240, 240, 0.8);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 20px;
}

.popular-cities {
  width: 100%;
  margin-top: 40px;
}

.city-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 20px;
  font-size: 18px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes moveAround {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, -10px);
  }
  50% {
    transform: translate(-10px, 10px);
  }
  75% {
    transform: translate(10px, 10px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.background::before, .background::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(0, 123, 255, 0.5);
  border-radius: 50%;
  animation: moveAround 10s infinite alternate;
}

.background::before {
  top: 10%;
  left: 10%;
}

.background::after {
  bottom: 10%;
  right: 10%;
}
</style>
