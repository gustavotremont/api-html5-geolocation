//icono rojo
let redIcon = new L.Icon({
	iconUrl: '../assets/marker-icon-red.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

//Inicializar el mapa
const mapId = 'mapid';
const initialCoordinates = [34.0194, -118.411];
const mymap = L.map(mapId).setView(initialCoordinates, 13);

const MAPBOX_API = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
const ATTRIBUTION = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const ACCESS_TOKEN = 'sk.eyJ1IjoiZ3VzdGF2b3RyZW1vbnQiLCJhIjoiY2t1bWpzM2h1M3JldDJvbW9hcGo2dnFqMSJ9.GJaVewtHbT_s78gj0Jci2A';

//declarando el mapa
L.tileLayer(MAPBOX_API, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ACCESS_TOKEN
}).addTo(mymap);

//mi localizacion
// navigator.geolocation.watchPosition(position => {
//     L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
// })

//creado grupo de capaz para almacenar los marcadores
let busMarkers = L.layerGroup().addTo(mymap);
let railMarkers = L.layerGroup().addTo(mymap);

//funcion para obtener los buses
const getBus = async () => {
    const response = await fetch('https://api.metro.net/agencies/lametro/vehicles/');
    const data = await response.json()
    const busses = data.items.map(element => {
        return {
            id: element.id,
            latitude: element.latitude,
            longitude: element.longitude
        }
    })
    return busses
}

//funcion para obtener los trenes
const getRail = async () => {
    const response = await fetch('https://api.metro.net/agencies/lametro-rail/vehicles/');
    const data = await response.json()
    const rails = data.items.map(element => {
        return {
            id: element.id,
            latitude: element.latitude,
            longitude: element.longitude
        }
    })
    return rails
}

// funcion para obtener y pintar la data de los buses y trenes
const getAll = async () => {
    busses = await getBus().then(data => data)
    rails = await getRail().then(data => data)
    for (const bus of busses) {
        L.marker([bus.latitude, bus.longitude], {icon: redIcon}).bindPopup(`BUS ID: ${bus.id}`).addTo(busMarkers);
    }
    for (const rail of rails) {
        L.marker([rail.latitude, rail.longitude]).bindPopup(`RAIL ID: ${rail.id}`).addTo(railMarkers);
    }
}

//funcion intervalo para limpiar y agregar nuevos marcadores cada 8 sgds
let intervalId = window.setInterval(() => {
    busMarkers.clearLayers();
    railMarkers.clearLayers();
    getAll().then(data => data)
    map.addLayer(markers);
  }, 8000);