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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mapRef.current) return; // Map already initialized

        setLoading(true);
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

        const paintBackground = (x, y) => {
            const canvas = document.createElement('canvas'); 
            var ctx = canvas.getContext("2d")
            ctx.fillStyle = "#dddddd";
            ctx.fillRect(0, 0, x, y);
            canvas.style.width = '100%'
            canvas.style.height = '90vh'
            document.getElementById('images').appendChild(canvas);
            console.log('painted it ')
        }

        setTimeout(() => {
            let canvas = document.getElementsByTagName('canvas')[0];
            var dataURL = canvas.toDataURL();
            var dimensions = mapRef.current.getSize();

            // Create an image element
            const img = new Image();
            img.id = 'genImage'
            img.width = dimensions.x;
            img.height = dimensions.y;
            img.src = dataURL
            img.style.position = 'absolute';
            img.style.zIndex = 100;

            document.getElementById('images').innerHTML = '';
            document.getElementById('images').appendChild(img);
            console.log('added image to dom')
            setTimeout(() => {
                paintBackground(canvas.width, canvas.height)
                
                var map = document.getElementById('map')
                map.style.display = 'None'
                // mapRef.current.remove()
                setLoading(false)
                console.log('set loading to false')
            }, 60)
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