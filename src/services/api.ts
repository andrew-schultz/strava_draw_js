import cookieCutter from "@boiseitguru/cookie-cutter";
import crypto from 'crypto-js';


const csrftoken = process.env.NEXT_PUBLIC_CSRF_TOKEN
const signingKey = process.env.NEXT_PUBLIC_SIG_KEY

const signRequest = (data) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const dataToSign = `${JSON.stringify(data)}`;
    const hash = crypto.HmacSHA256(dataToSign, signingKey);
    const signature = crypto.enc.Base64.stringify(hash);
    return [signature, timestamp]
}

const csrfAuth = async () => {
    const getHeaders = {
        'Accept': "application/json, text/plain, */*",
    }

    const getResponse = await fetch("http://localhost:8000/api/v1/strava/auth/", {
        method: "GET",
        headers: getHeaders,
    });

    const csrfTokenCookie = cookieCutter.get('csrftoken')
    return csrfTokenCookie
}


export const exchangeAuthCode = async (code, token, scope) => {

    // const getHeaders = {
    //     'Accept': "application/json, text/plain, */*",
    // }

    // const getResponse = await fetch("http://localhost:8000/api/v1/strava/auth/", {
    //     method: "GET",
    //     headers: getHeaders,
    // });

    const csrfTokenCookie = await csrfAuth();
    // debugger

    const body = JSON.stringify({code: code, scope: scope})
    // debugger
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'X-CSRFToken': csrfTokenCookie,
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": '*',
    }
    const response = await fetch("http://localhost:8000/api/v1/strava/auth/", {
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
        // 'X-Signature': signature,
        // 'X-Timestamp': timestamp,
        'Authorization': signature,
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": '*',
    }
    const response = await fetch("http://localhost:8000/api/v1/auth/signup/", {
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
        // 'X-Signature': signature,
        // 'X-Timestamp': timestamp,
        'Authorization': signature,
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": '*',
    }
    const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
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
        // 'X-CSRFToken': csrfTokenCookie,
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": '*',
    }
    const response = await fetch("http://localhost:8000/api/v1/auth/logout/", {
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
        // "Access-Control-Allow-Origin": '*',
    }
    const response = await fetch(`http://localhost:8000/api/v1/activity/?offset=${offset}`, {
        method: "GET",
        headers: headers,
        credentials: 'include',
    });
    
    return response.json();
}