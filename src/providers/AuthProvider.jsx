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
        const existingTokenLS = localStorage.getItem('apiToken')
        const existingTokenCookie = cookieCutter.get('apiToken');
        if (existingTokenLS) {
            cookieCutter.set('apiToken', existingTokenLS);
            setApiToken(existingTokenLS);
        }
        else if (existingTokenCookie) {
            localStorage.setItem('apiToken', existingTokenCookie)
            setApiToken(existingTokenCookie)
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        cookieCutter.set('accessToken', accessToken);
    }, [accessToken]);

    // useEffect(() => {
    //     cookieCutter.set('apiToken', apiToken);
    // }, [apiToken]);

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