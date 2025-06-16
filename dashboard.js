const locations = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem"
];

const locationSelect = document.getElementById("locationSelect");
const dateSpan = document.getElementById("date");
const timeSpan = document.getElementById("time");
const dayPeriodSpan = document.getElementById("dayPeriod");
const weatherSpan = document.getElementById("weather");

const apiKey = "ed7224ca179500e68913bc33066b2153"; // Replace with your actual OpenWeatherMap API key

// Determine part of day
function getDayPeriod(hour) {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 20) return "Evening";
  return "Night";
}

// Fetch weather
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.weather && data.weather.length > 0) {
      const condition = data.weather[0].main;

      let conditionText = "Unknown";
      switch (condition.toLowerCase()) {
        case "clear":
          conditionText = "Sunny";
          break;
        case "clouds":
          conditionText = "Cloudy";
          break;
        case "rain":
        case "drizzle":
        case "thunderstorm":
          conditionText = "Rainy";
          break;
        case "mist":
        case "fog":
        case "haze":
        case "smoke":
          conditionText = "Misty / Foggy";
          break;
        default:
          conditionText = condition;
      }

      weatherSpan.textContent = conditionText;
    } else {
      weatherSpan.textContent = "Weather data unavailable";
    }
  } catch (err) {
    weatherSpan.textContent = "Error fetching weather";
  }
}

// Update Date and Time
function updateDateTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (5.5 * 60 * 60 * 1000));

  const dateStr = ist.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const timeStr = ist.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const hour = ist.getHours();
  const period = getDayPeriod(hour);

  dateSpan.textContent = dateStr;
  timeSpan.textContent = timeStr;
  dayPeriodSpan.textContent = period;
}

// Event listener for dropdown
locationSelect.addEventListener("change", () => {
  fetchWeather(locationSelect.value);
});

// Initial call
locationSelect.value = "Coimbatore";
fetchWeather(locationSelect.value);
updateDateTime();
setInterval(updateDateTime, 1000);



