const pokeApiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const weatherApiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const weatherApiKey = "1b274b6a8139a5eeae5571f298f7258e";

document.getElementById("getWeather").addEventListener("click", async () => {
  const location = document.getElementById("location").value.trim();
  if (location) {
    try {
      const weather = await fetchWeatherData(location);
      if (weather) {
        await suggestPokemonBasedOnWeather(weather);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please enter a valid city name!");
  }
});

async function fetchWeatherData(city) {
  const url = `${weatherApiBaseUrl}?q=${city}&appid=${weatherApiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found!");
    const data = await response.json();
    displayWeatherDetails(data);
    setDynamicBackground(data.weather[0].main.toLowerCase());
    return data.weather[0].main.toLowerCase();
  } catch (error) {
    console.error(error);
    document.getElementById(
      "weatherDetails"
    ).innerHTML = `<p>${error.message}</p>`;
    return null;
  }
}

function displayWeatherDetails(data) {
  const weatherCard = document.getElementById("weatherCard");
  weatherCard.classList.remove("hidden");
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherCard.innerHTML = `
    <h2>Weather in ${data.name}</h2>
    <img src="${iconUrl}" alt="${data.weather[0].description}" />
    <p><strong>Condition:</strong> ${data.weather[0].main} (${data.weather[0].description})</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Feels Like:</strong> ${data.main.feels_like}°C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
  `;
}

function setDynamicBackground(weather) {
  const body = document.body;
  const backgrounds = {
    clear: "./images/sunny.jpg",
    clouds: "./images/cloudy.jpg",
    rain: "./images/rainy.jpg",
    snow: "./images/snowy.jpg",
    thunderstorm: "./images/thunderstorm.jpg",
    default: "./images/background.jpg",
  };
  const backgroundUrl = backgrounds[weather] || backgrounds.default;
  body.style.backgroundImage = `url('${backgroundUrl}')`;
}

async function suggestPokemonBasedOnWeather(weather) {
  const weatherTypeMap = {
    rain: "water",
    clear: "fire",
    clouds: "electric",
    snow: "ice",
    thunderstorm: "electric",
    drizzle: "water",
    default: "normal",
  };
  const type = weatherTypeMap[weather] || weatherTypeMap.default;
  const typeUrl = `https://pokeapi.co/api/v2/type/${type}`;
  try {
    const response = await fetch(typeUrl);
    if (!response.ok) throw new Error("Pokémon type not found!");
    const data = await response.json();
    const randomPokemon =
      data.pokemon[Math.floor(Math.random() * data.pokemon.length)];
    const pokemonName = randomPokemon.pokemon.name;
    await fetchPokemonData(pokemonName);
  } catch (error) {
    console.error(error);
    document.getElementById(
      "pokemonDetails"
    ).innerHTML = `<p>${error.message}</p>`;
  }
}

async function fetchPokemonData(pokemonName) {
  const url = `${pokeApiBaseUrl}${pokemonName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Pokémon not found!");
    const data = await response.json();
    displayPokemonDetails(data);
  } catch (error) {
    console.error(error);
    document.getElementById(
      "pokemonDetails"
    ).innerHTML = `<p>${error.message}</p>`;
  }
}

function displayPokemonDetails(data) {
  const pokemonCard = document.getElementById("pokemonCard");
  pokemonCard.classList.remove("hidden");
  const { name, sprites, types, stats } = data;
  const typeList = types.map((type) => type.type.name).join(", ");
  const statsHTML = stats
    .map(
      (stat) => `
        <div class="stats-bar">
          <span>${stat.stat.name.toUpperCase()}</span>
          <div><span style="width: ${stat.base_stat}%"></span></div>
          <span>${stat.base_stat}</span>
        </div>`
    )
    .join("");
  pokemonCard.innerHTML = `
    <div class="pokedex-data">
      <img src="${sprites.front_default}" alt="${name}">
      <div class="pokedex-info">
        <h2>${name.toUpperCase()}</h2>
        <p><strong>Type:</strong> ${typeList}</p>
      </div>
    </div>
    <div class="stats-section">
      <h2>Base Stats</h2>
      ${statsHTML}
    </div>
  `;
}
