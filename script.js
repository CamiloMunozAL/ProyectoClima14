let map;
let autocomplete;
let marker;

//Función para inicializar el mapa y el campo de autocompletar
function initMap() {
  // Inicializar el mapa
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  // Inicializar el campo de autocomplete
  const input = document.getElementById("location-input");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

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
      marker.setMap(null);
    }
    marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
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

// Función para obtener el clima actual en una ubicación
async function getWeather(lat, lon) {
  // Obtener el clima actual usando la API de Open Meteo
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );
  const data = await response.json();
  console.log(data);
  // Actualizar el contenido de los elementos del DOM
  temperatureElement.textContent = data.current.temperature_2m + "°";
  temperatureMaxElement.textContent = data.daily.temperature_2m_max[0] + "°";
  temperatureMinElement.textContent = data.daily.temperature_2m_min[0] + "°";
  humidityElement.textContent = data.current.relative_humidity_2m + "%";
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;
