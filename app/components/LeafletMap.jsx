"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({polylines, lineColor}) => {
    const mapRef = useRef(null);
    const infoDiv = document.getElementById('ActivityListItemDetailTextContainer');
    const mapHeight = window.innerHeight - 20 - infoDiv.offsetHeight;

    useEffect(() => {
        if (mapRef.current) return; // Map already initialized
        mapRef.current = L.map('map', {zoomControl: false, renderer: L.canvas() });

        

        mapRef.current.touchZoom.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.scrollWheelZoom.disable();
        mapRef.current.boxZoom.disable();
        mapRef.current.keyboard.disable();
        mapRef.current.dragging.disable();

        var polyline = new L.Polyline(polylines, {
            color: lineColor,
            weight: 2,
            opacity: 1
        });
        polyline.addTo(mapRef.current);
        mapRef.current.fitBounds(polyline.getBounds());

        setTimeout(() => {
            let canvas = document.getElementsByTagName('canvas')[0];
            var dataURL = canvas.toDataURL();
            // Create an image element
            const img = new Image();
            // var img = document.createElement('img');
            var dimensions = mapRef.current.getSize();
            img.width = dimensions.x;
            img.height = dimensions.y;

            img.src = dataURL

            document.getElementById('images').innerHTML = '';
            document.getElementById('images').appendChild(img);
        }, 50)
        

        

        

        // Assign the canvas content as the source of the image
        // image.src = dataURL;


        // replace the map div with ethe image
        // document.body.appendChild(image)

        // mapRef.current.remove()

        

        // var m = document.getElementById('map')
        // m.style.display = "none"
    }, []);

    // return <div id="map" style={{ height: `${mapHeight}px` }} />;
    return (
        <div>
            <div id="images"></div>
            <div id="map" style={{ height: `${mapHeight}px` }} />
        </div>
    )
}

export default MapComponent;