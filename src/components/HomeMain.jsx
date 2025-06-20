"use client"

import { useEffect, useState, useRef } from 'react';
import { exchangeAuthCode, getApiActivities, getFirstApiActivities } from '../services/api';
import { setDivToViewportSize } from '../services/utils';
import ActivityList from "./ActivityList"
import cookieCutter from "@boiseitguru/cookie-cutter";
import Spinner from "./Spinner"
import { useActivitiesProvider } from '../providers/ActivitiesProvider'
import { useAuthProvider } from '../providers/AuthProvider';
import LoginComponent from './LoginComponent';
import LogoutComponent from './LogoutComponent';


const HomeMain = () => {
    const [loading, setLoading] = useState(true);
    const [optionText, setOptionText] = useState(null);
    const scrollRef = useRef(null);
    const [scope, setScope] = useState();
    const [code, setCode] = useState();

    const {
        apiToken,
        showAuthButton,
    } = useAuthProvider();

    const {
        activities,
        selectedActivity,
        setActivities,
        setSelectedActivity,
        offset,
        setOffset,
        moreToGet,
        setMoreToGet,
        reachedBottom,
        setReachedBottom,
        homeScrollPosition,
        setHomeScrollPosition,
        homeScrollId,
        setHomeScrollId,
    } = useActivitiesProvider();

    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`
    
    // Update size on window resize
    window.addEventListener('resize', function() {
        const d = document.getElementById('mainScrollable')
        setDivToViewportSize(d);
    });
    
    useEffect(() => {
        if (!activities) {
            setLoading(true)
            let params = new URLSearchParams(document.location.search);
            let localCode
            let localScope
            if(params.get('code')) {
                setCode(params.get('code'))
                localCode = params.get('code')
                // params.delete('code')
                // window.location.search = params
            }
            if (params.get('scope')) {
                setScope(params.get('scope'))
                localScope = params.get('scope')
                // params.delete('scope')
                // window.location.search = params
            }

            const apiTokenCookie = cookieCutter.get('apiToken')
            const apiTokenLS = localStorage.getItem('apiToken')
            
            const handleExchangeAuthCode = async (code, token, scope) => {
                setOptionText('Syncing your account with Strava...')
                let response = await exchangeAuthCode(code, token, scope)
                if (response['success']) {
                    // flip a flag so we can show text to indicate that activities are being fetched, wait a sec, etc etc
                    // then we need to get the activities
                    setOptionText('Fetching your activities, this may take a sec...')
                    let response = await getFirstApiActivities(token, offset)
                    if (response['activities']) {
                        setActivities(response["activities"])
                        if (response['activities'].length == 100) {
                            setOffset(offset + 100)
                        } else  {
                            setOffset(offset + response['activities'].length)
                        }
                    }
                    
                    setLoading(false)
                }
            }

            const handleGetActivities = async (token) => {
                console.log('try activities')
                let response = await getApiActivities(token, offset)
                if (response['count'] && response['count'] > 0) {
                    setActivities(response['activity_data'])

                    if (response['next_query']) {
                        setOffset(offset + 100)
                    }
                    else {
                        setMoreToGet(false)
                    }
                    setLoading(false)
                } 
                else {
                    // if therses a code, mind as well try to exchange it
                    if (localCode && token) {
                        let res = await handleExchangeAuthCode(localCode, token, localScope)
                    } else {
                        setLoading(false)
                    }
                    // show an error about authorizing strava
                }
                
            }

            const storedApiToken = apiTokenLS || apiTokenCookie ? (apiTokenLS ? apiTokenLS : false) || (apiTokenCookie ? apiTokenCookie : false) : false
            const localApiToken = apiToken ? apiToken : storedApiToken

            if (!activities && localApiToken) {
                handleGetActivities(localApiToken)
            } 
            else if (localCode && localApiToken && !activities) {
                handleExchangeAuthCode(localCode, localApiToken, localScope)
            } 
            else {
                setLoading(false)
            }
        } else {
            const scrollNow = activities.filter(activity => activity.external_id == homeScrollId)
            console.log('scrollNow', scrollNow)
            if (homeScrollId && scrollNow) {
                const scrollEl = document.getElementById('mainScrollable')
                console.log('sroll now', scrollEl)
                scrollEl.scrollTo(0, homeScrollPosition)
            } else {
                console.log('scroll top 0')
                setHomeScrollPosition(0)
                setHomeScrollId(0)
            }
            setSelectedActivity(null)
            setLoading(false)
        }

        const d = document.getElementById('mainScrollable')
        setDivToViewportSize(d);
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
        if ((scrollTop + clientHeight >= scrollHeight - 500) && !reachedBottom && !selectedActivity) {
            setReachedBottom(true);
        }
    };

    const handleAuthUrlClick = () => {
        window.location.href = authUrl
    }

    return (
        <div id='mainScrollable' className={`scrollableElement ${(apiToken == null && !activities) || (apiToken && showAuthButton) ? 'homeBackground main': null}`} ref={scrollRef} onScroll={handleScrollEvent}>
            <Spinner loading={loading} setLoading={setLoading} typeOption={'homeBackground'} optionText={optionText}></Spinner>
            {apiToken == null ? (
                <LoginComponent loading={loading} setLoading={setLoading} setOptionText={setOptionText} code={code} scope={scope}></LoginComponent>
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