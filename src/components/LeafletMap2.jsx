"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
// import "tilelayer-canvas";
// import TilelayerCanvas from "./TilelayerCanvas";

import * as d3 from "d3";

import { useEffect, useState, useRef } from 'react';
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
        lineColor,
        showText,
    } = useTextGridProvider();

    const mapRef = useRef(null);
    const infoDiv = document.getElementById('ActivityListItemDetailTextContainer');
    const mapHeight = window.innerHeight - infoDiv.offsetHeight;

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
            // L.tileLayer.canvas('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapRef.current)
            mapRef.current.touchZoom.disable();
            mapRef.current.doubleClickZoom.disable();
            mapRef.current.scrollWheelZoom.disable();
            mapRef.current.boxZoom.disable();
            mapRef.current.keyboard.disable();
            mapRef.current.dragging.disable();
        }
      
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
            
        // if (northSouthDiff > 0.1) {
        //     let adjustedPolylineBounds = initialPolylineBounds.pad(0.08);
        //     const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.035, adjustedPolylineBounds._northEast.lng);
        //     const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.035, adjustedPolylineBounds._southWest.lng);
        //     polylineBounds = L.latLngBounds(corner1, corner2);
        // }
        // else 
        if (northSouthDiff > 0.06) {
            let adjustedPolylineBounds = initialPolylineBounds.pad(0.06);
            const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.025, adjustedPolylineBounds._northEast.lng);
            const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.025, adjustedPolylineBounds._southWest.lng);
            polylineBounds = L.latLngBounds(corner1, corner2);
        }
        // else if (northSouthDiff > 0.03) {
        //     let adjustedPolylineBounds = initialPolylineBounds.pad(0.03);
        //     const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.010, adjustedPolylineBounds._northEast.lng);
        //     const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.010, adjustedPolylineBounds._southWest.lng);
        //     polylineBounds = L.latLngBounds(corner1, corner2);
        // }
        // else if (northSouthDiff > 0.02) {
        //     let adjustedPolylin9eBounds = initialPolylineBounds.pad(0.04);
        //     const corner1 = L.latLng(adjustedPolylineBounds._northEast.lat - 0.015, adjustedPolylineBounds._northEast.lng);
        //     const corner2 =  L.latLng(adjustedPolylineBounds._southWest.lat - 0.015, adjustedPolylineBounds._southWest.lng);
        //     polylineBounds = L.latLngBounds(corner1, corner2);
        // }

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

            // // draw border in canvas
            // drawCanvasBorder(dimensions.x, dimensions.y, ctx);

            // calculate / adjust width / size until both just fit within bounds
            let justFitWidth = bindingWidth;
            let justFitHeight = bindingHeight;
            let justFitVar = 1.0;

            // width and height modifiers are .05 less than the modifiers used to draw the border lines
            while (justFitWidth > (dimensions.x * (xModifier - 0.05)) || justFitHeight > (dimensions.y * (yModifier - 0.05))) {
                justFitWidth = bindingWidth * justFitVar;
                justFitHeight = bindingHeight * justFitVar;
                justFitVar -= 0.02;
            }

            // draw border in canvas
            drawCanvasBorder(dimensions.x, dimensions.y, ctx);

            // calculate width/height with aspect ratio
            let newWidth = justFitWidth;
            let newHeight = justFitHeight;

            // create an offscreen canvas to draw/hold the image on
            const offscreenCanvas = new OffscreenCanvas(bindingWidth, bindingHeight);
            const offCtx = offscreenCanvas.getContext('2d');
            
            let hadToAdjust = false;
            // let widthDif = ()
            let widthDif = ((dimensions.x * xModifier) - newWidth) / 2;
            let heightDif = ((dimensions.y * yModifier) - newHeight) /2;
            // let heightDif = (dimensions.y - newHeight) / 2

            // redraw the image data to the offscreen canvas
            // def putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
            offCtx.putImageData(mapImg, 0,0);

            // // // create an offscreen canvas to draw/hold the image on
            // const offscreenCanvasG = new OffscreenCanvas(canvas.width, canvas.height);

            // const offCtxGraph = offscreenCanvasG.getContext('2d');

            if (bindingWidth < dimensions.x && bindingHeight < dimensions.y) {
                ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, heightDif, justFitWidth, justFitHeight);
            }
            else if (hadToAdjust) {
                ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, heightDif, justFitWidth, justFitHeight);
            }
            else {
                ctx.drawImage(offscreenCanvas, 0, 0, bindingWidth, bindingHeight, widthDif, heightDif, justFitWidth, justFitHeight);
            }
            // generate the graph image
            // const graphImage = 
            genGraph(dimensions.x, dimensions.y, lineColor, canvas)
            
            // .then(graphImage => {
            //     // debugger
            //     if (graphImage) {
            //         offCtxGraph.drawImage(graphImage, 0, 0)
            //         // to calc the height, take whatever the float val modifier is from the genGraph func and make it .01 less to give us some padding on top
            //         ctx.drawImage(offscreenCanvasG, 0, dimensions.y - dimensions.y * 0.14)

            //         generateText2(
            //             polylineBounds, 
            //             xModifier, 
            //             yModifier, 
            //             canvas, 
            //             lineColor, 
            //             hadToAdjust, 
            //             mapRef, 
            //             activity, 
            //             showDistance, 
            //             showElevGain, 
            //             showPace, 
            //             showDuration, 
            //             showAvgPower, 
            //             showAvgSpeed, 
            //             showWorkDone, 
            //             placementGrid
            //         ).then(() => {
            //             genImage(canvas)
            //         });
            //     }
                
            // })

            // await generateText(polylineBounds, canvas, lineColor, hadToAdjust).then(removeBackground(canvas)).then(() => {
            //     genImage(canvas);
            // });
            // await generateText2(polylineBounds, xModifier, yModifier, canvas, lineColor, hadToAdjust, mapRef, activity, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, placementGrid).then(() => {
            //     genImage(canvas)
            // });
        }

        const genGraph = async (justWidth, justHeight, lineColor, canvas) => {
            // const marginTop = 20,
            // marginRight = 20,
            // marginBottom = 30,
            // marginLeft = 40,
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

            // const yExtent = d3.extent(formattedData)
            // yExtent[0] -= 10
            // // yExtent[1] = 300
            
            // if (yExtent[1] < yExtent[0] + 200) {
            //     yExtent[1] = yExtent[0] + 200
            // }
            // debugger
            // make the scales for the x and y axis
            const x = d3.scaleLinear([0, data.length - 1], [0, width]);
            // const y = d3.scaleLinear(yExtent, [height, 0]);
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
                // .attr("opacity", "0.5")

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
            // img.onload = () => {
            //     return img
            // }
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
                    placementGrid
                ).then(() => {
                    genImage(canvas)
                });

            }
            // setTimeout(() => {
            //     return img
            // }, 100)
            // return img
            
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

                // create a second, larger image thats invisible but has a higher zindex so is selected when you hold to download
                // const img2 = new Image();
                // img2.width = dimensions.x * 5;
                // img2.height = dimensions.y * 5;
                // img2.id = 'genImageBig';
                // img2.src = dataURL;

                document.getElementById('images').innerHTML = '';
                document.getElementById('images').appendChild(img);
                // document.getElementById('images').appendChild(img2);
        
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