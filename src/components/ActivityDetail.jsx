"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HelpModal from "./HelpModal";
import TextOptionsModal from './TextOptionsModal';
import { formatStrDate } from '../services/utils';
import { getApiActivityStreams } from '../services/api';
import { useAuthProvider } from '../providers/AuthProvider';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';
import Spinner from './Spinner';
import MapWrapper from './MapWrapper';

var polyline = require('@mapbox/polyline');

const ActivityDetail = ({activity, setActivity, }) => {
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

    const [polylines, setPolylines] = useState();
    const date = activity && activity.start_date ? formatStrDate(activity.start_date) : null;

    const router = useRouter();
    
    useEffect(() =>  {
        setLoading(true)
       
        const handleGetActivityStreams = async () => {
            const activityStreams = await getApiActivityStreams(apiToken, activity['external_id'], 'altitude')
            const localActivityStreams = {}
            activityStreams.forEach(stream => {
                localActivityStreams[stream['stream_type']] = stream
            });
            setActivityStreams(localActivityStreams)
            setLoading(false)
        }

        if (activity.activity_streams && activity.activity_streams.length > 0) {
            const localActivityStreams = {}
            activity.activity_streams.forEach(stream => {
                localActivityStreams[stream['stream_type']] = stream
            });
            setActivityStreams(localActivityStreams)
            setLoading(false)
        } else {
            handleGetActivityStreams()
        }

        if (activity.polyline) {
            let polylines = activity.polyline;
            let decoded_polylines = polyline.decode(polylines);
            setPolylines(decoded_polylines)
        }
    }, [])

    const localSetActivity = () => {
        setActivityStreams()
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
                    <div className='buttonsContainer'>
                        <TextOptionsModal 
                            activity={activity}
                        ></TextOptionsModal>
                    </div>
                </div>
                <div className="activityListItemTextBox">
                    <p className="activityListButtonP nameBig">{activity.name}</p>
                    <p className="activityListButtonP date last">{date}</p>
                </div>
            </div>
            
            <Spinner loading={loading} setLoading={setLoading} typeOption={'map'}></Spinner>
            
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