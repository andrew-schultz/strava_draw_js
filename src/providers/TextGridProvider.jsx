import {
    useState,
    useEffect,
    useContext,
    useReducer,
    createContext,
    Dispatch
} from "react";
import { useActivitiesProvider } from "./ActivitiesProvider";


const TextGridContext = createContext(null);

const gridBase = {
    1: {
        position: 1,
        val: null,
    },
    2: {
        position: 2,
        val: null,
    },
    3: {
        position: 3,
        val: null,
    },
    4: {
        position: 4,
        val: null,
    }, 
    5: {
        position: 5,
        val: null,
    },
    6: {
        position: 6,
        val: null,
    },
}

const onListBase = {
    'showDistance': {
        name: 'showDistance', 
        on: false, 
        field: 'showDistance',
        dataId: 1,
        position: null,
        displayName: 'Distance',
    },
    'showElevGain': {
        name: 'showElevGain', 
        on: false, 
        field: 'showElevGain',
        dataId: 2,
        position: null,
        displayName: 'Elev. Gain',
    },
    'showPace': {
        name: 'showPace', 
        on: false, 
        field: 'showPace',
        dataId: 3,
        position: null,
        displayName: 'Pace',
    },
    'showDuration': {
        name: 'showDuration', 
        on: false, 
        field: 'showDuration',
        dataId: 4,
        position: null,
        displayName: 'Duration',
    },
    'showAvgPower': {
        name: 'showAvgPower', 
        on: false, 
        field: 'showAvgPower',
        dataId: 5,
        position: null,
        displayName: 'Avg. Power',
    },
    'showAvgSpeed': {
        name: 'showAvgSpeed', 
        on: false, 
        field: 'showAvgSpeed',
        dataId: 6,
        position: null,
        displayName: 'Avg. Speed',
    },
    'showWorkDone': {
        name: 'showWorkDone', 
        on: false, 
        field: 'showWorkDone',
        dataId: 7,
        position: null,
        displayName: 'Work Done',
    },
}


export const TextGridProvider = ({ children }) => {
    const {
        selectedActivity,
    } = useActivitiesProvider();

    const [mounted, setMounted] = useState(false);
    const [grid, setGrid] = useState(gridBase);
    const [onList, setOnList] = useState(onListBase);
    const [drawNow, setDrawNow] = useState(false);
    const [placementGrid, setPlacementGrid] = useState(gridBase);
    const [showDistance, setShowDistance] = useState(true);
    const [showElevGain, setShowElevGain] = useState(selectedActivity ? selectedActivity.type.includes('Ride') : true);
    const [showDuration, setShowDuration] = useState(true);
    const [showPace, setShowPace] = useState(selectedActivity ? selectedActivity.type == 'Run' : false);
    const [showAvgPower, setShowAvgPower] = useState(false);
    const [showAvgSpeed, setShowAvgSpeed] = useState(false);
    const [showWorkDone, setShowWorkDone] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        onChangeOptionAssign('showDistance', showDistance);
    }, [showDistance])

    useEffect(() => {
        onChangeOptionAssign('showPace', showPace);
    }, [showPace])

    useEffect(() => {
        onChangeOptionAssign('showElevGain', showElevGain);
    }, [showElevGain])

    useEffect(() => {
        onChangeOptionAssign('showDuration', showDuration);
    }, [showDuration])

    useEffect(() => {
        onChangeOptionAssign('showAvgPower', showAvgPower);
    }, [showAvgPower])

    useEffect(() => {
        onChangeOptionAssign('showAvgSpeed', showAvgSpeed);
    }, [showAvgSpeed])

    useEffect(() => {
        onChangeOptionAssign('showWorkDone', showWorkDone);
    }, [showWorkDone])

    const onChangeOptionAssign = (key, on) => {
        if (on && onList[key].position == null) {
            assignGridSpot(key);
        }
        else if (!on && onList[key].position != null) {
            unAssignGridSpot(key);
        }
    }

    const resetGrid = () => {
        const newGrid = {...gridBase};
        const newList = {...onListBase};
        setGrid(newGrid);
        setOnList(newList);
    }

    const assignGridSpot = (key) => {
        // loop through grid to find first null spot
        let assigned = false;
        Object.keys(grid).forEach((id) => {
            if (grid[id].val == null && !assigned) {
                assigned = true;
                onList[key].position = id;
                grid[id].val = onList[key];
                placementGrid[id].val = onList[key];
            }
        })
        const newGrid = {...grid};
        const newOnList = {...onList};
        const newPlacementGrid = {...placementGrid};
        setGrid(newGrid);
        setOnList(newOnList);
        setPlacementGrid(newPlacementGrid);
    }

    const unAssignGridSpot = (key) => {
        const obj = onList[key];
        if (obj.position) {
            grid[obj.position].val = null;
            onList[key].position = null;

            const newGrid = {...grid};
            const newOnList = {...onList};
            const newPlacementGrid = {...placementGrid};
            setGrid(newGrid);
            setOnList(newOnList);
            setPlacementGrid(newPlacementGrid);
        }
    }

    const swapGridSpot = (originId, destinationId) => {       
        const origin = grid[originId].val;
        const destination = grid[destinationId].val;

        if (origin) {
            onList[origin.name].position = destinationId;
            grid[destinationId].val = onList[origin.name];
            placementGrid[destinationId].val = onList[origin.name];
        }
        else {
            grid[destinationId].val = null;
            placementGrid[destinationId].val = null;
        }

        if (destination) {
            onList[destination.name].position = originId;
            grid[originId].val = onList[destination.name];
            placementGrid[originId].val = onList[destination.name];
        }
        else {
            grid[originId].val = null;
            placementGrid[originId].val = null;
        }

        // update 
        const newGrid = {...grid};
        const newOnList = {...onList};
        const newPlacementGrid = {...placementGrid};
        setGrid(newGrid);
        setOnList(newOnList);
        setPlacementGrid(newPlacementGrid);
    }

    const value = {
        grid,
        onList,
        drawNow,
        placementGrid,
        showDuration,
        showDistance,
        showElevGain,
        showPace,
        showAvgPower,
        showAvgSpeed,
        showWorkDone,
        setGrid,
        setOnList,
        resetGrid,
        setDrawNow,
        assignGridSpot,
        unAssignGridSpot,
        swapGridSpot,
        setPlacementGrid,
        setShowDuration,
        setShowDistance,
        setShowElevGain,
        setShowPace,
        setShowAvgPower,
        setShowAvgSpeed,
        setShowWorkDone,
    };

    if (!mounted) {
        return null;
    }

    return (
        <TextGridContext.Provider value={value}>
            {children}
        </TextGridContext.Provider>
    )
}

export const useTextGridProvider = () => {
    const context = useContext(TextGridContext);

    if (context == undefined) {
        // throww error
    }
    return context;
};

export default TextGridProvider