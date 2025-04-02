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
        cookieCutter.set('accessToken', null, { expires: new Date(0) })
        localStorage.removeItem('apiToken')
        setApiToken(null)
        setActivities(null)
        setOffset(0)
        setMoreToGet(true)
        setReachedBottom(false)

        // clear the query params so login shows up as expected
        let params = new URLSearchParams(document.location.search);
        if (params.get('code')) {
            params.delete('scope')
            params.delete('code')
            setTimeout(() => {
                window.location.search = params
            }, 100);
        }
    }

    return (
        <div className='logoutContainer buttonShadowFloat' onClick={handleLogOut}>
            <p className='logoutText'>Log Out</p>
        </div>
    )
}

export default LogoutComponent
