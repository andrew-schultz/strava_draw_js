"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
// import "tilelayer-canvas";
// import TilelayerCanvas from "./TilelayerCanvas";

import * as d3 from "d3";

import { useEffect, useState, useRef } from 'react';
import leafletImage from "../services/leafletImage";
import Spinner from "./Spinner";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTextGridProvider } from "../providers/TextGridProvider";
import { generateText2, findPixelBounds, paintBackground } from "../services/mapUtils";


const MapComponent2 = ({
    polylines, 
    activity,
    data,
    xData,
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

    const mapRef = useRef(null);
    const infoDiv = document.getElementById('ActivityListItemDetailTextContainer');
    const mapHeight = window.innerHeight - infoDiv.offsetHeight;
    let tLayer

    const [xModifier, setXModifier] = useState(0.70);
    const [yModifier, setYModifier] = useState(0.85);
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
        setLoading(true);

        // if (mapRef.current) return; // Map already initialized
        if (mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                layer.remove();
            });
        } else {
            mapRef.current = L.map('map', {attributionControl: false, zoomControl: false, renderer: L.canvas() });
            L.tileLayer('map').addTo(mapRef.current)
            mapRef.current.touchZoom.disable();
            mapRef.current.doubleClickZoom.disable();
            mapRef.current.scrollWheelZoom.disable();
            mapRef.current.boxZoom.disable();
            mapRef.current.keyboard.disable();
            mapRef.current.dragging.disable();
        }

        if (showMap) {
            tLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {opacity: 0.25}).addTo(mapRef.current)
        }
      
        var polyline = new L.Polyline(polylines, {
            color: lineColor,
            weight: 3,
            opacity: 1
        });

        polyline.addTo(mapRef.current);
        const initialPolylineBounds = polyline.getBounds().pad(0.09);
        let polylineBounds = initialPolylineBounds;

        // calc how close the north and south lat's are, if within a threshold then do not adjust bounds
        // const northSouthDiff = initialPolylineBounds._northEast.lat - initialPolylineBounds._southWest.lat;
        // if (northSouthDiff > 0.06) {
        //     let adjustedPolylineBounds = initialPolylineBounds.pad(0.06);
        //     const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.025, adjustedPolylineBounds._northEast.lng);
        //     const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.025, adjustedPolylineBounds._southWest.lng);
        //     polylineBounds = L.latLngBounds(corner1, corner2);
        // }

        mapRef.current.fitBounds(polylineBounds);

        const removeBackground = async (c) => {
            var ctx = c.getContext("2d")
            var imgd = ctx.getImageData(0, 0, c.width, c.height),
                pix = imgd.data,
                newColor = {r:0, g:0, b:0, a:0};
                // lightColor = {r:245, g:245, b:245, a:1.0};

            for (var i = 0, n = pix.length; i < n; i += 4) {
                var r = pix[i],
                    g = pix[i+1],
                    b = pix[i+2];

                if (r <= 225 && g <= 225 && b <= 225) { 
                    // Change the white to whatever.
                    pix[i] = newColor.r;
                    pix[i+1] = newColor.g;
                    pix[i+2] = newColor.b;
                    pix[i+3] = newColor.a;
                }
                // else if (r > 240 && r < 245 && g > 240 && g < 245 && b > 240 && b < 245) {
                //     // console.log(r, g, b)
                //     // pix[i] = newColor.r;
                //     // pix[i+1] = newColor.g;
                //     // pix[i+2] = newColor.b;
                //     // pix[i+3] = newColor.a;
                // }
                // else if (r > 244 && r < 250 && g > 244 && g < 250 && b > 244 && b < 250) {
                //     // pix[i] = lightColor.r;
                //     // pix[i+1] = lightColor.g;
                //     // pix[i+2] = lightColor.b;
                //     // pix[i+3] = 0.9;
                // }
            }
            ctx.putImageData(imgd, 0, 0);

            return c
        }

        const drawText = async (polylineBounds, canvas, lineColor) => {
            const ctx = canvas.getContext('2d');
            
            // get the image data for exactly the map, returns top, left, right, and bottom pixels/coords
            // let bindingCoords = await findPixelBounds(lineColor, canvas);
            
            // // getImageData(left x coord, top y coord, width, height)
            let dimensions = mapRef.current.getSize();

            // // calculate binding width / height based on returned coords
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

            // // width and height modifiers are .05 less than the modifiers used to draw the border lines
            // while (justFitWidth > (dimensions.x * (xModifier - 0.05)) || justFitHeight > (dimensions.y * (yModifier - 0.05))) {
            //     justFitWidth = bindingWidth * justFitVar;
            //     justFitHeight = bindingHeight * justFitVar;
            //     justFitVar -= 0.02;
            // }

            leafletImage(mapRef.current, async (err, c)  => {
                var cleanCanvas = await removeBackground(c)
                const cleanCtx = cleanCanvas.getContext('2d');

                // get the image data for exactly the map, returns top, left, right, and bottom pixels/coords
                let bindingCoords = await findPixelBounds(lineColor, cleanCanvas);
                
                // calculate binding width / height based on returned coords
                const bindingWidth = bindingCoords.right - bindingCoords.left;
                const bindingHeight = bindingCoords.last - bindingCoords.first;

                const subW = dimensions.x * xModifier
                const subH = dimensions.y * yModifier

                const startL = bindingCoords.left - ((subW - bindingWidth) / 2)
                const startH = bindingCoords.first - ((subH - bindingHeight) / 2)

                // get image data from map canvas
                // getImageData(left x coord, top y coord, width, height)
                let mapImg = cleanCtx.getImageData(startL, startH, subW, subH);

                // calculate width/height with aspect ratio
                let newWidth = subW;
                let newHeight = subH;

                let justFitWidth = subW;
                let justFitHeight = subH;

                // create an offscreen canvas to draw/hold the image on
                const offscreenCanvas = new OffscreenCanvas(subW, subH);
                const offCtx = offscreenCanvas.getContext('2d');

                let hadToAdjust = false;
                let widthDif = ((dimensions.x * xModifier) - newWidth) / 2;
                let heightDif = ((dimensions.y * yModifier) - newHeight) /2;

                // redraw the image data to the offscreen canvas
                // def putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
                offCtx.putImageData(mapImg, 0,0);
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // draw border in canvas
                drawCanvasBorder(dimensions.x, dimensions.y, ctx);
                
                if (bindingWidth < dimensions.x && bindingHeight < dimensions.y) {
                    ctx.drawImage(offscreenCanvas, 0, 0, subW, subH, widthDif, heightDif, justFitWidth, justFitHeight);
                }
                else if (hadToAdjust) {
                    ctx.drawImage(offscreenCanvas, 0, 0, subW, subH, widthDif, heightDif, justFitWidth, justFitHeight);
                }
                else {
                    ctx.drawImage(offscreenCanvas, 0, 0, subW, subH, widthDif, heightDif, justFitWidth, justFitHeight);
                }
                // generate the graph image
                genGraph(dimensions.x, dimensions.y, lineColor, canvas)
            });
        }

        const genGraph = async (justWidth, justHeight, lineColor, canvas) => {
            const width = justWidth;
            const height = justHeight * (1 - yModifier - 0.01);
            const ctx = canvas.getContext('2d');

            // meters to miles 
            // 1 meter = 0.0006213712 miles

            const formattedData = []
            data.forEach(d => {
                // meter to feet
                // 1 meter = 3.280839895 feet
                const fD = d * 3.280839895
                formattedData.push(fD)
            })

            // make the scales for the x and y axis
            const x = d3.scaleLinear([0, data.length - 1], [0, width]);
            const y = d3.scaleLinear(d3.extent(formattedData), [height, 0]);
        
            const line = d3.line((d, i) => x(i), y);
        
            // Declare the area generator.
            const area = d3.area()
                .x((d, i) => x(i))
                .y0(y(0))
                .y1(d => y(d));
            
            // Create the SVG container.
            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height);

            // add the area fill to the svg
            svg.append("path")
                .attr("d", area(formattedData))
                .attr("fill", lineColor)
                .attr("stroke", lineColor)
                .attr("strokeWidth", "1.0")

            // add the line to the svg
            svg.append("path")
                .attr("d", line(formattedData))
                .attr("fill", "none")
                .attr("stroke", lineColor)
                .attr("strokeWidth", "1.5")

            // create a dataString for the svg
            const svgString = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg.nodes()[0]));
            
            // create an image to assign the svg data string to, then return it
            const img = new Image();
            img.src = svgString
            img.onload = () => {
                // // create an offscreen canvas to draw/hold the image on
                const offscreenCanvasG = new OffscreenCanvas(canvas.width, canvas.height);
                const offCtxGraph = offscreenCanvasG.getContext('2d');
                offCtxGraph.drawImage(img, 0, 0)
                // to calc the height, take whatever the float val modifier is from the genGraph func and make it .01 less to give us some padding on top
                ctx.drawImage(offscreenCanvasG, 0, justHeight - justHeight * 0.14)

                generateText2(
                    xModifier, 
                    yModifier, 
                    canvas, 
                    lineColor, 
                    mapRef, 
                    activity, 
                    showDistance, 
                    showElevGain, 
                    showPace, 
                    showDuration, 
                    showAvgPower, 
                    showAvgSpeed, 
                    showWorkDone, 
                    showWeightedPower,
                    placementGrid,
                    useMiles,
                ).then(() => {
                    genImage(canvas)
                });
            }
        }

        const genImage = (canvas) => {
            setTimeout(() => {
                let dimensions = mapRef.current.getSize();
                let map = document.getElementById('map');
                let dataURL = canvas.toDataURL();
    
                // hide map
                map.style.display = 'None';
                // Create an image element
                const img = new Image();
                img.width = dimensions.x;
                img.height = dimensions.y;
                img.id = 'genImage';
                img.src = dataURL;

                document.getElementById('images').innerHTML = '';
                document.getElementById('images').appendChild(img);
        
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

    const drawCanvasBorder = (width, height, ctx) => {
        const lineWidth = 4
        ctx.beginPath();
        ctx.strokeStyle = lineColor; // make this a var later?
        ctx.lineWidth = lineWidth;
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.lineTo(0, -(lineWidth / 2));

        ctx.moveTo(width - width * (1.0 - xModifier), 0);
        ctx.lineTo(width - width * (1.0 - xModifier), height - height * (1.0 - yModifier));

        ctx.moveTo(width, height - height * (1.0 - yModifier));
        ctx.lineTo(0, height - height * (1.0 - yModifier));

        ctx.stroke();
    }

    return (
        <div>
            <Spinner loading={loading} setLoading={setLoading} typeOption={'map'}></Spinner>
            <div id="images"></div>
            <div id="map" style={{ height: `${mapHeight}px` }} />
        </div>
    )
}

export default MapComponent2;