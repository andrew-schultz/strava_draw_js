"use client"

import { useEffect, useState, useRef } from 'react';
import { getActivities, getAuthorization } from "../services/strava";
// import ActivityDetail from "./ActivityDetail"
import ActivityList from "./ActivityList"
import cookieCutter from "@boiseitguru/cookie-cutter";
import Spinner from "./Spinner"
import { useActivitiesProvider } from '../providers/ActivitiesProvider'
import { useAuthProvider } from '../providers/AuthProvider';


const HomeMain = () => {
    const [reachedBottom, setReachedBottom] = useState(false);
    const [loading, setLoading] = useState(true);

    const scrollRef = useRef(null);

    const {
        accessToken,
        athleteId,
        refreshToken,
        setAccessToken,
        setAthleteId,
        setRefreshToken,
     } = useAuthProvider();

    const {
        activities,
        selectedActivity,
        setActivities,
        setSelectedActivity,
        activityPage,
        setActivityPage,
    } = useActivitiesProvider();

    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`
    // const activitiesUrl = `${window.location.protocol}//${window.location.host}?activities`
    
    useEffect(() => {
        setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!activities) {
            setLoading(true)
            let params = new URLSearchParams(document.location.search);
            let code = params.get('code')
            const athleteIdCookie = cookieCutter.get('athleteId')
            const refreshTokenCookie = cookieCutter.get('refreshToken')
            const accessTokenCookie = cookieCutter.get('accessToken')
    
            const getCredsAndActivities = async (code) => {
                let creds = await getAuthorization(code)
                console.log(creds)
                
                if (creds.access_token) {
                    cookieCutter.set('accessToken', creds.access_token)
                    setAccessToken(creds.access_token)
                }
    
                if (creds.refresh_token) {
                    cookieCutter.set('refreshToken', creds.refresh_token)
                    setRefreshToken(creds.refresh_token)
                }
    
                if (creds.athlete.id) {
                    cookieCutter.set('athleteId', parseInt(creds.athlete.id))
                    setAthleteId(creds.athlete.id)
                }
                
                if (creds.athlete.id && creds.access_token && creds.refresh_token) {
                    let newActivities = await getActivities(creds.athlete.id, creds.access_token, creds.refresh_token, activityPage, setAccessToken)
                    setActivityPage(activityPage + 1);
                    setActivities(newActivities)  
                    setLoading(false)
                }
            }

            const handleGetActivities = async (athleteId, accessToken, refreshToken) => {
                let newActivities = await getActivities(athleteId, accessToken, refreshToken, activityPage, setAccessToken)
                setActivityPage(activityPage + 1);
                setActivities(newActivities)  
                setLoading(false)
            }
    
            if (athleteIdCookie && refreshTokenCookie && accessTokenCookie) {
                setAthleteId(parseInt(athleteIdCookie))
                setAccessToken(accessTokenCookie)
                setRefreshToken(refreshTokenCookie)
                if (!activities) {
                    handleGetActivities(parseInt(athleteIdCookie), accessTokenCookie, refreshTokenCookie)
                } else {
                    setLoading(false)
                }
            } else if (code && !activities) {
                getCredsAndActivities(code)
            } else {
                setLoading(false)
            }
        } else {
            setSelectedActivity(null)
            setLoading(false)
        }    
    }, [])

    useEffect(() => {
        if (reachedBottom) {
            // Perform action when bottom is reached
            const getMoreActivities = async () => {
                let newActivites = await getActivities(athleteId, accessToken, refreshToken, activityPage);
                const allActivities = activities.concat(newActivites);
                setActivityPage(activityPage + 1);
                setActivities( allActivities);
                setReachedBottom(false); // Reset the flag
            }
            getMoreActivities();
        }
    }, [reachedBottom]);


    const handleScrollEvent = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if ((scrollTop + clientHeight >= scrollHeight - 100) && !reachedBottom && !selectedActivity) {
            setReachedBottom(true);
        }
    };

    return (
        <div className='scrollableElement' ref={scrollRef} onScroll={handleScrollEvent}>
            <Spinner loading={loading} setLoading={setLoading}></Spinner>
            {accessToken == null ? (
            <div className='authButtonContainer'>
                <a className='authLink' href={authUrl}>
                    <div className='authButton'>
                        GET AUTH
                    </div>
                </a>
            </div>) : (null) } 

            { activities !== null ? (
                <ActivityList 
                    activities={activities}
                    loading={loading}
                    setSelectedActivity={setSelectedActivity} 
                    selectedActivity={selectedActivity}
                ></ActivityList>
            ) : (null) }
        </div>
    )
};

export default HomeMain