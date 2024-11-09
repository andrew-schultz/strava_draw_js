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

        mapRef.current = L.map('map', {zoomControl: false }).setView(polylines[0], 13);
        const lineColor = 'black'

        var polyline = new L.Polyline(polylines, {
            color: lineColor,
            weight: 2,
            opacity: 1
        });
        polyline.addTo(mapRef.current);


        // var bounds = L.bounds(polylines)
        console.log(polylines)
        var bounds = mapRef.current.getBounds();
        console.log(bounds)
        // console.log(obounds)
        // mapRef.current.setView([bounds._northEast, bounds._southWest], [100, 100])
        mapRef.current.fitBounds(bounds, [100, 100]);
        // mapRef.current.setMaxBounds(bounds, [100, 100]);

        // while loop
        // while (bounds._northEast < )
        // setTimeout(function() {
        //     mapRef.current.setZoom(mapRef.current.getZoom());
        // }, 500);

      // Add tile layer, markers, etc.
    }, []);

    return <div id="map" style={{ height: '800px' }} />;
}

export default MapComponent;