
import { useState } from 'react';

const HelpModal = () => {
    const [showHelpModal, setShowHelpModal] = useState(false);    
    const toggleHelpModal = () => {
        setShowHelpModal(!showHelpModal) 
    }

    return (   
        <div>
            <div className={`mapButton bottom right ${showHelpModal ? ('selected') : null }`} onClick={toggleHelpModal}>help</div>
            {showHelpModal ? (
                <div>
                    <div className='helpModalContainer'>
                        <div className='helpModalContent'>
                            <p className='closeModal' onClick={toggleHelpModal}>x</p>
                            <div className='helpModalContentMain'>
                                <p>Long press / right click the image to save. Only the map lines and stat text will be saved on a transparent background.</p>
                                <p className='helpModalContentP'>Under the <span className='helpModalContentPSpan'>Options:</span></p>
                                <p className='helpModalContentP'>Change the line & text color.</p>
                                <p className='helpModalContentP'>Select up to 6 stat's to display.</p>
                                <p className='helpModalContentP'>Drag and drop stat's on the grid to arrange.</p>
                                
                            </div>
                        </div>
                    </div>
                    <div className='textOptionModalOuter'></div>
                </div>
            ) : (null)}
        </div>
    )
};

export default HelpModal