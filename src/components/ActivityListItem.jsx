import Link from "next/link";
import { formatStrDate } from "../services/utils";
import { useActivitiesProvider } from "../providers/ActivitiesProvider";

const ActivityListItem = ({activity, setActivity}) => {
    const {
        setHomeScrollPosition,
        setHomeScrollId,
    } = useActivitiesProvider()

    const localSetActivity = (e) => {
        const scrollPosition = e.target.offsetTop + 150 > 0 ? e.target.offsetTop : 0;
        setHomeScrollPosition(scrollPosition)
        setHomeScrollId(activity.external_id)
        setActivity(activity);
    };

    const date = formatStrDate(activity.start_date);

    return (
        <Link href={'/activity'} className="link">
            <div className="activityListItem" onClick={localSetActivity}>
                <div className="activityListItemText">
                    <p className="activityListButtonP name">{activity.name}</p>
                    <p className="activityListButtonP date">{date}</p>
                    <p className="activityListButtonP distance">Distance: {`${(activity.distance / 1609.34).toFixed(2)} mi`}</p>
                </div>
            </div>
        </Link>
        
    )
};

export default ActivityListItem