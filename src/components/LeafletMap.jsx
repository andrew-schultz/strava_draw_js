"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useRef } from 'react';
import Spinner from "./Spinner"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTextGridProvider } from "../providers/TextGridProvider";

const MapComponent = ({
    polylines, 
    lineColor, 
    showText, 
    activity,
}) => {
    const {
        drawNow,
        setDrawNow,
        grid,
        onList,
        placementGrid,
        showDistance,
        showDuration,
        showElevGain,
        showPace,
        showAvgPower,
        showAvgSpeed,
        showWorkDone,
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

    const drawMap = () => {
        console.log('drawing map')
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
            
            // if the new calculated height of the binding coords is greater than 75% of the map canvas height
            // then update/increase the main canvas height & width
            // if (newHeight / dimensions.y > 0.70) {
            //     hadToAdjust = true;
            //     canvas.height = dimensions.y + 100;
            //     canvas.width = dimensions.x + 100;
            //     widthDif = (dimensions.x + 100 - newWidth) / 2;
            // }

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

            await generateText(polylineBounds, canvas, lineColor, hadToAdjust).then(()=> {
                genImage(canvas);
            });
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

        const canvas = document.getElementsByTagName('canvas')[0];
        if (showText) {
            setTimeout(() => {
                drawText(polylineBounds, canvas, lineColor);
            }, 100);
        }
        else {
            genImage(canvas);
        }
    }

    const calculateTextPlacement = (
        distance, elevationGain, pace, duration, avgPower, avgSpeed, workDone,
        distanceText, totalElevationText, paceText, durationText, avgPowerText, avgSpeedText, workDoneText,
        ctx,
    ) => {
        const keys = {
            showDistance: {
                name: 'distance', 
                isOn: showDistance,
                location: null,
                val: distance,
                valWidth: ctx.measureText(distance).width,
                text: distanceText,
                textWidth: ctx.measureText(distanceText).width,
            },
            showElevGain: {
                name: 'elevation_gain', 
                isOn: showElevGain,
                location: null,
                val: elevationGain,
                valWidth: ctx.measureText(elevationGain).width,
                text: totalElevationText,
                textWidth: ctx.measureText(totalElevationText).width,
            },
            showPace: {
                name: 'pace', 
                isOn: showPace,
                location: null,
                val: pace,
                valWidth: ctx.measureText(pace).width,
                text: paceText,
                textWidth: ctx.measureText(paceText).width,
            },
            showDuration: {
                name: 'duration', 
                isOn: showDuration,
                location: null,
                val: duration,
                valWidth: ctx.measureText(duration).width,
                text: durationText,
                textWidth: ctx.measureText(durationText).width,
            },
            showAvgPower: {
                name: 'avg_power', 
                isOn: showAvgPower,
                location: null,
                val: avgPower,
                valWidth: ctx.measureText(avgPower).width,
                text: avgPowerText,
                textWidth: ctx.measureText(avgPowerText).width,
            },
            showAvgSpeed: {
                name: 'avg_speed', 
                isOn: showAvgSpeed,
                location: null,
                val: avgSpeed,
                valWidth: ctx.measureText(avgSpeed).width,
                text: avgSpeedText,
                textWidth: ctx.measureText(avgSpeedText).width,
            },
            showWorkDone: {
                name: 'work_done', 
                isOn: showWorkDone,
                location: null,
                val: workDone,
                valWidth: ctx.measureText(workDone).width,
                text: workDoneText,
                textWidth: ctx.measureText(workDoneText).width,
            },
        };

        const onGrid = {
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null,
        }

        Object.keys(placementGrid).forEach((id) => {
            if (placementGrid[id].val) {
                keys[placementGrid[id].val.field].location = id;
                onGrid[id] = keys[placementGrid[id].val.field];
            }
        })

        return onGrid
    }

    const generateText = async (bounds, canvas, lineColor, hadToAdjust) => {
        await findLowestPixel(lineColor, canvas).then((lowestPixel) => {
            const ctx = canvas.getContext("2d");
            ctx.font = "bold 16pt Arial";
            ctx.fillStyle = lineColor;

            // get width/height of map canvas
            let dimensions = mapRef.current.getSize();
            if (hadToAdjust) {
                dimensions = {x: canvas.width, y: canvas.height};
            }

            // get canvas width / 3
            let centerY = (lowestPixel / 2);
            let third = (dimensions.x) / 3;

            if (hadToAdjust) {
                centerY = lowestPixel + 50;
            }
            // const third = (dimensions.x + 100) / 3;
            const half = dimensions.x / 2;
            
            // get half of the value of above, thats the half way point of the third
            const thirdCenter = third / 2;
            // const halfCenter = half / 2;

            // get width of text and calculate / convert human readable value
            // distance
            const distance = `${(activity.distance / 1609.34).toFixed(2)} mi`;
            const distanceText = 'Distance';
            // const distanceTextWidth = ctx.measureText(distanceText).width;

            // total elev / evel gain
            const totalElevation = `${Math.round(activity.total_elevation_gain * 3.281)} ft`;
            const totalElevationText = 'Elev. Gain';
            // const totalElevationTextWidth = ctx.measureText(totalElevationText).width;

            // pace
            const pace = `${(getPaceTime(activity.moving_time / (activity.distance / 1609.34).toFixed(2)))} /mi`;
            const paceText = 'Pace';
            // const paceTextWidth = ctx.measureText(paceText).width;

            // moving time / duration
            const movingTime = getMovingTime(activity);
            const movingTimeText = 'Duration';
            // const movingTimeTextWidth = ctx.measureText(movingTimeText).width;

            // avg power
            const avgPower = getAvgPower(activity);
            const avgPowerText = 'Avg Power';
            // const avgPowerTextWidth = ctx.measureText(avgPowerText).width;

            // avg speed
            const avgSpeed = getAvgSpeed(activity);
            const avgSpeedText = 'Avg Speed';
            // const avgSpeedTextWidth = ctx.measureText(avgSpeedText).width;

            // work done
            const workDone = getWorkDone(activity);
            const workDoneText = 'Work Done';
            // const workDoneTextWidth = ctx.measureText(workDoneText).width;

            // get matrix positions
            const textMatrix = calculateTextPlacement(distance, totalElevation, pace, movingTime, avgPower, avgSpeed, workDone, distanceText, totalElevationText, paceText, movingTimeText, avgPowerText, avgSpeedText, workDoneText, ctx);

            Object.keys(textMatrix).forEach((key) => {
                const val = textMatrix[key]
                if (val) {
                    if (val.location == 1) {
                        // grid 1
                        // set text font
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter - (val.textWidth / 2), centerY);
    
                        // set value font
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter - (val.valWidth / 2), centerY + 35);
                    }
                    if (val.location == 2) {
                        // grid 2
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter + third - (val.textWidth / 2), centerY);
    
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter + third - (val.valWidth / 2), centerY + 35);
                    }
                    if (val.location == 3) {
                        // grid 3
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter + third + third - (val.textWidth / 2), centerY);
    
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter + third + third - (val.valWidth / 2), centerY + 35);
                    }
    
                    if (val.location == 4) {
                        // grid 4
                        // set text font
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter - (val.textWidth / 2), centerY + 40 + 35);
    
                        // set value font
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter - (val.valWidth / 2), centerY + 40  + 35 + 35);
                    }
    
                    if (val.location == 5) {
                        // grid 5
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter + third - (val.textWidth / 2), centerY + 40 + 35);
    
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter + third - (val.valWidth / 2), centerY + 40  + 35 + 35);
                    }
    
                    if (val.location == 6) {
                        // grid 6
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter + third + third - (val.textWidth / 2), centerY + 40 + 35);
    
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter + third + third - (val.valWidth / 2), centerY + 40 + 35 + 35);
                    }
                }
            })
        });
    }

    const getMovingTime = (activity) => {
        let seconds = activity.moving_time % 60;
        let minutes = Math.round(activity.moving_time / 60);
        let hours = parseInt(minutes / 60);
        let time = `${minutes}m ${seconds}s`;
        if (minutes > 60) {
            minutes = minutes % 60;
            time = `${hours}h ${minutes}m`;
        }
        return time;
    }

    const getPaceTime = (rawPace) => {
        let seconds = (rawPace % 60).toFixed(0);
        let minutes = (rawPace / 60).toFixed(0) - 1;
        let hours = parseInt(minutes / 60);
        let time = `${minutes}:${seconds}`;
        if (minutes > 60) {
            minutes = minutes % 60;
            time = `${hours}:${minutes}:${seconds}`;
        }
        return time;
    }

    const getAvgPower = (activity) => {
        return `${Math.round(activity.average_watts)} w`;
    }

    const getAvgSpeed = (activity) => {
        return `${(activity.average_speed * 2.23694).toFixed(2)} mi/h`;
    }

    const getWorkDone = (activity) => {
        return `${Math.round(activity.kilojoules)} kJ`;
    }

    const findLowestPixel = async (lineColor, canvas) => {
        // const canvas = document.getElementsByTagName('canvas')[0];
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
            }
        }

        const pixelLocation = finalPixel / 4;
        const rowsAbove = pixelLocation / canvas.width;
        return Math.round(rowsAbove);
    }

    const findPixelBounds = async (lineColor, canvas) => {
        // const canvas = document.getElementsByTagName('canvas')[0];
        const ctx = canvas.getContext("2d");
        const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const color = lineColor === 'white' ? {r:255, g:255, b:255, a:255} : {r:0, g:0, b:0, a:255};
        const pix = imgd.data; // array of pixels
        let firstPixel = null;
        let lastPixel = null;
        let leftPixel = null;
        let rightPixel = null;

        for (var i = 0, n = pix.length; i < n; i += 4) {
            var r = pix[i],
                g = pix[i+1],
                b = pix[i+2],
                a = pix[i+3];
            
            if (r == color.r && g == color.g && b == color.b && a == color.a) { 
                const pixelX = (i/4) % canvas.width;
                const pixelY = Math.floor((i / 4) / canvas.width);

                lastPixel = pixelY;

                if (!firstPixel || pixelY < firstPixel) {
                    firstPixel = pixelY;
                }

                if (!leftPixel || pixelX < leftPixel) {
                    leftPixel = pixelX;
                }

                if (!rightPixel || pixelX > rightPixel) {
                    rightPixel = pixelX;
                }
            }
        }

        const pixels = {first: firstPixel, right: rightPixel, left: leftPixel, last: lastPixel};
        return pixels
    }

    const paintBackground = (x, y) => {
        const images = document.getElementById('images');
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100vh';
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