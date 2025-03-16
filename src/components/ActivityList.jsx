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
            {/* {(activities !== null && loading) ? (
                <div key={'loadingActivityListItem'}>
                    <div className="activityListItem">
                        <div className="activityListItemText">
                            <Spinner loading={loading}></Spinner>
                        </div>
                    </div>
                </div>
            ):
            (null)} */}
        </>
    )
}

export default ActivityList