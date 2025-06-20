"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useRef } from 'react';
import leafletImage from "../services/leafletImage";
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
        showWeightedPower,
        lineColor,
        showText,
        useMiles,
        showMap,
    } = useTextGridProvider();
    let tLayer
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

        if (showMap) {
            // tLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {opacity: 0.25}).addTo(mapRef.current)
            // tLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {opacity: 0.25}).addTo(mapRef.current)
            // tLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
            // tLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
            // tLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {opacity: 0.25}).addTo(mapRef.current)
            tLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
            // if (lineColor == 'black') {
                // tLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
            // }
            // else {
                // tLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
            // }
        }
        // if (lineColor == 'black') {
            // tLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
        // }
        // else {
            // tLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
        // }

        setLoading(true);
        
        var polyline = new L.Polyline(polylines, {
            color: lineColor,
            weight: 3,
            opacity: 1
        });

        polyline.addTo(mapRef.current);
        const initialPolylineBounds = polyline.getBounds().pad(0.25);;
        let polylineBounds = initialPolylineBounds;
        // calc how close the north and south lat's are, if within a threshold then do not adjust bounds
        const northSouthDiff = initialPolylineBounds._northEast.lat - initialPolylineBounds._southWest.lat;

        // would be good to eventually redo this calc including the text to check if its going off the page
        //      should adjust if going off the page    

        if (northSouthDiff > 0.06) {
            // let adjustedPolylineBounds = initialPolylineBounds.pad(0.06);
            let adjustedPolylineBounds = initialPolylineBounds
            const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.035, adjustedPolylineBounds._northEast.lng);
            const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.035, adjustedPolylineBounds._southWest.lng);
            polylineBounds = L.latLngBounds(corner1, corner2);
        }

        mapRef.current.fitBounds(polylineBounds);

        const drawText = async (polylineBounds, canvas, lineColor) => {
            // const ctx = canvas.getContext('2d');
            
            // get the image data for exactly the map, returns top, left, right, and bottom pixels/coords
            // let bindingCoords = await findPixelBounds(lineColor, canvas);
            
            // getImageData(left x coord, top y coord, width, height)
            // let dimensions = mapRef.current.getSize();

            // calculate binding width / height based on returned coords
            // const bindingWidth = bindingCoords.right - bindingCoords.left;
            // const bindingHeight = bindingCoords.last - bindingCoords.first;

            // get image data from map canvas
            // let mapImg = ctx.getImageData(bindingCoords.left, bindingCoords.first, bindingWidth, bindingHeight);

            // clear the canvas
            // ctx.clearRect(0, 0, canvas.width, canvas.height);

            // calculate / adjust width / size until both just fit within bounds
            // let justFitWidth = bindingWidth;
            // let justFitHeight = bindingHeight;
            // let justFitVar = 1.0;

            // console.log(dimensions.y, dimensions.y * 0.70)
            // while (justFitWidth > dimensions.x || justFitHeight > (dimensions.y * 0.70)) {
            //     justFitWidth = bindingWidth * justFitVar;
            //     justFitHeight = bindingHeight * justFitVar;
            //     justFitVar -= 0.05;
            //     console.log(justFitVar, justFitHeight, justFitWidth)
            // }

            // // calculate width/height with aspect ratio
            // let newWidth = justFitWidth;
            // let newHeight = justFitHeight;

            // // create an offscreen canvas to draw/hold the image on
            // const offscreenCanvas = new OffscreenCanvas(bindingWidth, bindingHeight);
            // const offCtx = offscreenCanvas.getContext('2d');
            
            let hadToAdjust = false;
            // let widthDif = (dimensions.x - newWidth) / 2;
            // // let heightDif = (dimensions.y - newHeight) / 2

            // // redraw the image data to the offscreen canvas
            // // def putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
            // offCtx.putImageData(mapImg, 0, 0);

            // if (bindingWidth < dimensions.x && bindingHeight < dimensions.y) {
            //     ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, 0, justFitWidth, justFitHeight);
            // }
            // else if (hadToAdjust) {
            //     ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, 10, justFitWidth, justFitHeight);
            // }
            // else {
            //     ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, -30, justFitWidth, justFitHeight);
            // }

            await generateText(polylineBounds, canvas, lineColor, hadToAdjust, mapRef, activity, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, showWeightedPower, placementGrid, useMiles).then(() => {
                genImage(canvas);
            });
        }

        const removeBackground = async (c) => {
            var ctx = c.getContext("2d")
            var imgd = ctx.getImageData(0, 0, c.width, c.height),
                pix = imgd.data,
                newColor = {r:0, g:0, b:0, a:0},
                lightColor = {r:245, g:245, b:245, a:1.0};

            for (var i = 0, n = pix.length; i < n; i += 4) {
                var r = pix[i],
                    g = pix[i+1],
                    b = pix[i+2];

                // If its white then change it
                // console.log(r, g, b)
                // if (r < 221 && g < 221 && b < 221) { 
                // if (r == 164 && g == 175 && b == 183) {
                //     // Change the white to whatever.
                //     pix[i] = 255;
                //     pix[i+1] = 255;
                //     pix[i+2] = 255;
                // }
                // if (r > 80 && r < 200 && g > 80 && g < 200 && b > 80 && b < 205) {
                //     // Change the white to whatever.
                //     pix[i] = 255;
                //     pix[i+1] = 255;
                //     pix[i+2] = 255;
                // }

                if (r <= 225 && g <= 225 && b <= 225) { 
                    // Change the white to whatever.
                    pix[i] = newColor.r;
                    pix[i+1] = newColor.g;
                    pix[i+2] = newColor.b;
                    pix[i+3] = newColor.a;
                }
                else if (r > 240 && r < 245 && g > 240 && g < 245 && b > 240 && b < 245) {
                    // console.log(r, g, b)
                    pix[i] = newColor.r;
                    pix[i+1] = newColor.g;
                    pix[i+2] = newColor.b;
                    pix[i+3] = newColor.a;
                }
                else if (r > 244 && r < 250 && g > 244 && g < 250 && b > 244 && b < 250) {
                    // pix[i] = lightColor.r;
                    // pix[i+1] = lightColor.g;
                    // pix[i+2] = lightColor.b;
                    // pix[i+3] = 0.9;
                }

                // if (r <= 180 && g <= 200 && b <= 225) { 

                //     // Change the white to whatever.
                //     pix[i] = newColor.r;
                //     pix[i+1] = newColor.g;
                //     pix[i+2] = newColor.b;
                //     pix[i+3] = newColor.a;
                // }
            }
            ctx.putImageData(imgd, 0, 0);

            return c
        }

        const genImage = (canvas) => {
            leafletImage(mapRef.current, async (err, canvas)  => {
                // now you have canvas
                // example thing to do with that canvas:
                
                var img = document.createElement('img');
                var dimensions = mapRef.current.getSize();
                img.width = dimensions.x;
                img.height = dimensions.y;

                var cleanCanvas = await removeBackground(canvas)
                // debugger
                img.src = await cleanCanvas.toDataURL();
                // debugger
                const limages = document.getElementById('limages')
                if (limages) {
                    limages.innerHTML = '';
                    limages.appendChild(img);
                }
     
            });

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
                // const img = new Image();
                // img.width = dimensions.x;
                // img.height = dimensions.y;
                // img.id = 'genImage';
                // document.getElementById('images').innerHTML = '';
                // document.getElementById('images').appendChild(img);
                // img.src = dataURL;
                                
                // paintBackground(canvas.width, canvas.height);
                // polyline.removeFrom(mapRef.current);
    
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
            <div id="limages"></div>
            <div id="images"></div>
            <div id="map" style={{ height: `${mapHeight}px` }} />
        </div>
    )
}

export default MapComponent;