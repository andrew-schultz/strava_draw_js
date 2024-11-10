"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

var polyline = require('@mapbox/polyline');

// import 'leaflet/dist/leaflet.css';

const ActivityDetail = ({activity, setActivity}) => {
    const [polylines, setPolylines] = useState();

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
        downloadLink.setAttribute('download', `${activity.name}_${activity.start_date}.png`);
        let canvas = document.getElementsByTagName('canvas')[0];
        await removeBackground(canvas).then( () => {
            canvas.toBlob(blob => {
                let url = URL.createObjectURL(blob);
                downloadLink.setAttribute('href', url);
                downloadLink.click();
            });
        })
    }

    return (
        <div className="actvityListItem detail" >
            <div className='ActivityListItemDetailTextContainer'>
                <div className="mapButton" onClick={localSetActivity}>back</div>
                <div className="mapButton right" onClick={DownloadCanvasAsImage}>save</div>
                <div className="activityListItemTextBox">
                    <p className="activityListButtonP">Name: {activity.name}</p>
                    <p className="activityListButtonP">Date: {activity.start_date}</p>
                    <p className="activityListButtonP">Distance: {activity.distance / 1609.34}</p>
                </div>
            </div>
            {polylines ? (<MapComponent polylines={polylines}></MapComponent>) : null}
        </div>
    )
};

export default ActivityDetail