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

    useEffect(() => {
        setMounted(true);
    }, []);

    const value = {
        activities,
        selectedActivity,
        setActivities,
        setSelectedActivity,
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