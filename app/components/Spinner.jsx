import { useEffect, useState } from 'react';


const Spinner = ({loading, setLoading}) => {
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