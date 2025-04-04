import ActivityListItem from "./ActivityListItem"
import LogoutComponent from "./LogoutComponent"
import Spinner from "./Spinner"

const ActivityList = ({activities, setSelectedActivity, selectedActivity, loading}) => {

    return (
        <>
            {(activities == null) ? (null) : (
                activities.map((activity, index) => (
                    <div key={index}>
                        <ActivityListItem 
                            activity={activity} 
                            setActivity={setSelectedActivity}
                        ></ActivityListItem>
                    </div>
                ))
            )}
        </>
    )
}

export default ActivityList