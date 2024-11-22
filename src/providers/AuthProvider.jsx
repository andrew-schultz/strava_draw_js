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

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        cookieCutter.set('accessToken', accessToken);
    }, [accessToken]);

    const value = {
        accessToken,
        athleteId,
        refreshToken,
        setAccessToken,
        setAthleteId,
        setRefreshToken,
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