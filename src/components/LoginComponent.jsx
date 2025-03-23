import { login } from '../services/api';
import { useState } from 'react';
import { useAuthProvider } from '../providers/AuthProvider';
import SignupComponent from './SignupComponent';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';
import { getApiActivities } from '../services/api';
import TextInput from './TextInput';
import { validateEmail } from '../services/utils';


const LoginComponent = ({loading, setLoading}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [toggleSignup, setToggleSignup] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [showEmailError, setShowEmailError] = useState(false)
    const [showPasswordError, setShowPasswordError] = useState(false)

    const {
        apiToken,
        setApiToken,
        setShowAuthButton,
    } = useAuthProvider();
    const {
        setActivities, 
        offset,
        setOffset,
        setMoreToGet
    } = useActivitiesProvider();

    const handleLogin = async (e) => {
        setLoading(true)
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
                        // setErrorMessage("There's an issue with your email or password")
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
                            }
                        } else {
                            setActivities(null)
                            setMoreToGet(false)
                            // setShowAuthButton(true)
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
                    <TextInput
                        typeOption={'email'}
                        nameOption={'email'}
                        placeholderOption={'email'}
                        fieldError={'Invalid email'}
                        showFieldError={showEmailError}
                        onChangeHandlerFunc={handleSetEmail}>
                    </TextInput>
                    <TextInput 
                        typeOption={'password'}
                        nameOption={'password'}
                        placeholderOption={'password'}
                        fieldError={'Password must be at least 4 characters'}
                        showFieldError={showPasswordError}
                        onChangeHandlerFunc={handleSetPassword}>
                    </TextInput>
                    <div className='formSubmitError'>
                        <p className='formSubmitErrorText'>{errorMessage}</p>
                    </div>
                    <div className='loginButtonContainer'>
                        <div className='authButton' onClick={handleLogin}>
                            Login
                        </div>
                    </div>
                    <div >
                        <p className='cursor' onClick={handleToggleSignup}>click to sign up</p>
                    </div>
                </div>
            ) : null}
           
            { toggleSignup ? (
                <div>
                    <SignupComponent loading={loading} setLoading={setLoading} handleToggleSignup={handleToggleSignup}></SignupComponent>
                </div>
            ) : null}
        </div>
        
    )
}

export default LoginComponent