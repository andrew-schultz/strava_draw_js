import { signup } from '../services/api';
import { useState } from 'react';
import { useAuthProvider } from '../providers/AuthProvider';
import { validateEmail } from '../services/utils';
import TextInput from './TextInput';
import cookieCutter from "@boiseitguru/cookie-cutter";


const SignupComponent = ({loading, setLoading, handleToggleSignup, setOptionText}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [validPasswordConfirm, setValidPasswordConfirm] = useState(false)
    const [showEmailError, setShowEmailError] = useState(false)
    const [showPasswordError, setShowPasswordError] = useState(false)
    const [showPasswordConfirmError, setShowPasswordConfirmError] = useState(false)

    const {
        setApiToken,
        setShowAuthButton,
    } = useAuthProvider();

    const handleSignup = async (e) => {
        setLoading(true)
        setOptionText('Setting up your account...')
        const data = {
            'email': email,
            'password': password,
            'password_confirm': passwordConfirm,
        }
        setShowEmailError(false)
        setShowPasswordError(false)
        setShowPasswordConfirmError(false)
        setErrorMessage(null)

        if (validEmail) {
            if (validPassword) {
                if (validPasswordConfirm) {
                    const resp = await signup(email, password, passwordConfirm)
                        
                    if (resp) {
                        if (resp['detail']) {
                            // show errors
                            setErrorMessage(resp['detail'])
                            setShowAuthButton(false)
                        } else if (resp['email'] || resp['password'] || resp['password_confirm']) {
                            // theres validation errors for one of these fields
                            // in theory we shouldn't ever get here 
                            // gotta be a better way to show a validation error than to add a conditional for each one again
                        } else {
                            localStorage.setItem('apiToken', resp['token'])

                            let now = new Date();
                            let timeToExpire = now.getTime() + (60 * 60 * 1000); // Cookie expires in 1 hour
                            now.setTime(timeToExpire);

                            cookieCutter.set('selectedActivity', null);
                            cookieCutter.set('accessToken', resp['token'], { expires: now.toUTCString() });
                            cookieCutter.set('apiToken', resp['token'], { expires: now.toUTCString() });
                            setApiToken(resp['token'])

                            if (resp['integration']) {
                                // get the activities
                            }
                            else {
                                setShowAuthButton(true)
                            }
                        }
                    }
                } else {
                    // invalid password confirm error
                    setShowPasswordConfirmError(true)
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
   
    const handleSetPasswordConfirm = (e) => {
        const val = e.target.value;
        if (val.length >= 4 && !validPasswordConfirm) {
            setValidPasswordConfirm(true)
        } else if (val.length < 4 && validPasswordConfirm) {
            setValidPasswordConfirm(false)
        }
        setPasswordConfirm(val)
    }

    return (
        <div id='SignupContainer' className='loginContainer'>
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
            <TextInput 
                typeOption={'password'}
                nameOption={'passwordConfirm'}
                placeholderOption={'confirm password'}
                fieldError={'Password must be at least 4 characters'}
                showFieldError={showPasswordConfirmError}
                onChangeHandlerFunc={handleSetPasswordConfirm}
                labelText={'Confirm Password'}>
            </TextInput>
            <div className='formSubmitError'>
                <p className='formSubmitErrorText'>{errorMessage}</p>
            </div>
            <div className='loginButtonContainer'>
                <div className='authButton' onClick={handleSignup}>
                    Sign Up
                </div>
            </div>
            <div >
                <p className="cursor" onClick={handleToggleSignup}>click to log in</p>
            </div>
        </div>
    )
}

export default SignupComponent