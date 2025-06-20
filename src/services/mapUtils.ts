export const calculateTextPlacement = (
    distance, elevationGain, pace, duration, avgPower, avgSpeed, workDone, weightedPower,
    distanceText, totalElevationText, paceText, durationText, avgPowerText, avgSpeedText, workDoneText, weightedPowerText,
    ctx, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, showWeightedPower, placementGrid, layout
) => {
    const keys = {
        showDistance: {
            name: 'distance', 
            isOn: showDistance,
            location: null,
            val: distance,
            valWidth: ctx.measureText(distance).width,
            valHeight: ctx.measureText(distance).fontBoundingBoxDescent,
            text: distanceText,
            labelTextSize: 'med',
            textWidth: ctx.measureText(distanceText).width,
            textHeight: ctx.measureText(distanceText).fontBoundingBoxDescent,
        },
        showElevGain: {
            name: 'elevation_gain', 
            isOn: showElevGain,
            location: null,
            val: elevationGain,
            labelTextSize: 'med',
            valWidth: ctx.measureText(elevationGain).width,
            valHeight: ctx.measureText(elevationGain).fontBoundingBoxDescent,
            text: totalElevationText,
            textWidth: ctx.measureText(totalElevationText).width,
            textHeight: ctx.measureText(totalElevationText).fontBoundingBoxDescent,
        },
        showPace: {
            name: 'pace', 
            isOn: showPace,
            location: null,
            val: pace,
            labelTextSize: 'med',
            valWidth: ctx.measureText(pace).width,
            valHeight: ctx.measureText(pace).fontBoundingBoxDescent,
            text: paceText,
            textWidth: ctx.measureText(paceText).width,
            textHeight: ctx.measureText(paceText).fontBoundingBoxDescent,
        },
        showDuration: {
            name: 'duration', 
            isOn: showDuration,
            location: null,
            val: duration,
            labelTextSize: 'med',
            valWidth: ctx.measureText(duration).width,
            valHeight: ctx.measureText(duration).fontBoundingBoxDescent,
            text: durationText,
            textWidth: ctx.measureText(durationText).width,
            textHeight: ctx.measureText(durationText).fontBoundingBoxDescent,
        },
        showAvgPower: {
            name: 'avg_power', 
            isOn: showAvgPower,
            location: null,
            val: avgPower,
            labelTextSize: 'med',
            valWidth: ctx.measureText(avgPower).width,
            valHeight: ctx.measureText(avgPower).fontBoundingBoxDescent,
            text: avgPowerText,
            textWidth: ctx.measureText(avgPowerText).width,
            textHeight: ctx.measureText(avgPowerText).fontBoundingBoxDescent,
        },
        showAvgSpeed: {
            name: 'avg_speed', 
            isOn: showAvgSpeed,
            location: null,
            val: avgSpeed,
            labelTextSize: 'med',
            valWidth: ctx.measureText(avgSpeed).width,
            valHeight: ctx.measureText(avgSpeed).fontBoundingBoxDescent,
            text: avgSpeedText,
            textWidth: ctx.measureText(avgSpeedText).width,
            textHeight: ctx.measureText(avgSpeedText).fontBoundingBoxDescent,
        },
        showWorkDone: {
            name: 'work_done', 
            isOn: showWorkDone,
            location: null,
            val: workDone,
            labelTextSize: 'med',
            valWidth: ctx.measureText(workDone).width,
            valHeight: ctx.measureText(workDone).fontBoundingBoxDescent,
            text: workDoneText,
            textWidth: ctx.measureText(workDoneText).width,
            textHeight: ctx.measureText(workDoneText).fontBoundingBoxDescent,
        },
        showWeightedPower: {
            name: 'weighted_avg_power', 
            isOn: showWeightedPower,
            location: null,
            val: weightedPower,
            labelTextSize: 'med',
            valWidth: ctx.measureText(weightedPower).width,
            valHeight: ctx.measureText(weightedPower).fontBoundingBoxDescent,
            text: weightedPowerText,
            textWidth: ctx.measureText(weightedPowerText).width,
            textHeight: ctx.measureText(weightedPowerText).fontBoundingBoxDescent,
        },
    };

    // const onGrid = {
    //     1: null,
    //     2: null,
    //     3: null,
    //     4: null,
    //     5: null,
    //     6: null,
    // }

    // Object.keys(placementGrid).forEach((id) => {
    //     if (placementGrid[id].val) {
    //         keys[placementGrid[id].val.field].location = id;
    //         onGrid[id] = keys[placementGrid[id].val.field];
    //     }
    // })
    const onGrid = populateGrid(placementGrid, keys, layout)
    return onGrid
}

const populateGrid = (placementGrid, keys, layout) => {
    const onGrid = {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
    }
    
    if (layout == 1) {
        Object.keys(placementGrid).forEach((id) => {
            if (placementGrid[id].val) {
                keys[placementGrid[id].val.field].location = id;
                onGrid[id] = keys[placementGrid[id].val.field];
            }
        })
    }
    else {
        let currId = 1
        Object.keys(placementGrid).forEach((id) => {
            if (placementGrid[id].val) {
                keys[placementGrid[id].val.field].location = currId;
                onGrid[currId] = keys[placementGrid[id].val.field];
                currId += 1
            }
        })
    }

    return onGrid
}

const getLabelFontSize = (size) => {
    if (size === 'xsmall') {
        return '12pt'
    }
    if (size === 'small') {
        return '13pt'
    }
    else if (size === 'med') {
        return '1.75em'
    }
    else if (size == 'large') {
        return '2.1em'
    }
}

const getLabelFontSizeCalc = (size, vSize, textAreaSize) => {
    if (size === 'xsmall') {
        return '12pt'
    }
    if (size === 'small') {
        return '13pt'
    }
    else if (size === 'med') {
        return '1.75em'
    }
    else if (size == 'large') {
        if (vSize / textAreaSize > 0.8) {
            return '1.9em'
        }
        return '2.1em'
    }
}

export const generateText = async (bounds, canvas, lineColor, hadToAdjust, mapRef, activity, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, showWeightedPower, placementGrid, useMiles) => {
    await findLowestPixel(lineColor, canvas).then((lowestPixel) => {
        const ctx = canvas.getContext("2d");
        ctx.font = "bold 16pt Arial";
        ctx.fillStyle = lineColor;
        ctx.globalAlpha = 1.0

        // get width/height of map canvas
        let dimensions = mapRef.current.getSize();
        if (hadToAdjust) {
            dimensions = {x: canvas.width, y: canvas.height};
        }

        // get canvas width / 3
        let centerY = (lowestPixel / 2) - 25;
        let third = (dimensions.x) / 3;

        if (hadToAdjust) {
            centerY = lowestPixel + 50;
        }
        // const third = (dimensions.x + 100) / 3;
        const half = dimensions.x / 2;
        
        // get half of the value of above, thats the half way point of the third
        const thirdCenter = third / 2;
        // const halfCenter = half / 2;

        let distance, totalElevation, pace;
        const distanceText = 'Distance';
        const totalElevationText = 'Elev. Gain';
        const paceText = 'Pace';


        if (useMiles) {
            // get width of text and calculate / convert human readable value
            // distance
            distance = `${(activity.distance / 1609.34).toFixed(2)} mi`;
            // const distanceTextWidth = ctx.measureText(distanceText).width;

            // total elev / evel gain
            totalElevation = `${Math.round(activity.elev_gain * 3.281)} ft`;
            // const totalElevationTextWidth = ctx.measureText(totalElevationText).width;

            // pace
            const paceVal = activity.duration / (activity.distance / 1609.34);
            pace = `${(getPaceTime(paceVal.toFixed(2)))} /mi`;
            // const paceTextWidth = ctx.measureText(paceText).width;
        } else {
            distance = `${(activity.distance / 1000).toFixed(2)} km`;
            totalElevation = `${Math.round(activity.elev_gain)} m`;
            const paceVal = activity.duration / (activity.distance / 1000);
            pace = `${(getPaceTime(paceVal.toFixed(2)))} /km`;
        }

        // moving time / duration
        const movingTime = getMovingTime(activity);
        const movingTimeText = 'Duration';
        // const movingTimeTextWidth = ctx.measureText(movingTimeText).width;

        // avg power
        const avgPower = getAvgPower(activity);
        const avgPowerText = 'Avg Power';
        // const avgPowerTextWidth = ctx.measureText(avgPowerText).width;

        // weighted power
        const weightedPower = getWeightedPower(activity);
        const weightedPowerText = 'W Avg Pwr';
        // const weightedPowerText = 'Weighted Power';

        // avg speed
        const avgSpeed = getAvgSpeed(activity, useMiles);
        const avgSpeedText = 'Avg Speed';
        // const avgSpeedTextWidth = ctx.measureText(avgSpeedText).width;

        // work done
        const workDone = getWorkDone(activity);
        const workDoneText = 'Work Done';
        // const workDoneTextWidth = ctx.measureText(workDoneText).width;

        // get matrix positions
        const layout = 1
        const textMatrix = calculateTextPlacement(distance, totalElevation, pace, movingTime, avgPower, avgSpeed, workDone, weightedPower, distanceText, totalElevationText, paceText, movingTimeText, avgPowerText, avgSpeedText, workDoneText, weightedPowerText, ctx, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, showWeightedPower, placementGrid, layout);

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

export const generateText2 = async (xModifier, yModifier, canvas, lineColor, mapRef, activity, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, showWeightedPower, placementGrid, useMiles) => {
    await findLowestPixel(lineColor, canvas).then((lowestPixel) => {
        const ctx = canvas.getContext("2d");
        ctx.font = "bold 16pt Arial";
        ctx.fillStyle = lineColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        // get width/height of map canvas
        let dimensions = mapRef.current.getSize();

        // use the modifiers from the graphBorder to determine textBoxDimensions
        const textBoxDimensions = {x: dimensions.x - (dimensions.x * (1.0 - xModifier)), y: dimensions.y * (1.0 - yModifier)}

        // get canvas width / 3
        // let centerY = (lowestPixel / 2);
        let third = (textBoxDimensions.x) / 3;

        // const third = (textBoxDimensions.x + 100) / 3;
        const half = textBoxDimensions.x / 2;
        
        // get half of the value of above, thats the half way point of the third
        const thirdCenter = third / 2;
        const halfCenter = dimensions.x - (dimensions.x * (1.0 - xModifier) / 2)

        // count the number of selected / on stats
        // divide the height by the count

        let distance, totalElevation, pace;
        const distanceText = 'Distance';
        const totalElevationText = 'Elev. Gain';
        const paceText = 'Pace';


        if (useMiles) {
            // get width of text and calculate / convert human readable value
            // distance
            distance = `${(activity.distance / 1609.34).toFixed(2)} mi`;
            // const distanceTextWidth = ctx.measureText(distanceText).width;

            // total elev / evel gain
            totalElevation = `${Math.round(activity.elev_gain * 3.281)} ft`;
            // const totalElevationTextWidth = ctx.measureText(totalElevationText).width;

            // pace
            const paceVal = activity.duration / (activity.distance / 1609.34);
            pace = `${(getPaceTime(paceVal.toFixed(2)))} /mi`;
            // const paceTextWidth = ctx.measureText(paceText).width;
        } else {
            distance = `${(activity.distance / 1000).toFixed(2)} km`;
            totalElevation = `${Math.round(activity.elev_gain)} m`;
            const paceVal = activity.duration / (activity.distance / 1000);
            pace = `${(getPaceTime(paceVal.toFixed(2)))} /km`;
        }

        // moving time / duration
        const movingTime = getMovingTime(activity);
        const movingTimeText = 'Duration';
        // const movingTimeTextWidth = ctx.measureText(movingTimeText).width;

        // avg power
        const avgPower = getAvgPower(activity);
        const avgPowerText = 'Avg Power';
        // const avgPowerTextWidth = ctx.measureText(avgPowerText).width;

        // weighted power
        const weightedPower = getWeightedPower(activity);
        const weightedPowerText = 'W Avg Pwr';
        // const weightedPowerText = 'Weighted Power';

        // avg speed
        const avgSpeed = getAvgSpeed(activity, useMiles);
        const avgSpeedText = 'Avg Speed';
        // const avgSpeedTextWidth = ctx.measureText(avgSpeedText).width;

        // work done
        const workDone = getWorkDone(activity);
        const workDoneText = 'Work Done';
        // const workDoneTextWidth = ctx.measureText(workDoneText).width;

        // get matrix positions
        const layout = 2
        const textMatrix = calculateTextPlacement(distance, totalElevation, pace, movingTime, avgPower, avgSpeed, workDone, weightedPower, distanceText, totalElevationText, paceText, movingTimeText, avgPowerText, avgSpeedText, workDoneText, weightedPowerText, ctx, showDistance, showElevGain, showPace, showDuration, showAvgPower, showAvgSpeed, showWorkDone, showWeightedPower, placementGrid, layout);
        
        let count = 0;
        Object.keys(textMatrix).forEach((key) => {
            if (textMatrix[key] && textMatrix[key].isOn) {
                count += 1
            }
        })

        const textYSize = (dimensions.y - (dimensions.y * (1.0 - yModifier))) / count;

        // calculate the width of the text column, compare with the calculated width of the val, make it smaller if you gotta
        const textBoxWidth = (dimensions.x * (1.0 - xModifier))

        Object.keys(textMatrix).forEach((key) => {
            const val = textMatrix[key]

            if (val) {
                if (val.location == 1) {
                    // grid 1
                    // set text font
                    ctx.font = `bold ${getLabelFontSize(val.labelTextSize)} Arial`;
                    ctx.fillText(val.text, halfCenter, verticalTextHeightCalc(val, textYSize));

                    // set value font
                    ctx.font = `bold ${getLabelFontSizeCalc('large', val.valWidth, textBoxWidth)} Arial`;
                    ctx.fillText(val.val, halfCenter, verticalValHeightCalc(val, textYSize));
                }
                if (val.location == 2) {
                    // grid 2
                    ctx.font = `bold ${getLabelFontSize(val.labelTextSize)} Arial`;
                    ctx.fillText(val.text, halfCenter, verticalTextHeightCalc(val, textYSize));

                    ctx.font = `bold ${getLabelFontSizeCalc('large', val.valWidth, textBoxWidth)} Arial`;
                    ctx.fillText(val.val, halfCenter, verticalValHeightCalc(val, textYSize));
                }
                if (val.location == 3) {
                    // grid 3
                    ctx.font = `bold ${getLabelFontSize(val.labelTextSize)} Arial`;
                    ctx.fillText(val.text, halfCenter, verticalTextHeightCalc(val, textYSize));

                    ctx.font = `bold ${getLabelFontSizeCalc('large', val.valWidth, textBoxWidth)} Arial`;
                    ctx.fillText(val.val, halfCenter, verticalValHeightCalc(val, textYSize));
                }

                if (val.location == 4) {
                    // grid 4
                    // set text font
                    console.log(val.textHeight)
                    ctx.font = `bold ${getLabelFontSize(val.labelTextSize)} Arial`;
                    ctx.fillText(val.text, halfCenter, verticalTextHeightCalc(val, textYSize));

                    // set value font
                    ctx.font = `bold ${getLabelFontSizeCalc('large', val.valWidth, textBoxWidth)} Arial`;
                    ctx.fillText(val.val, halfCenter, verticalValHeightCalc(val, textYSize));
                }

                if (val.location == 5) {
                    // grid 5
                    ctx.font = `bold ${getLabelFontSize(val.labelTextSize)} Arial`;
                    ctx.fillText(val.text, halfCenter, verticalTextHeightCalc(val, textYSize));

                    ctx.font = `bold ${getLabelFontSizeCalc('large', val.valWidth, textBoxWidth)} Arial`;
                    ctx.fillText(val.val, halfCenter, verticalValHeightCalc(val, textYSize));
                }

                if (val.location == 6) {
                    // grid 6
                    ctx.font = `bold ${getLabelFontSize(val.labelTextSize)} Arial`;
                    ctx.fillText(val.text, halfCenter, verticalTextHeightCalc(val, textYSize));

                    ctx.font = `bold ${getLabelFontSizeCalc('large', val.valWidth, textBoxWidth)} Arial`;
                    ctx.fillText(val.val, halfCenter, verticalValHeightCalc(val, textYSize));
                }
            }
        })
    });
}

const verticalTextHeightCalc = (val, textYSize) => {
    return (val.location * (textYSize)) - (textYSize/2) - val.textHeight
}

const verticalValHeightCalc = (val, textYSize) => {
    return (val.location * (textYSize ))- (textYSize/2)
}

export const getMovingTime = (activity) => {
    let seconds = activity.duration % 60;
    let minutes = Math.round(activity.duration / 60);
    let hourCalc = minutes / 60
    let hours = Math.floor(hourCalc);
    let time = `${minutes}m ${seconds}s`;
    if (minutes > 60) {
        minutes = minutes % 60;
        time = `${hours}h ${minutes}m`;
    }
    return time;
}

export const getPaceTime = (rawPace) => {
    let seconds = (rawPace % 60).toFixed(0);
    if (parseInt(seconds) < 10) {
        seconds = `0${seconds}`
    }
    let minutes = Math.round((rawPace / 60) - 1.0);
    let hours = Math.floor(minutes / 60);
    let time = `${minutes}:${seconds}`;
    if (minutes > 60) {
        minutes = minutes % 60;
        time = `${hours}:${minutes}:${seconds}`;
    }
    return time;
}

export const getAvgPower = (activity) => {
    return `${Math.round(activity.avg_watts)} w`;
}

export const getWeightedPower = (activity) => {
    return `${Math.round(activity.weighted_average_watts)} w`;
}

export const getAvgSpeed = (activity, useMiles=true) => {
    if (useMiles) {
        return `${(activity.avg_speed * 2.23694).toFixed(1)} mi/h`;
    } else {
        return `${(activity.avg_speed * 3.6).toFixed(1)} km/h`;
    }
}

export const getWorkDone = (activity) => {
    return `${Math.round(activity.work_done)} kJ`;
}

export const findLowestPixel = async (lineColor, canvas) => {
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

export const findPixelBounds = async (lineColor, canvas) => {
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

export const removeBackground = async (canvas) => {
    var ctx = canvas.getContext("2d")

    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height),
        pix = imgd.data,
        newColor = {r:0, g:0, b:0, a:255};

    for (var i = 0, n = pix.length; i < n; i += 4) {
        var r = pix[i],
            g = pix[i+1],
            b = pix[i+2];

        // If its white then change it
        if (r >= 50 && g >= 50 && b >= 50) { 
            // Change the white to whatever.
            pix[i] = newColor.r;
            pix[i+1] = newColor.g;
            pix[i+2] = newColor.b;
            pix[i+3] = newColor.a;
        }
    }

    ctx.putImageData(imgd, 0, 0);
    return ctx
}

export const paintBackground = (x, y) => {
    const images = document.getElementById('images');
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    images.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#dddddd";
    ctx.fillRect(0, 0, x, y);
}