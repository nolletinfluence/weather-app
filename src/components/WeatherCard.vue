<template>
  <div class="weather-card" v-if="weather">
    <div class="weather-info">
      <h3>{{ weather.name }}</h3>
      <p class="description">{{ weather.weather[0].description }}</p>
      <p class="temperature">{{ weather.main.temp }}°C</p>
    </div>
    <div class="weather-icon">
      <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" alt="weather icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weather: Object
  }
}
</script>

<style scoped>
.weather-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  width: 100%;
  margin-bottom: 20px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.weather-info h3 {
  margin: 0;
  font-size: 24px;
}

.weather-info .description {
  margin: 5px 0;
  font-size: 18px;
  text-transform: capitalize;
  color: #555;
}

.weather-info .temperature {
  margin: 5px 0;
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
}

.weather-icon img {
  width: 100px;
  height: 100px;
}
</style>