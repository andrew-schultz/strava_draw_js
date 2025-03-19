import { signup } from '../services/api';
import { useState } from 'react';
import { useAuthProvider } from '../providers/AuthProvider';


const SignupComponent = ({loading, setLoading, handleToggleSignup}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()

    const {
        apiToken,
        setApiToken,
        showAuthButton,
        setShowAuthButton,
    } = useAuthProvider();

    // const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    // const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`

    const handleSignup = async (e) => {
        setLoading(true)
        const data = {
            'email': email,
            'password': password,
            'password_confirm': passwordConfirm,
        }
        
        const resp = await signup(email, password, passwordConfirm)
                
        if (resp) {
            if (resp['detail']) {
                // show errors
                // setErrorMessage(resp['errors']['detail'])
                setErrorMessage("There's an issue with your email or password")
            } else {
                localStorage.setItem('apiToken', resp['token'])
                setApiToken(resp['token'])

                if (resp['integration']) {
                    // get the activities
                }
                else {
                    // throw it to strava
                    // window.location.href = authUrl;
                    setShowAuthButton(true)
                    setLoading(false)
                }
            }
        }
    }

    const handleSetEmail = (e) => {
        const val = e.target.value;
        setEmail(val)
    }

    const handleSetPassword = (e) => {
        const val = e.target.value;
        setPassword(val)
    }

    const handleSetPasswordConfirm = (e) => {
        const val = e.target.value;
        setPasswordConfirm(val)
    }

    return (
        <div id='SignupContainer' className='loginContainer'>
            <div className='loginInputContainer'>
                <input className='loginInput' placeholder="email" name='email' type='email' onChange={handleSetEmail}></input>
            </div>
            <div className='loginInputContainer'>
                <input className='loginInput' placeholder="password" name='password' type='password' onChange={handleSetPassword}></input>
            </div>
            <div className='loginInputContainer'>
                <input className='loginInput' placeholder="confirm password" name='passwordConfirm' type='password' onChange={handleSetPasswordConfirm}></input>
            </div>
            <div className='loginButtonContainer'>
                <div className='authButton' onClick={handleSignup}>
                    Sign Up
                </div>
            </div>
            <div >
                <p className="cursor" onClick={handleToggleSignup}>click to login</p>
            </div>
        </div>
    )
}

export default SignupComponent