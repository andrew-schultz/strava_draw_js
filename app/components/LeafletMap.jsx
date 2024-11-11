"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useRef } from 'react';
import Spinner from "./Spinner"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({polylines, lineColor}) => {
    const mapRef = useRef(null);
    const infoDiv = document.getElementById('ActivityListItemDetailTextContainer');
    const mapHeight = window.innerHeight - 20 - infoDiv.offsetHeight;
    const [loading, setLoading] = useState(true)

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

        const paintBackground = (canvas) => {
            var ctx = canvas.getContext("2d")
            var dimensions = mapRef.current.getSize();
            ctx.fillStyle = "#dddddd";
            ctx.fillRect(0, 0, dimensions.x, dimensions.y);
        }

        setTimeout(() => {
            let canvas = document.getElementsByTagName('canvas')[0];
            var dataURL = canvas.toDataURL();
            var dimensions = mapRef.current.getSize();

            // Create an image element
            const img = new Image();

            img.width = dimensions.x;
            img.height = dimensions.y;
            img.src = dataURL
            img.style.position = 'absolute';
            img.style.zIndex = 100;

            document.getElementById('images').innerHTML = '';
            document.getElementById('images').appendChild(img);

            setTimeout(() => {
                paintBackground(canvas)
                setLoading(false)
            }, 50)
        }, 250)
        
        mapRef.current
    }, []);


    // return <div id="map" style={{ height: `${mapHeight}px` }} />;
    return (
        <div>
            {loading ? (
                <div className='spinnerContainer'>
                    <Spinner></Spinner>
                </div> ) : (null)}
            <div id="images"></div>
            <div id="map" style={{ height: `${mapHeight}px` }} />
        </div>
    )
}

export default MapComponent;