import { login } from '../services/api';
import { useState } from 'react';
import { useAuthProvider } from '../providers/AuthProvider';
import SignupComponent from './SignupComponent';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';
import { getApiActivities } from '../services/api';
import TextInput from './TextInput';


const LoginComponent = ({loading, setLoading}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [toggleSignup, setToggleSignup] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

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
        const data = {
            'email': email,
            'password': password
        }
        
        const resp = await login(email, password)
        
        if (resp) {
            localStorage.setItem('apiToken', resp['token'])
            setApiToken(resp['token'])

            if (resp['detail']) {
                // show errors
                // setErrorMessage(resp['errors']['detail'])
                setErrorMessage("There's an issue with your email or password")
            }
            else {
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
            setLoading(false)
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

    const handleToggleSignup = () => {
        const val = !toggleSignup
        setToggleSignup(val)
    }

    return (
        <div>
            { !toggleSignup ? (
                <div className='loginContainer'>
                    <TextInput
                        typeOption={'email'}
                        nameOption={'email'}
                        placeholderOption={'email'}
                        onChangeHandlerFunc={handleSetEmail}>
                    </TextInput>
                    <TextInput 
                        typeOption={'password'}
                        nameOption={'password'}
                        placeholderOption={'password'}
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