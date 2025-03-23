const Spinner = ({loading, setLoading, typeOption}) => {
    return (
        <div>
            { loading ? (
            <div className={`spinnerContainer ${typeOption}`}>
                <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div> 
            ) : (null)}
        </div>
    )
};

export default Spinner