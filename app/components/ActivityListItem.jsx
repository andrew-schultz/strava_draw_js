const ActivityListItem = ({activity, setActivity}) => {
    const localSetActivity = () => {
        setActivity(activity)
    }

    return (
        <div className="activity-list-item" onClick={localSetActivity}>
            <p>Name: {activity.name}</p>
            <p>Date: {activity.start_date}</p>
            <p>Distance: {activity.distance / 1609.34}</p>
        </div>
    )
};

export default ActivityListItem