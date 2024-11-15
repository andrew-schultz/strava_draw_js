import ActivityListItem from "./ActivityListItem"

const ActivityList = ({activities, setSelectedActivity, selectedActivity}) => {

    return (
        <>
            {(activities == null) || selectedActivity ? (null) : (
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