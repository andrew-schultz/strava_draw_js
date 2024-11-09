"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

var polyline = require('@mapbox/polyline');

// import 'leaflet/dist/leaflet.css';

const ActivityDetail = ({activity}) => {
    const [polylines, setPolylines] = useState();

    useEffect(() => {
        let polylines = activity.map.summary_polyline;
        let decoded_polylines = polyline.decode(polylines);
        setPolylines(decoded_polylines)
    }, [])

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