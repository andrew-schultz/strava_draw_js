import { login } from '../services/api';
import { useState } from 'react';
import { useAuthProvider } from '../providers/AuthProvider';
import SignupComponent from './SignupComponent';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';
import { exchangeAuthCode, getApiActivities, getFirstApiActivities } from '../services/api';
import TextInput from './TextInput';
import { validateEmail } from '../services/utils';


const LoginComponent = ({loading, setLoading, setOptionText, code, scope}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [toggleSignup, setToggleSignup] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [showEmailError, setShowEmailError] = useState(false)
    const [showPasswordError, setShowPasswordError] = useState(false)

    const {
        setApiToken,
    } = useAuthProvider();
    const {
        setActivities, 
        offset,
        setOffset,
        setMoreToGet,
    } = useActivitiesProvider();

    const handleLogin = async (e) => {
        setLoading(true)
        setOptionText('')
        setShowEmailError(false)
        setShowPasswordError(false)
        setErrorMessage(null)

        if (validEmail) {
            if (validPassword) {
                const resp = await login(email, password)
                if (resp) {
                    if (resp['detail']) {
                        // show errors
                        setErrorMessage(resp['detail'])
                    }
                    else {
                        if (resp['token']) {
                            localStorage.setItem('apiToken', resp['token'])
                            setApiToken(resp['token'])
                        }
                        if (resp['integration']) {
                            let response = await getApiActivities(resp['token'], offset)
                            if (response['activity_data']) {
                                setActivities(response['activity_data'])
                                let nextQuery = response['next_query']
                                if (nextQuery) {
                                    setOffset(offset + 100)
                                } else {
                                    setMoreToGet(false)
                                }
                                const scrollEl = document.getElementById('mainScrollable')
                                scrollEl.scrollTo(0, 0)
                            }
                        } else {
                            if (code) {
                                setOptionText('Syncing your account with Strava...')
                                let response = await exchangeAuthCode(code, resp['token'], scope)
                                if (response['success']) {
                                    // flip a flag so we can show text to indicate that activities are being fetched, wait a sec, etc etc
                                    // then we need to get the activities
                                    setOptionText('Fetching your activities, this may take a sec...')
                                    let response = await getFirstApiActivities(resp['token'], offset)
                                    if (response['activities']) {
                                        setActivities(response["activities"])
                                        if (response['activities'].length == 100) {
                                            setOffset(offset + 100)
                                        } else  {
                                            setMoreToGet(false)
                                        }
                                    }
                                    const scrollEl = document.getElementById('mainScrollable')
                                    scrollEl.scrollTo(0, 0)
                                    setLoading(false)
                                }
                            } else {
                                setActivities(null)
                                setMoreToGet(false)
                            }
                        }
                    }
                }
            } else {
                // invalid password error
                setShowPasswordError(true)
            }
        } else {
            // invalid email error
            setShowEmailError(true)
        }
        setLoading(false)
    }

    const handleSetEmail = (e) => {
        const val = e.target.value;
        if (validateEmail(val)) {
            setValidEmail(true)
        } else {
            setValidEmail(false)
        }
        setEmail(val)
    }

    const handleSetPassword = (e) => {
        const val = e.target.value;
        if (val.length >= 4 && !validPassword) {
            setValidPassword(true)
        } else if (val.length < 4 && validPassword) {
            setValidPassword(false)
        }
        setPassword(val)
    }

    const handleToggleSignup = () => {
        const val = !toggleSignup
        setShowEmailError(false)
        setShowPasswordError(false)
        setErrorMessage(null)
        setToggleSignup(val)
    }

    return (
        <div>
            <div className='titleBox'>
                <p className='titleBoxText'>RouteViewer</p>
            </div>
            { !toggleSignup ? (
                <div className='loginContainer'>
                    {code ? (
                        <div>
                            <p className='loginScopeAuthText'>Please re-enter your credentials to complete the sync with Strava</p>
                        </div>
                    ) : null}
                    <TextInput
                        typeOption={'email'}
                        nameOption={'email'}
                        placeholderOption={'email'}
                        fieldError={'Invalid email'}
                        showFieldError={showEmailError}
                        onChangeHandlerFunc={handleSetEmail}
                        labelText={'Email'}>
                    </TextInput>
                    <TextInput 
                        typeOption={'password'}
                        nameOption={'password'}
                        placeholderOption={'password'}
                        fieldError={'Password must be at least 4 characters'}
                        showFieldError={showPasswordError}
                        onChangeHandlerFunc={handleSetPassword}
                        labelText={'Password'}>
                    </TextInput>
                    <div className='formSubmitError'>
                        <p className='formSubmitErrorText'>{errorMessage}</p>
                    </div>
                    <div className='loginButtonContainer'>
                        <div className='authButton' onClick={handleLogin}>
                            {scope ? 'Complete Sync' : 'Login'}
                        </div>
                    </div>
                    { !code ? (
                        <div>
                            <p className='cursor' onClick={handleToggleSignup}>click to sign up</p>
                        </div>
                    ): null}
                </div>
            ) : null}
           
            { toggleSignup ? (
                <div>
                    <SignupComponent loading={loading} setLoading={setLoading} handleToggleSignup={handleToggleSignup} setOptionText={setOptionText}></SignupComponent>
                </div>
            ) : null}
        </div>
        
    )
}

export default LoginComponent