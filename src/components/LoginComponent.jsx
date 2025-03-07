import { login } from '../services/api';
import { useState } from 'react';
import { useAuthProvider } from '../providers/AuthProvider';
import SignupComponent from './SignupComponent';
import { useActivitiesProvider } from '../providers/ActivitiesProvider';
import { getApiActivities } from '../services/api';


const LoginComponent = ({loading, setLoading}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [toggleSignup, setToggleSignup] = useState(false)

    const {
        apiToken,
        setApiToken,
    } = useAuthProvider();
    const {setActivities} = useActivitiesProvider();

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
            let response = await getApiActivities(resp['token'])
            setActivities(response['activity_data'])
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
                    <div className='loginInputContainer'>
                        <input className='loginInput' placeholder="email" name='email' type='email' onChange={handleSetEmail}></input>
                    </div>
                    <div className='loginInputContainer'>
                        <input className='loginInput' placeholder="password" name='password' type='password' onChange={handleSetPassword}></input>
                    </div>
                    <div className='loginButtonContainer'>
                        <div className='authButton' onClick={handleLogin}>
                            Login
                        </div>
                    </div>
                    <div >
                        <p onClick={handleToggleSignup}>click to sign up</p>
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