import {
    useState,
    useEffect,
    useContext,
    useReducer,
    createContext,
    Dispatch
} from "react";


const ActivitiesContext = createContext(null);

export const ActivitiesProvider = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const [activities, setActivities] = useState();
    const [selectedActivity, setSelectedActivity] = useState();
    const [activityPage, setActivityPage] = useState(1);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    const value = {
        activities,
        selectedActivity,
        activityPage,
        offset,
        setActivities,
        setSelectedActivity,
        setActivityPage,
        setOffset,
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