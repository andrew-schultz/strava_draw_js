import cookieCutter from "@boiseitguru/cookie-cutter";
import crypto from 'crypto-js';


const csrftoken = process.env.NEXT_PUBLIC_CSRF_TOKEN
const signingKey = process.env.NEXT_PUBLIC_SIG_KEY
const apiURL = process.env.NEXT_PUBLIC_API_URL || "https://routeviewer.com"
// const apiURL = "http://localhost:8000/"
// const apiURL = "https://routeviewer.com/"


const signRequest = (data) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const dataToSign = `${JSON.stringify(data)}`;
    const hash = crypto.HmacSHA256(dataToSign, signingKey);
    const signature = crypto.enc.Base64.stringify(hash);
    return [signature, timestamp]
}

const csrfAuth = async () => {
    const data = {
        csrf: true,
    }
    const [signature, timestamp] = signRequest(data)

    const getHeaders = {
        'Accept': "application/json, text/plain, */*",
        'Authorization': signature,
        "Content-Type": "application/json",
    }

    const getResponse = await fetch(`${apiURL}api/v1/strava/auth/`, {
        method: "GET",
        headers: getHeaders,
    });

    const csrfTokenCookie = cookieCutter.get('csrftoken')
    return csrfTokenCookie
}


export const exchangeAuthCode = async (code, token, scope) => {
    const csrfTokenCookie = await csrfAuth();
    const body = JSON.stringify({code: code, scope: scope})
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    const response = await fetch(`${apiURL}api/v1/strava/auth/`, {
        method: "POST",
        headers: headers,
        credentials: 'include',
        body,
    });
    return response.json();
}

export const signup = async (email, password, passwordConfirm) => {
    // send email, password, passwordConfirm
    // get a token
    const csrfTokenCookie = await csrfAuth();
    const data = {
        email: email,
        password: password,
        password_confirm: passwordConfirm,
    }
    const [signature, timestamp] = signRequest(data)
    const body = JSON.stringify(data)

    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': signature,
        "Content-Type": "application/json",
    }
    const response = await fetch(`${apiURL}api/v1/auth/signup/`, {
        method: "POST",
        headers: headers,
        credentials: 'include',
        body,
    });
    
    return response.json();
}

export const login = async (email, password) => {
    // send email, password
    // get a token
    const csrfTokenCookie = await csrfAuth();
    const data = {
        email: email,
        password: password,
    }
    const [signature, timestamp] = signRequest(data)
    const body = JSON.stringify(data)
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': signature,
        "Content-Type": "application/json",
    }
    const response = await fetch(`${apiURL}api/v1/auth/login/`, {
        method: "POST",
        headers: headers,
        credentials: 'include',
        body,
    });
    return response.json();
}

export const logout = async (token) => {
    // just send the token duh
    const csrfTokenCookie = await csrfAuth();
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    const response = await fetch(`${apiURL}api/v1/auth/logout/`, {
        method: "GET",
        headers: headers,
        credentials: 'include',
    });
    
    return response.json();
}

export const getApiActivities = async (token, offset=0) => {
    const csrfTokenCookie = await csrfAuth();
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    const url = offset > 0 ? `${apiURL}api/v1/activity/?limit=100&offset=${offset}` : `${apiURL}api/v1/activity/`
    const response = await fetch(url, {
        method: "GET",
        headers: headers,
        credentials: 'include',
    });
    
    return response.json();
}

export const getFirstApiActivities = async (token, offset=0) => {
    const csrfTokenCookie = await csrfAuth();
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    const url = `${apiURL}api/v1/activity/first/`
    const response = await fetch(url, {
        method: "GET",
        headers: headers,
        credentials: 'include',
    });
    
    return response.json();
}

export const getApiActivityStreams = async (token, activity_id, stream_types) => {
    const csrfTokenCookie = await csrfAuth();
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    const url = `${apiURL}api/v1/activity_stream/${activity_id}/?stream_types=${stream_types}`
    const response = await fetch(url, {
        method: "GET",
        headers: headers,
        credentials: 'include',
    });
    
    return response.json();
}
