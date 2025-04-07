import {
    useState,
    useEffect,
    useContext,
    useReducer,
    createContext,
    Dispatch
} from "react";
import cookieCutter from "@boiseitguru/cookie-cutter";


const ActivitiesContext = createContext(null);

export const ActivitiesProvider = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const [activities, setActivities] = useState();
    const [selectedActivity, setSelectedActivity] = useState();
    const [activityPage, setActivityPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [moreToGet, setMoreToGet] = useState(true);
    const [reachedBottom, setReachedBottom] = useState(false);
    const [homeScrollPosition, setHomeScrollPosition] = useState(0);
    const [homeScrollId, setHomeScrollId] = useState(0);

    useEffect(() => {
        setMounted(true);
        const sA = cookieCutter.get('selectedActivity')
        if (typeof sA !== 'undefined') {
            setSelectedActivity(JSON.parse(sA))
        }
    }, []);

    useEffect(() => {
        if (typeof selectedActivity !== 'undefined') {
            cookieCutter.set('selectedActivity', JSON.stringify(selectedActivity));
        }
    }, [selectedActivity])

    const value = {
        activities,
        selectedActivity,
        activityPage,
        offset,
        moreToGet,
        reachedBottom,
        homeScrollPosition,
        homeScrollId,
        setActivities,
        setSelectedActivity,
        setActivityPage,
        setOffset,
        setMoreToGet,
        setReachedBottom,
        setHomeScrollPosition,
        setHomeScrollId,
    };

    if (!mounted) {
        return null;
    }

    return (
        <ActivitiesContext.Provider value={value}>
            {children}
        </ActivitiesContext.Provider>
    )
}

export const useActivitiesProvider = () => {
    const context = useContext(ActivitiesContext);

    if (context == undefined) {
        // throww error
    }
    return context;
};

export default ActivitiesProvider