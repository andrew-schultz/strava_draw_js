import ActivityListItem from "./ActivityListItem"
import HomeFloatingButton from "./HomeFloatingButton"
import LogoutComponent from "./LogoutComponent"
import Spinner from "./Spinner"

const ActivityList = ({activities, setSelectedActivity, selectedActivity, loading}) => {

    const backToTopHandler = () => {
        const scrollEl = document.getElementById('mainScrollable')
        scrollEl.scrollTo({ top: 0, left: 0, behavior: 'smooth', })
    }
    return (
        <div>
            <HomeFloatingButton textVal={'Back to Top'} buttonClickHandler={backToTopHandler} buttonClasses={'verticalStack'}></HomeFloatingButton>
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
        </div>
    )
}

export default ActivityList