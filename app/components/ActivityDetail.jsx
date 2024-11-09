"use client";
import { useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';

var polyline = require('@mapbox/polyline');

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { MapContainer, Marker, TileLayer, Tooltip, Polyline } from "react-leaflet"


const ActivityDetail = ({activity}) => {
    const ref = useRef();
    const [polylines, setPolylines] = useState();
    const [map, setMap] = useState();

    useEffect(() => {
        let polylines = activity.map.summary_polyline;
        let decoded_polylines = polyline.decode(polylines);
        setPolylines(decoded_polylines)
        // let map
        // if (!map) {
        //     // map = leaflet.map('map', {center: decoded_polylines[0], zoom: 12, zoomControl: false, tiles: null})
        //     debugger
        //     var firstpolyline = new leaflet.Polyline(decoded_polylines, {
        //         color: 'black',
        //         weight: 3,
        //         opacity: 0.5,
        //         smoothFactor: 1
        //     });
        //     firstpolyline.addTo(map);
        //     debugger
        // }
            
        // let map = <LazyMap position={decoded_polylines[0]} zoom={12} ref={ref}/> 
        // debugger

        // setMap(map)
        // MapContainer.map.
    }, [])

    const LazyMap = dynamic(() => import('./LeafletMap'), { 
        loading: () => <p>A map is loading</p>,
        ssr: false
    })
    

    const MapComponent = dynamic(() => import('./LeafletMap'), {
        ssr: false,
    });

    return (
        <div className="activity-list-item" >
            <p>Name: {activity.name}</p>
            <p>Date: {activity.start_date}</p>
            <p>Distance: {activity.distance / 1609.34}</p>
            {polylines ? (<MapComponent polylines={polylines}></MapComponent>) : null}
        </div>
    )
};

export default ActivityDetail