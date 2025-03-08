import cookieCutter from "@boiseitguru/cookie-cutter";
import { useAuthProvider } from '../providers/AuthProvider';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';

const LogoutComponent = () => {
    const {
        setApiToken,
    } = useAuthProvider();
    const {
        setActivities,
        setOffset,
        setMoreToGet,
        setReachedBottom,
    } = useActivitiesProvider();

    const handleLogOut = () => {
        cookieCutter.set('apiToken', null, { expires: new Date(0) })
        localStorage.removeItem('apiToken')
        setApiToken(null)
        setActivities(null)
        setOffset(0)
        setMoreToGet(true)
        setReachedBottom(false)
    }

    return (
        <div className='logoutContainer' onClick={handleLogOut}>
            <p className='logoutText'>Log Out</p>
        </div>
    )
}

export default LogoutComponent
