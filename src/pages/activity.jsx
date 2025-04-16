'use client'
import ActivityDetail from '../components/ActivityDetail'
import { useActivitiesProvider } from '../providers/ActivitiesProvider'
import { useTextGridProvider } from '../providers/TextGridProvider';


export default function Activity() {
    const {
        selectedActivity,
        setSelectedActivity,
    } = useActivitiesProvider();
    // const {
    //     layout,
    //     setLayout
    // } = useTextGridProvider();
    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI

    if (!selectedActivity) {
        window.location.href = redirectUri
    }

    return (
        <>
            <ActivityDetail 
                className='grayBackground'
                activity={selectedActivity} 
                setActivity={setSelectedActivity}
                // layout={layout}
                // setLayout={setLayout}
            ></ActivityDetail>
        </>
    )
}