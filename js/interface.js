let currentHour;
let information;
const origin = {
  cityName: "Vancouver",
  countryName: "CA",
  lat: 49.246292,
  lng: -123.116226,
};
const nameDisplay = document.querySelector(".name");
const select = document.querySelector(".select");
document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const cityString = localStorage.getItem(key);
    const newOption = new Option();
    if (cityString) {
      const city = JSON.parse(cityString);
      newOption.value = `${city.cityName}, ${city.countryName}`;
      newOption.text = `${city.cityName}, ${city.countryName}`;
      select.add(newOption);
    }
  }
  updateDisplay(origin.lat, origin.lng);
  nameDisplay.innerText = `${origin.cityName}, ${origin.countryName}`;
  if (
    localStorage.getItem(`${origin.cityName}, ${origin.countryName}`) != null
  ) {
    btnStar.classList.add("icon__button");
  }
});
const btnStar = document.querySelector("#icon__button");
const weatherIcon = document.querySelector(".weather__icon");
const temperature = document.querySelector(".temperature");
const wind = document.querySelector(".wind");
const temperatureMaxMin = document.querySelector(".temperatureMaxMin");
const humidity = document.querySelector(".humidity");
const body = document.querySelector("body");
const days = document.querySelector(".days");
const hours = document.querySelector(".hours");
window.initMap = () => {
  const autocomplete = new google.maps.places.Autocomplete(
    document.querySelector("#search_input"),
    {
      types: ["locality"],
    }
  );
  autocomplete.addListener("place_changed", () => {
    const placeInfo = getPlaceInfo(autocomplete);
    const city = `${placeInfo.cityName}, ${placeInfo.countryName}`;
    if (localStorage.getItem(`${placeInfo.cityName}, ${placeInfo.countryName}`) !== null) {
      btnStar.classList.add("icon__button");
    } else {
      if (btnStar.classList.contains("icon__button")) {
        btnStar.classList.remove("icon__button");
      }
    }
    updateDisplay(placeInfo.lat, placeInfo.lng);
    nameDisplay.innerText = city;
    information = placeInfo;
  });
};
btnStar.addEventListener("click", () => {
  if (btnStar.classList.contains("icon__button")) {
    btnStar.classList.remove("icon__button");
    let valueToDelete = nameDisplay.textContent;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === valueToDelete) {
        localStorage.removeItem(`${nameDisplay.textContent}`);
        select.options[i].remove();
        break;
      }
    }
  } else if (information === undefined) {
    btnStar.classList.add("icon__button");
    const newOption = new Option();
    newOption.value = `${origin.cityName}, ${origin.countryName}`;
    newOption.text = `${origin.cityName}, ${origin.countryName}`;
    select.add(newOption);
    const informationSaved = {
      cityName: origin.cityName,
      countryName: origin.countryName,
      lat: origin.lat,
      lng: origin.lng,
    };
    const informationSavedString = JSON.stringify(informationSaved);
    localStorage.setItem(
      `${origin.cityName}, ${origin.countryName}`,
      informationSavedString
    );
  } else {
    btnStar.classList.add("icon__button");
    const newOption = new Option();
    newOption.value = `${information.cityName}, ${information.countryName}`;
    newOption.text = `${information.cityName}, ${information.countryName}`;
    select.add(newOption);
    const informationSaved = {
      cityName: information.cityName,
      countryName: information.countryName,
      lat: information.lat,
      lng: information.lng,
    };
    const informationSavedString = JSON.stringify(informationSaved);
    localStorage.setItem(
      `${information.cityName}, ${information.countryName}`,
      informationSavedString
    );
  }
});
select.addEventListener("change", () => {
  const text = select.options[select.selectedIndex].text;
  if (text != "Favorite Cities") {
    const cities = JSON.parse(localStorage.getItem(`${text}`));
    if (localStorage.getItem(text) !== null) {
      btnStar.classList.add("icon__button");
    }
    updateDisplay(cities.lat, cities.lng);
    nameDisplay.innerText = `${cities.cityName}, ${cities.countryName}`;
  }
});
const changeBackground = (hour) => {
  let dayTime;
  switch (true) {
    case hour < 7:
      dayTime = "midnight";
      break;
    case hour < 13:
      dayTime = "morning";
      break;
    case hour < 18:
      dayTime = "afternoon";
      break;
    default:
      dayTime = "evening";
      break;
  }
  if (!body.classList.contains(dayTime)) {
    const timeClasses = ["midnight", "morning", "afternoon", "evening"];
    body.classList.remove(...timeClasses);
    body.classList.toggle(dayTime);
  }
};
const getCurrentHour = (lng) => {
  const timeZone = "greenwich";
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: timeZone,
  });
  const country = -1 * lng;
  const differenceHours = Math.floor(country / 15);
  let currentHour = new Date(currentTime).getHours() - differenceHours;
  if (currentHour > 24) {
    currentHour = currentHour - 24;
  } else if (currentHour < 0) {
    currentHour = currentHour + 24;
  }
  return currentHour;
};
const updateDisplay = (lat, lng) => {
  new Promise((resolve) => {
    resolve(getCurrentWeather(lat, lng));
  })
    .then((weatherData) => {
      weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="icon">`;
      temperature.innerHTML = `${weatherData.temp}&deg;C`;
      wind.innerHTML = `Wind Speed: <br> ${weatherData.windSpeed} Km/h`;
      temperatureMaxMin.innerHTML = ` Min temp: ${weatherData.tempMin}&deg;C <br> Max temp: ${weatherData.tempMax}&deg;C`;
      humidity.innerHTML = ` Humidity: ${weatherData.humidity}%`;
      changeBackground(getCurrentHour(lng));
    })
    .catch((error) => {
      console.error(error);
    });
  new Promise((resolve) => {
    resolve(getFiveDaysWeather(lat, lng));
  })
    .then((weatherDataFiveDays) => {
      days.innerHTML = "";
      for (const day in weatherDataFiveDays) {
        const newDay = document.createElement("div");
        newDay.addEventListener("click", () => {
          updateDisplayHour(weatherDataFiveDays[`${day}`]);
        });
        const currentDay = new Date(weatherDataFiveDays[`${day}`][0].dt_txt);
        const currentDayDate = currentDay.toLocaleDateString("en-US", {
          weekday: "long",
        });
        newDay.classList.add(day);
        newDay.innerHTML = `<p>${currentDayDate}</p>`;
        newDay.innerHTML += `<p><img src="https://openweathermap.org/img/wn/${
          weatherDataFiveDays[`${day}`][0].weather[0].icon
        }@2x.png" alt="icon"></p>`;
        newDay.innerHTML += `<span>${Math.floor(
          weatherDataFiveDays[`${day}`][0].main.temp_min
        )}&deg;C</span>${Math.ceil(
          weatherDataFiveDays[`${day}`][0].main.temp_max
        )}&deg;C`;
        days.appendChild(newDay);
      }
      updateDisplayHour(weatherDataFiveDays.day1);
    })
    .catch((error) => {
      console.error(error);
    });
};
const updateDisplayHour = (day) => {
  hours.innerHTML = "";
  let lastHour = 0;
  for (let i = 0; i < day.length; i++) {
    const newHour = document.createElement("div");
    const data = new Date(day[i].dt_txt);
    const nextHour = data.getHours();
    newHour.classList.add("hour");
    newHour.innerHTML = `<p>${lastHour} to ${nextHour}</p>`;
    newHour.innerHTML += `<p><img src="https://openweathermap.org/img/wn/${day[0].weather[0].icon}@2x.png" alt="icon"></p>`;
    newHour.innerHTML += `<span>${Math.floor(
      day[0].main.temp_min
    )}&deg;C</span>${Math.ceil(day[0].main.temp_max)}&deg;C`;
    hours.appendChild(newHour);
    lastHour = nextHour;
  }
};