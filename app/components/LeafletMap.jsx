"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({polylines}) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return; // Map already initialized

        mapRef.current = L.map('map', {zoomControl: false, renderer: L.canvas() }).setView(polylines[0], 13);
        const lineColor = 'black'

        var polyline = new L.Polyline(polylines, {
            color: lineColor,
            weight: 2,
            opacity: 1
        });
        polyline.addTo(mapRef.current);
        mapRef.current.fitBounds(polyline.getBounds());
    }, []);

    return <div id="map" style={{ height: '800px' }} />;
}

export default MapComponent;