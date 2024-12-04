// Base URLs for the Pokémon API and OpenWeatherMap API
const pokeApiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const weatherApiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

// Your OpenWeatherMap API key
const weatherApiKey = "1b274b6a8139a5eeae5571f298f7258e";

// Event listener for the "Get Weather & Suggest Pokémon" button
document.getElementById("getWeather").addEventListener("click", async () => {
  const location = document.getElementById("location").value.trim(); // Get the city name entered by the user
  if (location) {
    try {
      const weather = await fetchWeatherData(location); // Fetch weather data for the entered city
      if (weather) {
        await suggestPokemonBasedOnWeather(weather); // Suggest a Pokémon based on the weather condition
      }
    } catch (error) {
      console.error(error); // Log any errors that occur
    }
  } else {
    alert("Please enter a valid city name!"); // Alert the user if no city name is entered
  }
});

// Fetch weather data from OpenWeatherMap API
async function fetchWeatherData(city) {
  const url = `${weatherApiBaseUrl}?q=${city}&appid=${weatherApiKey}&units=metric`; // Construct the API URL with the city name and API key
  try {
    const response = await fetch(url); // Make the API call
    if (!response.ok) throw new Error("City not found!"); // Handle invalid city names
    const data = await response.json(); // Parse the JSON response
    displayWeatherDetails(data); // Display the weather details
    setDynamicBackground(data.weather[0].main.toLowerCase()); // Set the background image based on the weather condition
    return data.weather[0].main.toLowerCase(); // Return the weather condition (e.g., "rain", "clear")
  } catch (error) {
    console.error(error); // Log the error
    document.getElementById(
      "weatherDetails"
    ).innerHTML = `<p>${error.message}</p>`; // Display the error message
    return null; // Return null if an error occurs
  }
}

// Display weather details dynamically
function displayWeatherDetails(data) {
  const weatherCard = document.getElementById("weatherCard"); // Get the weather card element
  weatherCard.classList.remove("hidden"); // Make the weather card visible

  // Construct the icon URL for the weather condition
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  // Update the weather card with the fetched details
  weatherCard.innerHTML = `
    <h2>Weather in ${data.name}</h2>
    <img src="${iconUrl}" alt="${data.weather[0].description}" />
    <p><strong>Condition:</strong> ${data.weather[0].main} (${data.weather[0].description})</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Feels Like:</strong> ${data.main.feels_like}°C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
  `;
}

// Dynamically set the background based on the weather condition
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
  const backgroundUrl = backgrounds[weather] || backgrounds.default; // Choose the appropriate background or a default one
  body.style.backgroundImage = `url('${backgroundUrl}')`; // Set the background image
}

// Suggest a Pokémon based on the weather condition
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
  const type = weatherTypeMap[weather] || weatherTypeMap.default; // Map the weather condition to a Pokémon type
  const typeUrl = `https://pokeapi.co/api/v2/type/${type}`; // Construct the API URL for the Pokémon type
  try {
    const response = await fetch(typeUrl); // Make the API call to fetch Pokémon of the specified type
    if (!response.ok) throw new Error("Pokémon type not found!"); // Handle errors
    const data = await response.json(); // Parse the JSON response

    // Select a random Pokémon from the list
    const randomPokemon =
      data.pokemon[Math.floor(Math.random() * data.pokemon.length)];
    const pokemonName = randomPokemon.pokemon.name; // Get the Pokémon's name
    await fetchPokemonData(pokemonName); // Fetch and display the Pokémon's details
  } catch (error) {
    console.error(error); // Log the error
    document.getElementById(
      "pokemonDetails"
    ).innerHTML = `<p>${error.message}</p>`; // Display the error message
  }
}

// Fetch Pokémon details from the PokéAPI
async function fetchPokemonData(pokemonName) {
  const url = `${pokeApiBaseUrl}${pokemonName}`; // Construct the API URL for the Pokémon
  try {
    const response = await fetch(url); // Make the API call
    if (!response.ok) throw new Error("Pokémon not found!"); // Handle errors
    const data = await response.json(); // Parse the JSON response
    displayPokemonDetails(data); // Display the Pokémon's details
  } catch (error) {
    console.error(error); // Log the error
    document.getElementById(
      "pokemonDetails"
    ).innerHTML = `<p>${error.message}</p>`; // Display the error message
  }
}

// Display Pokémon details dynamically
function displayPokemonDetails(data) {
  const pokemonCard = document.getElementById("pokemonCard"); // Get the Pokémon card element
  pokemonCard.classList.remove("hidden"); // Make the Pokémon card visible

  const { name, sprites, types, stats } = data; // Destructure the Pokémon details
  const typeList = types.map((type) => type.type.name).join(", "); // Create a comma-separated list of Pokémon types

  // Create the HTML for the Pokémon's stats
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

  // Update the Pokémon card with the fetched details
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
