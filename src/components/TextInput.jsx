import { useState } from 'react';

const TextInput = ({
    typeOption, 
    nameOption, 
    placeholderOption,
    fieldError,
    showFieldError,
    onChangeHandlerFunc,
    labelText,
}) => {
    const [errorMessage, setErrorMessage] = useState()
    const localHandleSetPassword = async (e) => {
        const response = await onChangeHandlerFunc(e)
        if (response) {
            const errors = response['errors'] ? response['errors'] : false
            if (errors) {
                setErrorMessage(errors['detail'])
            }
        }
    }

    return (
        <div className='loginInputContainer'>
            <div className='loginInputSubContainer'>
                <div className='loginInputLabel'>
                    <p className='loginInputLabelP'>{labelText}</p>
                </div>
                <input className='loginInput' placeholder={placeholderOption} name={nameOption} type={typeOption} onChange={localHandleSetPassword}></input>
            </div>
            {
                showFieldError ? ( 
                <div className='loginInputError'>
                    <p className='formInputError'>{fieldError}</p>
                </div>) : null
            }
        </div>
    )
}

export default TextInput;