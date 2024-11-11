"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

var polyline = require('@mapbox/polyline');

// import 'leaflet/dist/leaflet.css';

const ActivityDetail = ({activity, setActivity}) => {
    const [polylines, setPolylines] = useState();
    const [lineColor, setLineColor] = useState('white');
    const [rawLineColor, setRawLine] = useState('1');

    useEffect(() => {
        let polylines = activity.map.summary_polyline;
        let decoded_polylines = polyline.decode(polylines);
        setPolylines(decoded_polylines)
    }, [])

    const MapComponent = dynamic(() => import('./LeafletMap'), {
        ssr: false,
    });

    const localSetActivity = () => {
        setActivity(null)
    }

    const removeBackground = async (canvas) => {
        var ctx = canvas.getContext("2d")

        var imgd = ctx.getImageData(0, 0, 135, 135),
            pix = imgd.data,
            newColor = {r:0, g:0, b:0, a:0};

        for (var i = 0, n = pix.length; i <n; i += 4) {
            var r = pix[i],
                g = pix[i+1],
                b = pix[i+2];

            // If its white then change it
            if (r == 221 && g == 221 && b == 221) { 
                // Change the white to whatever.
                pix[i] = newColor.r;
                pix[i+1] = newColor.g;
                pix[i+2] = newColor.b;
                pix[i+3] = newColor.a;
            }
        }

        
        ctx.putImageData(imgd, 0, 0);
        // return imgd
    }

    const DownloadCanvasAsImage = async () => {
        let downloadLink = document.createElement('a');
        let canvas = document.getElementsByTagName('canvas')[0];

        await removeBackground(canvas).then( () => {
            var dataURL = canvas.toDataURL("image/png");

            // Create an image element
            const image = new Image();

            // Assign the canvas content as the source of the image
            image.src = dataURL;

            // Create a temporary link element to download the image
            downloadLink.setAttribute("href", image.src);
            downloadLink.setAttribute('download', `${activity.name}_${activity.start_date}.png`);

            // Trigger the link programmatically to start the download
            downloadLink.click();
        })
    }

    const handleSetColor = (e) => {
        const rawVal = e.target.value;
        setRawLine(rawVal)

        if (rawVal == '1') {
            setLineColor('white')
        } else if (rawVal == '2') {
            setLineColor('black')
        }
    }

    return (
        <div className="actvityListItem detail" >
            <div className='ActivityListItemDetailTextContainer' id='ActivityListItemDetailTextContainer'>
                <div className='controlContainer'>
                    <div className="mapButton" onClick={localSetActivity}>back</div>
                    <div class="sliderContainer">
                        <input type="range" min="1" max="2" value={rawLineColor} className={'slider ' + lineColor} id="lineColorSelector" onChange={(e) => handleSetColor(e)}></input>
                    </div>
                    <div className="mapButton right" onClick={DownloadCanvasAsImage}>save</div>
                </div>
                <div className="activityListItemTextBox">
                    <p className="activityListButtonP">Name: {activity.name}</p>
                    <p className="activityListButtonP">Date: {activity.start_date}</p>
                    <p className="activityListButtonP">Distance: {activity.distance / 1609.34}</p>
                </div>
            </div>
            {polylines ? (<MapComponent polylines={polylines} lineColor={lineColor}></MapComponent>) : null}
        </div>
    )
};

export default ActivityDetail