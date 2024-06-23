let map; // Variable para el objeto de mapa
let autocomplete; // Variable para el objeto de autocompletar
let marker; // Variable para el marcador en el mapa

//Google Maps API Key
//google.maps: es el objeto global que proporciona la API de Google Maps, contiene clases y métodos para interactuar con servicios de Google Maps.

//google.maps.Map: es la clase que representa un mapa de Google Maps, se utiliza para crear un mapa en una página web.
//----como primer argumento recibe un elemento HTML donde se mostrará el mapa. y como segundo argumento recibe un objeto con las configuracions del mapa.

//google.maps.places.Autocomplete: es la clase que proporciona un campo de autocompletar para buscar lugares en Google Maps.
//----como primer argumento recibe un elemento HTML donde se mostrará el campo de autocompletar, y como segundo argumento recibe un objeto de configuracion opcional que define propiedades del autocompletado.

//google.maps.Marker: es la clase que representa un marcador en Google Maps, se utiliza para colocar un marcador en un mapa.
//----como argumento recibe un objeto con las configuraciones del marcador.

//Función para inicializar el mapa y el campo de autocompletar
function initMap() {
  // Inicializar el mapa
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  // Inicializar el campo de autocomplete
  const input = document.getElementById("location-input");
  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"], //Limitar la búsqueda a ciudades
  });
  // autocomplete.bindTo("bounds", map);

  // Escuchar el evento de selección de un lugar en el campo de autocomplete y mostrar el clima en la ubicación seleccionada
  // ---place_changed: es el evento que se dispara cuando se selecciona un lugar en el campo de autocompletar.
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.error("No hay detalles : '" + place.name + "'");
      return;
    }

    // Centrar el mapa en la ubicación seleccionada
    map.setCenter(place.geometry.location);
    map.setZoom(10);

    // Colocar un marcador en la ubicación seleccionada
    if (marker) {
      // Si ya hay un marcador, eliminarlo
      marker.setMap(null);
    }
    marker = new google.maps.Marker({
      map: map, // Mapa donde se colocará el marcador
      position: place.geometry.location, // Posición del marcador
    });

    // Obtener y mostrar el clima actual en la ubicación seleccionada
    console.log(place.geometry.location.lat(), place.geometry.location.lng());
    getWeather(place.geometry.location.lat(), place.geometry.location.lng());
  });
}

// Elementos del DOM para mostrar valores del clima
const temperatureElement = document.getElementById("temperature");
const temperatureMaxElement = document.getElementById("temperature-max");
const temperatureMinElement = document.getElementById("temperature-min");
const humidityElement = document.getElementById("humidity");
const imgWeather = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");

// Función para obtener el clima actual en una ubicación
async function getWeather(lat, lon) {
  // Obtener el clima actual usando la API de Open Meteo
  // --fetch: es una función que permite hacer peticiones HTTP desde JavaScript, recibe como argumento la URL a la que se hará la petición y devuelve una promesa que se resuelve con la respuesta a la petición.
  // --await: es una palabra clave que se utiliza para esperar a que una promesa se resuelva, solo se puede utilizar dentro de una función marcada como async.
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );
  const data = await response.json(); //cuando la promesa se resuelve, se obtiene la respuesta en formato JSON
  // console.log(data);
  // Actualizar el contenido de los elementos del DOM
  temperatureElement.textContent = data.current.temperature_2m + "°";
  temperatureMaxElement.textContent = data.daily.temperature_2m_max[0] + "°";
  temperatureMinElement.textContent = data.daily.temperature_2m_min[0] + "°";
  humidityElement.textContent = data.current.relative_humidity_2m + "%";
  let dayOrNight = data.current.is_day ? "day" : "night"; // Determinar si es de día o de noche si es 1 es de día, si es 0 es de noche
  let weatherCode = data.current.weather_code; //Obtener el código de clima actual
  imgWeather.src = weatherCodes[weatherCode][dayOrNight].image; //Mostrar la imagen correspondiente al clima actual
  weatherDescription.textContent =
    weatherCodes[weatherCode][dayOrNight].description; //Mostrar la descripción del clima actual
  // console.log(weatherCode, dayOrNight);
  console.log(weatherCodes[weatherCode][dayOrNight].description);
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;

// Objeto con los códigos de clima y sus descripciones e imágenes correspondientes
let weatherCodes = {
  0: {
    day: {
      description: "Sunny",
      image: "http://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "Clear",
      image: "http://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  1: {
    day: {
      description: "Mainly Sunny",
      image: "http://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "Mainly Clear",
      image: "http://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  2: {
    day: {
      description: "Partly Cloudy",
      image: "http://openweathermap.org/img/wn/02d@2x.png",
    },
    night: {
      description: "Partly Cloudy",
      image: "http://openweathermap.org/img/wn/02n@2x.png",
    },
  },
  3: {
    day: {
      description: "Cloudy",
      image: "http://openweathermap.org/img/wn/03d@2x.png",
    },
    night: {
      description: "Cloudy",
      image: "http://openweathermap.org/img/wn/03n@2x.png",
    },
  },
  45: {
    day: {
      description: "Foggy",
      image: "http://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "Foggy",
      image: "http://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  48: {
    day: {
      description: "Rime Fog",
      image: "http://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "Rime Fog",
      image: "http://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  51: {
    day: {
      description: "Light Drizzle",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Drizzle",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  53: {
    day: {
      description: "Drizzle",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Drizzle",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  55: {
    day: {
      description: "Heavy Drizzle",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Heavy Drizzle",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  56: {
    day: {
      description: "Light Freezing Drizzle",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Freezing Drizzle",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  57: {
    day: {
      description: "Freezing Drizzle",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Freezing Drizzle",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  61: {
    day: {
      description: "Light Rain",
      image: "http://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Light Rain",
      image: "http://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  63: {
    day: {
      description: "Rain",
      image: "http://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Rain",
      image: "http://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  65: {
    day: {
      description: "Heavy Rain",
      image: "http://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Heavy Rain",
      image: "http://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  66: {
    day: {
      description: "Light Freezing Rain",
      image: "http://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Light Freezing Rain",
      image: "http://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  67: {
    day: {
      description: "Freezing Rain",
      image: "http://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Freezing Rain",
      image: "http://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  71: {
    day: {
      description: "Light Snow",
      image: "http://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Light Snow",
      image: "http://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  73: {
    day: {
      description: "Snow",
      image: "http://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow",
      image: "http://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  75: {
    day: {
      description: "Heavy Snow",
      image: "http://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Heavy Snow",
      image: "http://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  77: {
    day: {
      description: "Snow Grains",
      image: "http://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow Grains",
      image: "http://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  80: {
    day: {
      description: "Light Showers",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Showers",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  81: {
    day: {
      description: "Showers",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Showers",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  82: {
    day: {
      description: "Heavy Showers",
      image: "http://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Heavy Showers",
      image: "http://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  85: {
    day: {
      description: "Light Snow Showers",
      image: "http://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Light Snow Showers",
      image: "http://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  86: {
    day: {
      description: "Snow Showers",
      image: "http://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow Showers",
      image: "http://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  95: {
    day: {
      description: "Thunderstorm",
      image: "http://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Thunderstorm",
      image: "http://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  96: {
    day: {
      description: "Light Thunderstorms With Hail",
      image: "http://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Light Thunderstorms With Hail",
      image: "http://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  99: {
    day: {
      description: "Thunderstorm With Hail",
      image: "http://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Thunderstorm With Hail",
      image: "http://openweathermap.org/img/wn/11n@2x.png",
    },
  },
};
