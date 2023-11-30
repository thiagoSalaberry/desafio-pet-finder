import * as mapboxgl from "mapbox-gl";
import * as MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "dotenv/config";
const MAPBOX_TOKEN:string = process.env.MAPBOX_TOKEN;

export function setupMap(centro?, zoom?) {
    const map:mapboxgl.Map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: centro || [-64.9534123, -35.2434894], // starting position [lng, lat]
        zoom: zoom || 3,
        accessToken: MAPBOX_TOKEN,
    });
    const nav:mapboxgl.NavigationControl = new mapboxgl.NavigationControl();
    const geoCoder:MapboxGeocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        mapboxgl: mapboxgl,
        countries: "ar",
        limit: 1,
    });
    let lng:number;
    let lat:number;
    geoCoder.on("result", (e)=>{
        lng = e.result.center[0];
        lat = e.result.center[1];
        console.log({[e.result.text]:{lng, lat}});
        sessionStorage.setItem("coords", JSON.stringify({lat, lng}));
        sessionStorage.setItem("last_seen", e.result.text);
    });
    const containerEl:HTMLDivElement = document.querySelector(".geocoder");
    map.addControl(nav);
    containerEl.appendChild(geoCoder.onAdd(map));
    const geoCoderInputEl:HTMLInputElement = document.querySelector(".mapboxgl-ctrl-geocoder--input");
    geoCoderInputEl.classList.add("input");
    geoCoderInputEl.placeholder = "";
    document.querySelector(".suggestions-wrapper").remove();
    document.querySelector(".mapboxgl-ctrl-geocoder--pin-right").remove();
    document.querySelector(".mapboxgl-ctrl-geocoder--icon").remove();
    return [lng, lat];
};

