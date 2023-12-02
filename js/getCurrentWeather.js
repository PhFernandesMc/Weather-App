const getCurrentWeather = async (lat, lng) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=226bd39be2fbdc28c43f2034849aecab&units=metric`
  );
  const data = await response.json();
  return {
    humidity: data.main.humidity,
    temp: Math.floor(data.main.temp),
    tempMax: Math.floor(data.main.temp_max),
    tempMin: Math.floor(data.main.temp_min),
    weather: data.weather[0].main,
    windSpeed: Math.floor(data.wind.speed * 3.6),
    icon: data.weather[0].icon
  };
};
