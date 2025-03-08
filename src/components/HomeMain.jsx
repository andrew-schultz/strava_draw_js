"use client"

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image'
import { exchangeAuthCode, getApiActivities } from '../services/api';
// import { getActivities, getAuthorization, getAccessToken } from "../services/strava";
// import ActivityDetail from "./ActivityDetail"
import ActivityList from "./ActivityList"
import cookieCutter from "@boiseitguru/cookie-cutter";
import Spinner from "./Spinner"
import { useActivitiesProvider } from '../providers/ActivitiesProvider'
import { useAuthProvider } from '../providers/AuthProvider';
import LoginComponent from './LoginComponent';
import LogoutComponent from './LogoutComponent';


const HomeMain = () => {
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const {
        accessToken,
        apiToken,
        athleteId,
        refreshToken,
        setAccessToken,
        setApiToken,
        setAthleteId,
        setRefreshToken,
        showAuthButton,
        setShowAuthButton,
     } = useAuthProvider();

    const {
        activities,
        selectedActivity,
        setActivities,
        setSelectedActivity,
        activityPage,
        setActivityPage,
        offset,
        setOffset,
        moreToGet,
        setMoreToGet,
        reachedBottom,
        setReachedBottom,
    } = useActivitiesProvider();

    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`

    useEffect(() => {
        if (!activities) {
            setLoading(true)
            let params = new URLSearchParams(document.location.search);
            let code = params.get('code')
            let scope = params.get('scope')
            const apiToken = localStorage.getItem('apiToken')
            cookieCutter.set('apiToken', apiToken)

            const handleExchangeAuthCode = async (code, token, scope) => {
                let response = await exchangeAuthCode(code, token, scope)
                if (response['success']) {
                    setActivities(response['activities'])
                    if (response['activities'].length == 100) {
                        setOffset(offset + 100)
                    } else  {
                        setMoreToGet(false)
                    }
                    setLoading(false)
                }
                else {
                    // show an error about authorizing strava
                }
            }

            const handleGetActivities = async () => {
                let response = await getApiActivities(apiToken, offset)
                setActivities(response['activity_data'])
                if (response['next_query']) {
                    setOffset(offset + 100)
                }
                else {
                    setMoreToGet(false)
                }
                setLoading(false)
            }
            
            if (code && !activities && apiToken) {
                handleExchangeAuthCode(code, apiToken, scope)
            } 
            else if (apiToken && !activities) {
                handleGetActivities()
            } 
            else {
                setLoading(false)
            }
        } else {
            setSelectedActivity(null)
            setLoading(false)
        }    
    }, [])

    useEffect(() => {
        if (reachedBottom && moreToGet) {
            // Perform action when bottom is reached
            const getMoreActivities = async () => {
                if (apiToken) {
                    let response = await getApiActivities(apiToken, offset);
                    let newActivites = response['activity_data']
                    let nextQuery = response['next_query']
                    const allActivities = activities.concat(newActivites);
                    setActivities(allActivities);
                    setOffset(offset + 100)
                    if (nextQuery) {
                        setReachedBottom(false); // Reset the flag
                    } else {
                        setMoreToGet(false)
                    }
                }
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

    const handleAuthUrlClick = () => {
        window.location.href = authUrl
    }

    return (
        <div className='scrollableElement' ref={scrollRef} onScroll={handleScrollEvent}>
            <Spinner loading={loading} setLoading={setLoading}></Spinner>
            {apiToken == null ? (
                <LoginComponent loading={loading} setLoading={setLoading}></LoginComponent>
            ) : (null) } 

            {showAuthButton == true? (
                <div className='authButtonContainer'>
                    <p className='authButtonP'>
                        You're almost there!<br/>Link your accounts to view your routes
                    </p>
                    <div className='authButton connect' onClick={handleAuthUrlClick}></div>
                </div>
            ) : (null) } 

            {apiToken ? (
                <LogoutComponent></LogoutComponent>
            ): (null)}

            { activities ? (
                <ActivityList 
                    activities={activities}
                    loading={loading}
                    setSelectedActivity={setSelectedActivity} 
                    selectedActivity={selectedActivity}
                ></ActivityList>
            ) : (
                <div className='stravaLogoLandingContainer'>
                    <img className='stravaLogoLanding' src={`/powered_by_strava_logo.png`}></img>
                </div>
            ) }
            
        </div>
    )
};

export default HomeMain