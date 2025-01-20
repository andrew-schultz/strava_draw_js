"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useRef } from 'react';
import Spinner from "./Spinner"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { on } from "events";

const MapComponent = ({
    polylines, 
    lineColor, 
    showText, 
    activity,
    showDistance,
    showDuration,
    showElevGain,
    showPace,
    showAvgPower,
    showAvgSpeed,
    showCalories,
}) => {
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

    const calculateTextPlacement = (
        gridMatrix, 
        distance, elevationGain, pace, duration, avgPower, avgSpeed, calories,
        distanceText, totalElevationText, paceText, durationText, avgPowerText, avgSpeedText, caloriesText,
        ctx,
    ) => {
        const onList = [];
        const keys = [
            {
                name: 'distance', 
                isOn: showDistance,
                location: null,
                val: distance,
                valWidth: ctx.measureText(distance).width,
                text: distanceText,
                textWidth: ctx.measureText(distanceText).width,
            },
            {
                name: 'elevation_gain', 
                isOn: showElevGain,
                location: null,
                val: elevationGain,
                valWidth: ctx.measureText(elevationGain).width,
                text: totalElevationText,
                textWidth: ctx.measureText(totalElevationText).width,
            },
            {
                name: 'pace', 
                isOn: showPace,
                location: null,
                val: pace,
                valWidth: ctx.measureText(pace).width,
                text: paceText,
                textWidth: ctx.measureText(paceText).width,
            },
            {
                name: 'duration', 
                isOn: showDuration,
                location: null,
                val: duration,
                valWidth: ctx.measureText(duration).width,
                text: durationText,
                textWidth: ctx.measureText(durationText).width,
            },
            {
                name: 'avg_power', 
                isOn: showAvgPower,
                location: null,
                val: avgPower,
                valWidth: ctx.measureText(avgPower).width,
                text: avgPowerText,
                textWidth: ctx.measureText(avgPowerText).width,
            },
            {
                name: 'avg_speed', 
                isOn: showAvgSpeed,
                location: null,
                val: avgSpeed,
                valWidth: ctx.measureText(avgSpeed).width,
                text: avgSpeedText,
                textWidth: ctx.measureText(avgSpeedText).width,
            },
            {
                name: 'calories', 
                isOn: showCalories,
                location: null,
                val: calories,
                valWidth: ctx.measureText(calories).width,
                text: caloriesText,
                textWidth: ctx.measureText(caloriesText).width,
            },
        ]

        let locCounter = 1;
        keys.forEach((key, index) => {
            console.log('index', index + 1)
            if (key.isOn) {
                // debugger
                key.location = locCounter;
                locCounter += 1;
                onList.push(key)
            }
        })

        if (onList.length == 1) {
            onList[0].location = 2
        }

        if (onList.length == 2) {
            onList[1].location = 3
        }

        if (onList.length == 4) {
            onList[3].location = 5
        }

        if (onList.length == 5) {
            onList[4].location = 6
        }

        if (onList.length == 7) {
            console.log('panic')
        }

        const onGrid = {
            1: onList[0] ? onList[0] : null,
            2: onList[1] ? onList[1] : null,
            3: onList[2] ? onList[2] : null,
            4: onList[3] ? onList[3] : null,
            5: onList[4] ? onList[4] : null,
            6: onList[5] ? onList[5] : null,
        }

        return onGrid
    }

    const generateText = async (bounds, canvas, lineColor) => {

        // ok now we need to add labels and calculations for the new fields
        // then we need to dynamically calculate how they should be shown
        //      2 rows of 3 across maybe?
        //      stravas is 3 rows of 2 across, so maybe we don't do that 
        // if only 1 is enabled, put it in the middle
        // if 2 are enabled, put them on the sides (nothing in the middle) but keep the 3 across grid
        //      could also just split the full width in 2 (50/50)
        // if 4 enabled, 3 across and then 1 in the middle on the second row
        // if 5 enabled, 3 across the top and 2 on the sides on the second row (nothing in the middle)


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
            // calculate / convert human readable value
            // distance
            const distance = `${(activity.distance / 1609.34).toFixed(2)} mi`;
            const distanceText = 'Distance';
            const distanceTextWidth = ctx.measureText(distanceText).width;

            // total elev / evel gain
            const totalElevation = `${Math.round(activity.total_elevation_gain * 3.281)} ft`;
            const totalElevationText = 'Elev. Gain';
            const totalElevationTextWidth = ctx.measureText(totalElevationText).width;

            // pace
            const pace = `${(getPaceTime(activity.moving_time / (activity.distance / 1609.34).toFixed(2)))} /mi`;
            const paceText = 'Pace';
            const paceTextWidth = ctx.measureText(paceText).width;

            // moving time / duration
            const movingTime = getMovingTime(activity);
            const movingTimeText = 'Duration';
            const movingTimeTextWidth = ctx.measureText(movingTimeText).width;

            // avg power
            const avgPower = getAvgPower(activity);
            const avgPowerText = 'Avg Power';
            const avgPowerTextWidth = ctx.measureText(avgPowerText).width;

            // avg speed
            const avgSpeed = getAvgSpeed(activity);
            const avgSpeedText = 'Avg Speed';
            const avgSpeedTextWidth = ctx.measureText(avgSpeedText).width;

            // calories
            const calories = getCalories(activity);
            const caloriesText = 'Calories';
            const caloriesTextWidth = ctx.measureText(caloriesText).width;


            // get matrix positions
            const gridMatrix = [
                [
                    [
                        {
                            x: thirdCenter - (distanceTextWidth / 2),
                            y: centerY,
                            location: 1,
                        },
                        {
                            x: thirdCenter + third - (totalElevationTextWidth / 2),
                            y: centerY,
                            location: 2

                        },
                        {
                            x: thirdCenter + third + third - (movingTimeTextWidth / 2),
                            y: centerY,
                            location: 3
                        },
                    ],
                    [
                        {
                            x: thirdCenter - (distanceTextWidth / 2),
                            y: centerY + 35,
                            location: 1
                        },
                        {
                            x: thirdCenter + third - (totalElevationTextWidth / 2),
                            y: centerY + 35,
                            location: 2
                        },
                        {
                            x: thirdCenter + third + third - (movingTimeTextWidth / 2),
                            y: centerY + 35,
                            location: 3
                        },
                    ]
                ],
                [
                    [
                        {
                            x: thirdCenter - (distanceTextWidth / 2),
                            y: centerY + 35 + 35,
                            location: 4
                        },
                        {
                            x: thirdCenter + third - (totalElevationTextWidth / 2),
                            y: centerY + 35 + 35,
                            location: 5
                        },
                        {
                            x: thirdCenter + third + third - (movingTimeTextWidth / 2),
                            y: centerY + 35 + 35,
                            location: 6
                        },
                    ],
                    [
                        {
                            x: thirdCenter - (distanceTextWidth / 2),
                            y: centerY + 35 + 35 + 35,
                            location: 4
                        },
                        {
                            x: thirdCenter + third - (totalElevationTextWidth / 2),
                            y: centerY + 35 + 35 + 35,
                            location: 5
                        },
                        {
                            x: thirdCenter + third + third - (movingTimeTextWidth / 2),
                            y: centerY + 35 + 35 + 35,
                            location: 6
                        },
                    ]
                ]
            ]
            const textMatrix = calculateTextPlacement(gridMatrix, distance, totalElevation, pace, movingTime, avgPower, avgSpeed, calories, distanceText, totalElevationText, paceText, movingTimeText, avgPowerText, avgSpeedText, caloriesText, ctx);
            // set text font
            // ctx.font = "bold 16pt Arial";

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
                        ctx.fillText(val.text, thirdCenter - (val.textWidth / 2), centerY + 35 + 35);
    
                        // set value font
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter - (val.valWidth / 2), centerY + 35  + 35 + 35);
                    }
    
                    if (val.location == 5) {
                        // grid 5
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter + third - (val.textWidth / 2), centerY + 35 + 35);
    
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter + third - (val.valWidth / 2), centerY + 35  + 35 + 35);
                    }
    
                    if (val.location == 6) {
                        // grid 6
                        ctx.font = "bold 16pt Arial";
                        ctx.fillText(val.text, thirdCenter + third + third - (val.textWidth / 2), centerY + 35 + 35);
    
                        ctx.font = "bold 20pt Arial";
                        ctx.fillText(val.val, thirdCenter + third + third - (val.valWidth / 2), centerY + 35 + 35 + 35);
                    }
                }
                
            })
            

            // set text start point at text width / 2
            // distance = 0
            // if (showDistance) {
            //     ctx.fillText(distanceText, thirdCenter - (distanceTextWidth / 2), centerY);
            // }
            // ctx.fillText(distanceText, thirdCenter - (distanceTextWidth / 2), centerY);
            
            // -----------
            // pace / total_elevation_gain = third

            // if (showElevGain) {
            //     ctx.fillText(totalElevationText, thirdCenter + third - (totalElevationTextWidth / 2), centerY);
            // }

            // if (showPace) {
            //     ctx.fillText(paceText, thirdCenter + third - (paceTextWidth / 2), centerY);
            // }

            // if (activity.type == 'Run') {
            //     ctx.fillText(paceText, thirdCenter + third - (paceTextWidth / 2), centerY);
            // } else {
            //     ctx.fillText(totalElevationText, thirdCenter + third - (totalElevationTextWidth / 2), centerY);
            // }

            // -----------
            // moving_time = third + third

            // if (showDuration) {
            //     ctx.fillText(movingTimeText, thirdCenter + third + third - (movingTimeTextWidth / 2), centerY);
            // }
            // ctx.fillText(movingTimeText, thirdCenter + third + third - (movingTimeTextWidth / 2), centerY);


            // set value font
            // ctx.font = "bold 20pt Arial";

            // -----------
            // Distance Value 

            // const distanceWidth = ctx.measureText(distance).width;
            // ctx.fillText(distance, thirdCenter - (distanceWidth / 2), centerY + 35);

            // if (showDistance) {
            //     const distanceWidth = ctx.measureText(distance).width;
            //     ctx.fillText(distance, thirdCenter - (distanceWidth / 2), centerY + 35);
            // }

            // -----------
            // Pace / Elev Gain Value

            // if (activity.type == 'Run') {
            //     const paceWidth = ctx.measureText(pace).width;
            //     ctx.fillText(pace, thirdCenter + third - (paceWidth / 2), centerY + 35);
            // } else {
            //     const totalElevationWidth = ctx.measureText(totalElevation).width;
            //     ctx.fillText(totalElevation, thirdCenter + third - (totalElevationWidth / 2), centerY + 35);
            // }

            // if (showPace) {
            //     const paceWidth = ctx.measureText(pace).width;
            //     ctx.fillText(pace, thirdCenter + third - (paceWidth / 2), centerY + 35);
            // }

            // if (showElevGain) {
            //     const totalElevationWidth = ctx.measureText(totalElevation).width;
            //     ctx.fillText(totalElevation, thirdCenter + third - (totalElevationWidth / 2), centerY + 35);
            // }

            // -----------
            // Moving Time (Duration) Value

            // if (showDuration) {
            //     const movingTimeWidth = ctx.measureText(movingTime).width;
            //     ctx.fillText(`${movingTime}`, thirdCenter + third + third - (movingTimeWidth / 2), centerY + 35);
            // }
            // const movingTimeWidth = ctx.measureText(movingTime).width;
            // ctx.fillText(`${movingTime}`, thirdCenter + third + third - (movingTimeWidth / 2), centerY + 35);
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

    const getAvgPower = () => {

    }

    const getAvgSpeed = () => {

    }

    const getCalories = () => {

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