"use client"

import { useEffect, useState } from 'react';
import { getActivities, getAuthorization } from "../services/strava";
import ActivityListItem from "./ActivityListItem"
import ActivityDetail from "./ActivityDetail"

const HomeMain = ({stravaCookies}) => {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [athleteId, setAthleteId] = useState();
    const [activities, setActivities] = useState();
    const [selectedActivity, setSelectedActivity] = useState();
    const [cookies, setCookies] = useState(stravaCookies, null);

    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`
    // const activitiesUrl = `${window.location.protocol}//${window.location.host}?activities`
    
    // useEffect(() => {

    //     if (stravaCookies) {
    //         let cookies = stravaCookies;

    //         console.log(stravaCookies)
    //         debugger
    //         setAccessToken(cookies.get('accessToken', null))
    //         setRefreshToken(cookies.get('refreshsToken', null))
    //         setAthleteId(cookies.get('athletId', null))
    //         console.log()
    //     }
       
    // }, [cookies])

    useEffect(() => {
        let params = new URLSearchParams(document.location.search);
        let code = params.get('code')

        const getCreds = async (code) => {

            let creds = await getAuthorization(code)
            console.log(creds)
            
            if (creds.access_token) {
                setAccessToken(creds.access_token)
                // if (cookies) {
                //     cookies.set('accessToken', creds.access_token)
                // }
            }

            if (creds.refresh_token) {
                setRefreshToken(creds.refresh_token)
                // if (cookies) {
                //     cookies.set('refreshToken', creds.refresh_token)
                // }
            }

            if (creds.athlete.id) {
                setAthleteId(creds.athlete.id)
                // if (cookies) {
                //     cookies.set('athletId', creds.athlete.id)
                // }
            }
            
            if (creds.athlete.id && creds.access_token && creds.refresh_token) {
                let activities = await getActivities(creds.athlete.id, creds.access_token, creds.refresh_token)
                console.log(activities)
                setActivities(activities)      
            }
        }

        // if (athleteId && accessToken && refreshToken) {
        // try {
        //     let activities = await getActivities(creds.athlete.id, creds.access_token, creds.refresh_token)
        // }
        // catch (error) {
        //     getCreds(code)
        // }

        if (code && !athleteId) {
            getCreds(code)
        }

        // window.location.href = `/?activities`

    }, [])

    // useEffect(() => {
    //     console.log('act', activities)
    //     // if (activities) {
    //     //     setSelectedActivity(activities[0])
    //     // }
    // }, [activities])

    
    // const getAuth = async () => {
    //     if (typeof window !== "undefined") {
    //         window.location.href = authUrl;
    //     }
    // }

    return (
        <div>
            {accessToken == null ? (
            <div className='authButtonContainer'>
                <a className='authLink' href={authUrl}>
                    <div className='authButton'>
                        GET AUTH
                    </div>
                </a>
            </div>) : (null) } 

            {(activities == null) || selectedActivity ? (null) : (
                activities.map((activity, index) => (
                    <div key={index}>
                        <ActivityListItem activity={activity} setActivity={setSelectedActivity}></ActivityListItem>
                    </div>
                ))
            )}
            {selectedActivity ? 
                <ActivityDetail activity={selectedActivity} setActivity={setSelectedActivity}></ActivityDetail> : (null)
            }
        </div>
    )
};

export default HomeMain