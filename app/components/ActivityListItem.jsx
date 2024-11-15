const ActivityListItem = ({activity, setActivity}) => {

    const localSetActivity = () => {
        setActivity(activity);
    };

    const date = new Date(activity.start_date).toLocaleString();

    return (
        <div className="activityListItem" onClick={localSetActivity}>
            <div className="activityListItemText">
                <p className="activityListButtonP">Name: {activity.name}</p>
                <p className="activityListButtonP">Date: {date}</p>
                <p className="activityListButtonP">Distance: {`${(activity.distance / 1609.34).toFixed(2)} mi`}</p>
            </div>
        </div>
    )
};

export default ActivityListItem