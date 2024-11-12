
import { useEffect, useState } from 'react';

const HelpModal = () => {
    const [showHelpModal, setShowHelpModal] = useState(false);    
    const toggleHelpModal = () => {
        setShowHelpModal(!showHelpModal) 
        // showHelpModal = !showHelpModal;
        // console.log(showHelpModal)
    }

    return (   
        <div>
            <div className={`mapButton right ${showHelpModal ? ('selected') : null }`} onClick={toggleHelpModal}>help</div>
            {showHelpModal ? (
                <div className='helpModalContainer'>
                    <div className='helpModalContent'>
                        <p className='closeModal' onClick={toggleHelpModal}>x</p>
                        <p>Long press / right click the image to save. Only the map lines will be saved on a transparent background.</p>
                    </div>
                </div>
            ) : (null)}
        </div>
    )
};

export default HelpModal