import cookieCutter from "@boiseitguru/cookie-cutter";
import { useAuthProvider } from '../providers/AuthProvider';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';

const LogoutComponent = () => {
    const {
        apiToken,
        setApiToken,
    } = useAuthProvider();
    const {
        setActivities,
        setOffset,
    } = useActivitiesProvider();

    const handleLogOut = () => {
        cookieCutter.set('apiToken', null, { expires: new Date(0) })
        localStorage.removeItem('apiToken')
        setActivities(null)
        setOffset(null)
        setApiToken(null)
    }

    return (
        <div className='logoutContainer' onClick={handleLogOut}>
            <p className='logoutText'>Log Out</p>
        </div>
    )
}

export default LogoutComponent
