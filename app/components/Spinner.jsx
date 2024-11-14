const Spinner = ({loading}) => {
    return (
        <div>
            { loading ? (
            <div className='spinnerContainer'>
                <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div> 
            ) : (null)}
        </div>
    )
};

export default Spinner