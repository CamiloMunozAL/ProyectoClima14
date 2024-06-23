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

// Función para obtener el clima actual en una ubicación
async function getWeather(lat, lon) {
  // Obtener el clima actual usando la API de Open Meteo
  // --fetch: es una función que permite hacer peticiones HTTP desde JavaScript, recibe como argumento la URL a la que se hará la petición y devuelve una promesa que se resuelve con la respuesta a la petición.
  // --await: es una palabra clave que se utiliza para esperar a que una promesa se resuelva, solo se puede utilizar dentro de una función marcada como async.
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );
  const data = await response.json(); //cuando la promesa se resuelve, se obtiene la respuesta en formato JSON
  console.log("tipo de dato:", typeof data);
  // Actualizar el contenido de los elementos del DOM
  temperatureElement.textContent = data.current.temperature_2m + "°";
  temperatureMaxElement.textContent = data.daily.temperature_2m_max[0] + "°";
  temperatureMinElement.textContent = data.daily.temperature_2m_min[0] + "°";
  humidityElement.textContent = data.current.relative_humidity_2m + "%";
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;
