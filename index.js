const weatherApiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const weatherApiKey = "YOUR_API_KEY";

async function fetchWeatherData(city) {
  const url = `${weatherApiBaseUrl}?q=${city}&appid=${weatherApiKey}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Weather data:", data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

document.getElementById("getWeather").addEventListener("click", () => {
  const location = document.getElementById("location").value.trim();
  console.log("City entered:", location);
});
function displayWeatherDetails(data) {
  const weatherCard = document.getElementById("weatherCard");
  weatherCard.classList.remove("hidden");
  weatherCard.innerHTML = `
    <h2>Weather in ${data.name}</h2>
    <p>Condition: ${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp}°C</p>
  `;
}
function suggestPokemonBasedOnWeather(weather) {
  const weatherToType = {
    rain: "water",
    clear: "fire",
    clouds: "electric",
    snow: "ice",
  };
  return weatherToType[weather] || "normal";
}
const pokeApiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

async function fetchPokemonData(pokemonName) {
  const url = `${pokeApiBaseUrl}${pokemonName}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Pokémon data:", data);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}
function displayPokemonDetails(data) {
  const pokemonCard = document.getElementById("pokemonCard");
  pokemonCard.classList.remove("hidden");
  pokemonCard.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}" />
    <p>Type: ${data.types.map((t) => t.type.name).join(", ")}</p>
  `;
}
document.getElementById("getWeather").addEventListener("click", async () => {
  const location = document.getElementById("location").value.trim();
  if (!location) return alert("Please enter a city!");

  const weather = await fetchWeatherData(location);
  if (weather) {
    const type = suggestPokemonBasedOnWeather(weather);
    const pokemon = await fetchPokemonData(type);
    displayPokemonDetails(pokemon);
  }
});
