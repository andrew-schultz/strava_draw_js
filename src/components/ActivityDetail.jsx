"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import HelpModal from "./HelpModal";
import TextOptionsModal from './TextOptionsModal';
import { useTextGridProvider } from '../providers/TextGridProvider';
// import cookieCutter from "@boiseitguru/cookie-cutter";
import { formatStrDate } from '../services/utils';
import { getApiActivityStreams } from '../services/api';
import { useAuthProvider } from '../providers/AuthProvider';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';
import Spinner from './Spinner';
import MapWrapper from './MapWrapper';
// import AreaPlot from './AreaPlot';
// import LinePlot from './LinePlot';
// import BarPlot from './BarPlot';

var polyline = require('@mapbox/polyline');

// const ActivityDetail = ({activity, setActivity, layout, setLayout}) => {
const ActivityDetail = ({activity, setActivity, }) => {

    // const [layout, setLayout] = useState('1')
    const {
        apiToken,
    } = useAuthProvider();

    const {
        activityStreams,
        setActivityStreams,
        layout,
        loading,
        setLoading,
    } = useActivitiesProvider()

    const gridBase = {
        1: {
            position: 1,
            val: null,
        },
        2: {
            position: 2,
            val: null,
        },
        3: {
            position: 3,
            val: null,
        },
        4: {
            position: 4,
            val: null,
        }, 
        5: {
            position: 5,
            val: null,
        },
        6: {
            position: 6,
            val: null,
        },
    }

    const [polylines, setPolylines] = useState();
    const date = activity && activity.start_date ? formatStrDate(activity.start_date) : null;

    const router = useRouter();
    
    useEffect(() =>  {
        setLoading(true)
        // debugger
        const handleGetActivityStreams = async () => {
            const activityStreams = await getApiActivityStreams(apiToken, activity['external_id'], 'altitude')
            const localActivityStreams = {}
            activityStreams.forEach(stream => {
                localActivityStreams[stream['stream_type']] = stream
            });
            setActivityStreams(localActivityStreams)
            setLoading(false)
        }
        handleGetActivityStreams()
        // setActivityStreams(activityStreams)
        if (activity.polyline) {
            let polylines = activity.polyline;
            let decoded_polylines = polyline.decode(polylines);
            setPolylines(decoded_polylines)
        }
    }, [])

    const localSetActivity = () => {
        setActivityStreams()
        // setActivity()
        // setActivity(null)
        // cookieCutter.set('selectedActivity', null, { expires: new Date(0) })
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

    
    return (
        <div className={`activityDetail detail ${polylines ? 'grayBackground' : ''}`}>
            <div className='ActivityListItemDetailTextContainer' id='ActivityListItemDetailTextContainer'>
                <div className='controlContainer'>
                    <div className="mapButton buttonShadow" onClick={localSetActivity}>Back</div>
                    {/* <a className="activityListButtonPLink" href={`https://www.strava.com/activities/${activity.external_id}`}>
                        <p className="activityListButtonP link">View on Strava</p>
                    </a> */}
                    <div className='buttonsContainer'>
                        <TextOptionsModal 
                            activity={activity}
                        ></TextOptionsModal>
                        {/* <HelpModal></HelpModal> */}
                    </div>
                </div>
                <div className="activityListItemTextBox">
                    <p className="activityListButtonP nameBig">{activity.name}</p>
                    <p className="activityListButtonP date last">{date}</p>
                        {/* <span className='spanLeft'>{date}</span>
                        <span className='spanRight'>
                            <a className="activityListButtonPLink" href={`https://www.strava.com/activities/${activity.external_id}`}>
                                <p className="activityListButtonP link">View on Strava</p>
                            </a>
                        </span>
                    </p> */}
                    {/* <p className="activityListButtonP last">
                        <span className='spanLeft'>Distance: {`${(activity.distance / 1609.34).toFixed(2)} mi`}</span>
                        <span className='spanRight'>
                            <a className="activityListButtonPLink" href={`https://www.strava.com/activities/${activity.external_id}`}>
                                <p className="activityListButtonP link">View on Strava</p>
                            </a>
                        </span>
                    </p> */}
                    {/* <p className="activityListButtonP">Distance: {`${(activity.distance / 1609.34).toFixed(2)} mi`}</p> */}
                    {/* <a className="activityListButtonPLink" href={`https://www.strava.com/activities/${activity.external_id}`}><p className="activityListButtonP link last">View on Strava</p></a> */}
                </div>
            </div>
            
            {/* {loading ? ( */}
            <Spinner loading={loading} setLoading={setLoading} typeOption={'map'}></Spinner>
            {/* // ) : ( null )} */}
            {polylines && !loading ? (
                <MapWrapper polylines={polylines} activity={activity} activityStreams={activityStreams} layout={layout}></MapWrapper>
            ) : (
                <div className="emptyActivityDisplay">
                    No Map To Display For This Activity
                </div>
            )}
            
            <HelpModal></HelpModal>
            <a className="activityListButtonPLink2" target="_blank" href={`https://www.strava.com/activities/${activity.external_id}`}>
                <p className="activityListButtonP link">View on Strava</p>
            </a>
        </div>
    )
};

export default ActivityDetail