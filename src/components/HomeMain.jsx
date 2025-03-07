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
    const [reachedBottom, setReachedBottom] = useState(false);
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
    } = useActivitiesProvider();

    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`
    // const activitiesUrl = `${window.location.protocol}//${window.location.host}?activities`
    
    // useEffect(() => {
    //     setAccessToken(accessToken)
    // }, [accessToken])

    // useEffect(() => {
    //     const handleGetActivities = async () => {
    //         const response = await getApiActivities(apiToken)
    //         debugger
    //         const activities = response.activity_data
    //         const offset = response.next_query
    //         setActivities(activities)
    //         setOffset(offset)
    //     }
    //     if (apiToken) {
    //         handleGetActivities()
    //     }
    // }, apiToken)

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
                    setLoading(false)
                }
                else {
                    // show an error about authorizing strava
                }
            }

            const handleGetActivities = async () => {
                let response = await getApiActivities(apiToken)
                setActivities(response['activity_data'])
                setLoading(false)
            }
            
            if (!code && apiToken && !activities) {
                // get the activities
                handleGetActivities()
            }
            else if (code && !activities && apiToken) {
                // showAuthButton = true
                // setLoading(false)
                // getCredsAndActivities(code)
                handleExchangeAuthCode(code, apiToken, scope)
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
                if (apiToken) {
                    let newActivites = await getApiActivities(apiToken, offset);
                    const allActivities = activities.concat(newActivites);
                    setOffset(offset + 30)
                    // setActivityPage(activityPage + 1);
                    setActivities( allActivities);
                    setReachedBottom(false); // Reset the flag
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

            { activities !== null ? (
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