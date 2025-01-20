"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import Link from "next/link";
import dynamic from 'next/dynamic';
import HelpModal from "./HelpModal";
import TextOptionsModal from './TextOptionsModal';

var polyline = require('@mapbox/polyline');

const ActivityDetail = ({activity, setActivity}) => {
    // let textOptionObj = {
    //     'distance': true,
    //     'elevationGain': true,
    //     'duration': true,
    //     'pace': false, 
    //     'averagePower': false,
    //     'averageSpeed': false,
    //     'calories': false,
    // };

    const [polylines, setPolylines] = useState();
    const [lineColor, setLineColor] = useState('white');
    const [rawLineColor, setRawLine] = useState('1');
    const [showText, setShowText] = useState(true);
    const [rawShowText, setRawShowText] = useState('2');
    // const [textOptions, setTextOptions] = useState(textOptionObj);
    const date = new Date(activity.start_date).toLocaleString();
    const [showDistance, setShowDistance] = useState(true);
    const [showElevGain, setShowElevGain] = useState(activity.type.includes('Ride'));
    const [showDuration, setShowDuration] = useState(true);
    const [showPace, setShowPace] = useState(activity.type == 'Run');
    const [showAvgPower, setShowAvgPower] = useState(false);
    const [showAvgSpeed, setShowAvgSpeed] = useState(false);
    const [showWorkDone, setShowWorkDone] = useState(false);
    // const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const router = useRouter();

    useEffect(() => {
        let polylines = activity.map.summary_polyline;
        let decoded_polylines = polyline.decode(polylines);
        // setTextOptions(textOptionObj)
        setPolylines(decoded_polylines)
    }, [])

    const MapComponent = dynamic(() => import('./LeafletMap'), {
        ssr: false,
    });

    const localSetActivity = () => {
        router.back();
    }

    const removeBackground = async (canvas) => {
        var ctx = canvas.getContext("2d")

        var imgd = ctx.getImageData(0, 0, 135, 135),
            pix = imgd.data,
            newColor = {r:0, g:0, b:0, a:0};

        for (var i = 0, n = pix.length; i < n; i += 4) {
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

    const handleShowText = (e) => {
        const rawVal = e.target.value;
        setRawShowText(rawVal)
        if (rawVal == '1') {
            setShowText(false)
        } else if (rawVal == '2') {
            setShowText(true)
        }
    }

    // const handleToggleTextField = (e, field) => {
    //     const rawVal = e.target.value;
    //     const newTextOptions = textOptions;
    //     if (rawVal === '1') {
    //         newTextOptions[field] = false
    //         setTextOptions(newTextOptions)
    //     } else if (rawVal === '2') {
    //         newTextOptions[field] = true
    //         setTextOptions(newTextOptions)
    //     }
    //     console.log(newTextOptions)
    // }

    return (
        <div className="actvityListItem detail" >
            <div className='ActivityListItemDetailTextContainer' id='ActivityListItemDetailTextContainer'>
                <div className='controlContainer'>
                    <div className="mapButton" onClick={localSetActivity}>back</div>
                    {/* <div className="slidersContainer">
                        <div class="sliderContainer">
                            <input type="range" min="1" max="2" value={rawLineColor} className={'slider ' + lineColor} id="lineColorSelector" onChange={(e) => handleSetColor(e)}></input>
                        </div>
                        <div class="sliderContainer">
                            <input type="range" min="1" max="2" value={rawShowText} className={`slider ${showText ? ('on') : ('off')}`} id="showTextSelector" onChange={(e) => handleShowText(e)}></input>
                        </div>
                    </div> */}
                    <div className='buttonsContainer'>
                        <TextOptionsModal 
                            showDistance={showDistance}
                            handleShowDistance={setShowDistance}
                            showDuration={showDuration}
                            handleShowDuration={setShowDuration}
                            showElevGain={showElevGain}
                            handleShowElevGain={setShowElevGain}
                            showPace={showPace}
                            handleShowPace={setShowPace}
                            showAvgPower={showAvgPower}
                            handleShowAvgPower={setShowAvgPower}
                            showAvgSpeed={showAvgSpeed}
                            handleShowAvgSpeed={setShowAvgSpeed}
                            showWorkDone={showWorkDone}
                            handleShowWorkDone={setShowWorkDone}
                            lineColor={lineColor}
                            rawLineColor={rawLineColor}
                            handleSetColor={handleSetColor}
                            showText={showText}
                            rawShowText={rawShowText}
                            handleShowText={handleShowText}
                            activity={activity}
                        ></TextOptionsModal>
                        {/* <HelpModal></HelpModal> */}
                    </div>
                </div>
                <div className="activityListItemTextBox">
                    <p className="activityListButtonP">Name: {activity.name}</p>
                    <p className="activityListButtonP">Date: {date}</p>
                    <p className="activityListButtonP">Distance: {`${(activity.distance / 1609.34).toFixed(2)} mi`}</p>
                </div>
            </div>
            
            {polylines ? (
                <MapComponent 
                    polylines={polylines} 
                    lineColor={lineColor} 
                    showText={showText} 
                    activity={activity}
                    showDistance={showDistance}
                    showDuration={showDuration}
                    showElevGain={showElevGain}
                    showPace={showPace}
                    showAvgPower={showAvgPower}
                    showAvgSpeed={showAvgSpeed}
                    showWorkDone={showWorkDone}
                >
                </MapComponent>) : null}
        </div>
    )
};

export default ActivityDetail