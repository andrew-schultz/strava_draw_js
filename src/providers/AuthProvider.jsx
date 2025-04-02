import {
    useState,
    useEffect,
    useContext,
    // useReducer,
    createContext,
    // Dispatch
} from "react";
import cookieCutter from "@boiseitguru/cookie-cutter";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [athleteId, setAthleteId] = useState();
    const [apiToken, setApiToken] = useState();
    const [showAuthButton, setShowAuthButton] = useState(false);

    useEffect(() => {
        const existingToken = localStorage.getItem('apiToken')
        // const existingTokenCookie = cookieCutter.get('apiToken');

        // let now = new Date();
        // let timeToExpire = now.getTime() + (60 * 60 * 1000); // Cookie expires in 1 hour
        // now.setTime(timeToExpire);

        if (existingToken) {
            // cookieCutter.set('apiToken', existingTokenLS, { expires: now.toUTCString() });
            setApiToken(existingToken)
        }
        // else if (existingTokenCookie && existingTokenCookie != null) {
        //     // localStorage.setItem('apiToken', existingTokenCookie)
        //     setApiToken(existingTokenCookie)
        // }
        setMounted(true);
    }, []);

    // useEffect(() => {
    //     cookieCutter.set('accessToken', accessToken);
    // }, [accessToken]);

    useEffect(() => {
        if (apiToken) {
            let now = new Date();
            let timeToExpire = now.getTime() + (60 * 60 * 1000); // Cookie expires in 1 hour
            now.setTime(timeToExpire);
            cookieCutter.set('apiToken', apiToken, { 'expires': now.toUTCString() });
        }
    }, [apiToken]);

    const value = {
        accessToken,
        apiToken,
        athleteId,
        refreshToken,
        showAuthButton,
        setAccessToken,
        setApiToken,
        setAthleteId,
        setRefreshToken,
        setShowAuthButton,
    };

    if (!mounted) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthProvider = () => {
    const context = useContext(AuthContext);

    if (context == undefined) {
        // throww error
    }
    return context;
};

export default AuthProvider