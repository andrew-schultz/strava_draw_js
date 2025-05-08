"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useRef } from 'react';
import Spinner from "./Spinner";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTextGridProvider } from "../providers/TextGridProvider";
import { generateText, findPixelBounds, paintBackground } from "../services/mapUtils";

const MapComponent = ({
    polylines, 
    activity,
}) => {
    const {
        drawNow,
        setDrawNow,
        placementGrid,
        showDistance,
        showDuration,
        showElevGain,
        showPace,
        showAvgPower,
        showAvgSpeed,
        showWorkDone,
        lineColor,
        showText,
        useMiles,
    } = useTextGridProvider();

    const mapRef = useRef(null);
    const infoDiv = document.getElementById('ActivityListItemDetailTextContainer');
    const mapHeight = window.innerHeight - infoDiv.offsetHeight;

    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (mounted) {
            drawMap()
        }
    }, [mounted])

    useEffect(() => {
        if (drawNow && mounted) {
            drawMap()
            setDrawNow(false)
        } 
        else if (drawNow) {
            setTimeout(() => {
                drawMap()
                setDrawNow(false)
            }, 100)
        }
    }, [drawNow])

    // tile layer options
    // 'https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png' -- requires an access token
    // 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
    // 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    // 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    const drawMap = () => {
        console.log('drawing map')
        // if (mapRef.current) return; // Map already initialized
        if (mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                layer.remove();
            });
        } else {
            mapRef.current = L.map('map', {attributionControl: false, zoomControl: false, renderer: L.canvas() });
            L.tileLayer('map').addTo(mapRef.current)
            // L.tileLayer.canvas('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapRef.current)
            mapRef.current.touchZoom.disable();
            mapRef.current.doubleClickZoom.disable();
            mapRef.current.scrollWheelZoom.disable();
            mapRef.current.boxZoom.disable();
            mapRef.current.keyboard.disable();
            mapRef.current.dragging.disable();
        }

        setLoading(true);
        
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

        // would be good to eventually redo this calc including the text to check if its going off the page
        //      should adjust if going off the page    

        if (northSouthDiff > 0.06) {
            let adjustedPolylineBounds = initialPolylineBounds.pad(0.06);
            const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.025, adjustedPolylineBounds._northEast.lng);
            const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.025, adjustedPolylineBounds._southWest.lng);
            polylineBounds = L.latLngBounds(corner1, corner2);
        }

        mapRef.current.fitBounds(polylineBounds);

        const drawText = async (polylineBounds, canvas, lineColor) => {
            const ctx = canvas.getContext('2d');
            
            // get the image data for exactly the map, returns top, left, right, and bottom pixels/coords
            let bindingCoords = await findPixelBounds(lineColor, canvas);
            
            // getImageData(left x coord, top y coord, width, height)
            let dimensions = mapRef.current.getSize();

            // calculate binding width / height based on returned coords
            const bindingWidth = bindingCoords.right - bindingCoords.left;
            const bindingHeight = bindingCoords.last - bindingCoords.first;

            // get image data from map canvas
            let mapImg = ctx.getImageData(bindingCoords.left, bindingCoords.first, bindingWidth, bindingHeight);

            // clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // calculate / adjust width / size until both just fit within bounds
            let justFitWidth = bindingWidth;
            let justFitHeight = bindingHeight;
            let justFitVar = 1.0;

            console.log(dimensions.y, dimensions.y * 0.70)
            while (justFitWidth > dimensions.x || justFitHeight > (dimensions.y * 0.70)) {
                justFitWidth = bindingWidth * justFitVar;
                justFitHeight = bindingHeight * justFitVar;
                justFitVar -= 0.05;
                console.log(justFitVar, justFitHeight, justFitWidth)
            }

            // calculate width/height with aspect ratio
            let newWidth = justFitWidth;
            let newHeight = justFitHeight;

            // create an offscreen canvas to draw/hold the image on
            const offscreenCanvas = new OffscreenCanvas(bindingWidth, bindingHeight);
            const offCtx = offscreenCanvas.getContext('2d');
            
            let hadToAdjust = false;
            let widthDif = (dimensions.x - newWidth) / 2;
            // let heightDif = (dimensions.y - newHeight) / 2

            // redraw the image data to the offscreen canvas
            // def putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
            offCtx.putImageData(mapImg, 0, 0);

            if (bindingWidth < dimensions.x && bindingHeight < dimensions.y) {
                ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, 0, justFitWidth, justFitHeight);
            }
            else if (hadToAdjust) {
                ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, 10, justFitWidth, justFitHeight);
            }
            else {
                ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, -30, justFitWidth, justFitHeight);
            }

            await generateText(polylineBounds, canvas, lineColor, hadToAdjust, mapRef, activity, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, placementGrid, useMiles).then(() => {
                genImage(canvas);
            });
        }

        const genImage = (canvas) => {
            setTimeout(() => {
                let dimensions = mapRef.current.getSize();
                let map = document.getElementById('map');
                let dataURL = canvas.toDataURL();
    
                // hide map
                if (map) {
                    map.style.display = 'None';
                } else {
                    return
                }
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
                }, 10);
            }, 100);
        }

        const canvases = document.getElementsByTagName('canvas');
        let canvas;
        if (canvases.length > 1) {
            // canvas = canvases[1]  
            canvas = canvases[canvases.length - 1]
        } else {
            canvas = canvases[0]
        }

        if (showText) {
            setTimeout(() => {
                drawText(polylineBounds, canvas, lineColor);
            }, 100);
        }
        else {
            genImage(canvas);
        }
    }

    return (
        <div>
            <Spinner loading={loading} setLoading={setLoading} typeOption={'map'}></Spinner>
            <div id="images"></div>
            <div id="map" style={{ height: `${mapHeight}px` }} />
        </div>
    )
}

export default MapComponent;