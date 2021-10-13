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
let busMarkers = L.markerClusterGroup();
let railMarkers = L.markerClusterGroup();

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
    const lametro = [busses, rails]
    return lametro
}

getAll().then(([busses, rails]) => {
    for (const bus of busses) {
        busMarkers.addLayer(L.marker([bus.latitude, bus.longitude], {id: bus.id}).bindPopup(`BUS ID: ${bus.id}`));
    }
    for (const rail of rails) {
        railMarkers.addLayer(L.marker([rail.latitude, rail.longitude], {icon: redIcon, id: rail.id}).bindPopup(`RAIL ID: ${rail.id}`));
    }  
    // const newBus = busses.sort((a, b) => a.id - b.id)
    // console.log(newBus)

    // busMarkers.getLayers().sort((a, b) => a.options.id - b.options.id)
    // console.log(busMarkers.getLayers())
    mymap.addLayer(busMarkers);
    mymap.addLayer(railMarkers);
})

// funcion intervalo para limpiar y agregar nuevos marcadores cada 8 sgds
window.setInterval(() => {
    getAll().then(([busses, rails]) => {
        const newBus = busses.sort((a, b) => a.id - b.id)
        const newRail = rails.sort((a, b) => a.id - b.id)
        const newBussesMakers = busMarkers.getLayers().sort((a, b) => a.options.id - b.options.id);
        const newRailsMakers = railMarkers.getLayers().sort((a, b) => a.options.id - b.options.id);
        // for (const i in newBussesMakers) {
        //     let newLatLng = new L.LatLng(newBus[i].latitude, newBus[i].longitude)
        //     newBussesMakers[i].setLatLng(newLatLng)
        // }

        for (const i in newRailsMakers) {
            newRailsMakers[i].setLatLng([newRail[i].latitude, newRail[i].longitude])
        }  
    }) 
    console.log('ejecutado') 
}, 5000);