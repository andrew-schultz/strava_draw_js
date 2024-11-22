"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useRef } from 'react';
import Spinner from "./Spinner"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({polylines, lineColor, showText, activity}) => {
    const mapRef = useRef(null);
    const infoDiv = document.getElementById('ActivityListItemDetailTextContainer');
    const mapHeight = window.innerHeight - infoDiv.offsetHeight;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mapRef.current) return; // Map already initialized

        setLoading(true);
        mapRef.current = L.map('map', {attributionControl: false, zoomControl: false, renderer: L.canvas() });
        mapRef.current.touchZoom.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.scrollWheelZoom.disable();
        mapRef.current.boxZoom.disable();
        mapRef.current.keyboard.disable();
        mapRef.current.dragging.disable();

        var polyline = new L.Polyline(polylines, {
            color: lineColor,
            weight: 3,
            opacity: 1
        });

        polyline.addTo(mapRef.current);
        const initialPolylineBounds = polyline.getBounds();
        let polylineBounds = initialPolylineBounds;
        // calc how close the north and south lat's are, if within a threshold then do not adjust bounds
        const northSouthDiff = initialPolylineBounds._northEast.lat - initialPolylineBounds._southWest.lat;
        console.log(northSouthDiff)
        if (northSouthDiff > 0.06) {
            console.log('adjusted')
            let adjustedPolylineBounds = initialPolylineBounds.pad(0.05);
            const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.025, adjustedPolylineBounds._northEast.lng);
            const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.025, adjustedPolylineBounds._southWest.lng);
            polylineBounds = L.latLngBounds(corner1, corner2);
        }

        mapRef.current.fitBounds(polylineBounds);
        
        const drawText = async (polylineBounds, canvas, lineColor) => {
            await generateText(polylineBounds, canvas, lineColor).then(()=> {
                genImage();
            });
        }

        const genImage = () => {
            setTimeout(() => {
                let dimensions = mapRef.current.getSize();
                let map = document.getElementById('map');
                let canvas = document.getElementsByTagName('canvas')[0];
                let dataURL = canvas.toDataURL();
    
                // hide map
                map.style.display = 'None';
    
                // Create an image element
                const img = new Image();
                img.width = dimensions.x;
                img.height = dimensions.y;
                img.id = 'genImage';
                document.getElementById('images').innerHTML = '';
                document.getElementById('images').appendChild(img);
                img.src = dataURL;
                                
                paintBackground(canvas.width, canvas.height);
                polyline.removeFrom(mapRef.current);
    
                setTimeout(() => {
                    var map = document.getElementById('map');
                    map.style.display = 'None';
                    setLoading(false);
                }, 10)
            }, 100)
        }

        let canvas = document.getElementsByTagName('canvas')[0];
        if (showText) {
            setTimeout(() => {
                drawText(polylineBounds, canvas, lineColor) 
            }, 100)
        }
        else {
            genImage()
        }

    }, []);

    const generateText = async (bounds, canvas, lineColor) => {
        await findLowestPixel(lineColor).then((lowestPixel) => {
            const ctx = canvas.getContext("2d");
            ctx.font = "bold 16pt Arial";
            ctx.fillStyle = lineColor;

            let dimensions = mapRef.current.getSize();
            const centerY = (lowestPixel / 2);

            // get canvas width / 3
            const third = dimensions.x / 3;
            const half = dimensions.x / 2;
            
            // get half of the value of above, thats the half way point of the third
            const thirdCenter = third / 2;
            const halfCenter = half / 2;

            // get width of text
            const distance = `${(activity.distance / 1609.34).toFixed(2)} mi`;
            const distanceText = 'Distance';
            const distanceTextWidth = ctx.measureText(distanceText).width;

            const totalElevation = `${Math.round(activity.total_elevation_gain * 3.281)} ft`;
            const totalElevationText = 'Elev. Gain';
            const totalElevationTextWidth = ctx.measureText(totalElevationText).width;

            const movingTime = getMovingTime(activity);
            const movingTimeText = 'Duration';
            const movingTimeTextWidth = ctx.measureText(movingTimeText).width;


            ctx.font = "bold 16pt Arial";
            // set text start point at text width / 2
            // distance = 0
            ctx.fillText(distanceText, thirdCenter - (distanceTextWidth / 2), centerY);
            
            // total_elevation_gain = third
            ctx.fillText(totalElevationText, thirdCenter + third - (totalElevationTextWidth / 2), centerY);
    
            // moving_time = third + third
            ctx.fillText(movingTimeText, thirdCenter + third + third - (movingTimeTextWidth / 2), centerY);


            ctx.font = "bold 20pt Arial";
            const distanceWidth = ctx.measureText(distance).width;
            ctx.fillText(distance, thirdCenter - (distanceWidth / 2), centerY + 35);

            const totalElevationWidth = ctx.measureText(totalElevation).width;
            ctx.fillText(totalElevation, thirdCenter + third - (totalElevationWidth / 2), centerY + 35);

            const movingTimeWidth = ctx.measureText(movingTime).width;
            ctx.fillText(`${movingTime}`, thirdCenter + third + third - (movingTimeWidth / 2), centerY + 35);
        });
    }

    const getMovingTime = (activity) => {
        let seconds = activity.moving_time % 60
        let minutes = Math.round(activity.moving_time / 60);
        let hours = parseInt(minutes / 60);
        let time = `${minutes}m ${seconds}s`;
        if (minutes > 60) {
            minutes = minutes % 60;
            time = `${hours}h ${minutes}m`;
        }
        return time;
    }

    const findLowestPixel = async (lineColor) => {
        const canvas = document.getElementsByTagName('canvas')[0];
        const ctx = canvas.getContext("2d");
        const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const color = lineColor === 'white' ? {r:255, g:255, b:255, a:255} : {r:0, g:0, b:0, a:255};
        const pix = imgd.data; // array of pixels
        let finalPixel = null;

        for (var i = 0, n = pix.length; i < n; i += 4) {
            var r = pix[i],
                g = pix[i+1],
                b = pix[i+2],
                a = pix[i+3];
            
            if (r == color.r && g == color.g && b == color.b && a == color.a) { 
                finalPixel = i;
                // console.log(`i=${i}, r ${r}, g ${g}, b ${b}, a ${a}`)
            }
        }

        const pixelLocation = finalPixel / 4
        const rowsAbove = pixelLocation / canvas.width

        return Math.round(rowsAbove);
    }

    const paintBackground = (x, y) => {
        const images = document.getElementById('images');
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '85vh';
        images.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#dddddd";
        ctx.fillRect(0, 0, x, y);
    }

    return (
        <div>
            <Spinner loading={loading} setLoading={setLoading}></Spinner>
            <div id="images"></div>
            <div id="map" style={{ height: `${mapHeight}px` }} />
        </div>
    )
}

export default MapComponent;