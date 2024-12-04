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
