const Spinner = ({loading, setLoading, typeOption, optionText=null}) => {
    return (
        <div className={`spinnerContainerOuter ${loading ? 'active' : null}`}>
            { loading ? (
            <div className={`spinnerContainer ${typeOption}`}>
                <div className='spinnerSubContainer'>
                    {optionText ? (<div className='spinnerOptionText'>{optionText}</div>) : null}
                    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
            </div> 
            ) : (null)}
        </div>
    )
};

export default Spinner