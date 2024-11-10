const ActivityListItem = ({activity, setActivity}) => {
    const localSetActivity = () => {
        setActivity(activity)
    }

    return (
        <div className="actvityListItem" onClick={localSetActivity}>
            <p className="activityListButtonP">Name: {activity.name}</p>
            <p className="activityListButtonP">Date: {activity.start_date}</p>
            <p className="activityListButtonP">Distance: {activity.distance / 1609.34}</p>
        </div>
    )
};

export default ActivityListItem