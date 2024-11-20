'use client'
import ActivityDetail from '../components/ActivityDetail'
import { useActivitiesProvider } from '../providers/ActivitiesProvider'


export default function Activity() {
    const {
        selectedActivity,
        setSelectedActivity,
    } = useActivitiesProvider();

    if (!selectedActivity) {
        window.location.href = '/'
    }

    return (
        <>
            <ActivityDetail 
                activity={selectedActivity} 
                setActivity={setSelectedActivity}
            ></ActivityDetail>
        </>
    )
}