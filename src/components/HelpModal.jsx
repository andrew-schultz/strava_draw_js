
import { useState } from 'react';

const HelpModal = () => {
    const [showHelpModal, setShowHelpModal] = useState(false);    
    const toggleHelpModal = () => {
        setShowHelpModal(!showHelpModal) 
    }

    return (   
        <div onClick={toggleHelpModal}>
            <div className={`mapButton buttonShadowFloat help bottom right ${showHelpModal ? ('selected shadowOff') : null }`} onClick={toggleHelpModal}>{showHelpModal ? 'Close' : 'Help'}</div>
            {showHelpModal ? (
                <div>
                    <div className='helpModalContainer'>
                        <div className='helpModalContent buttonShadowFloatOptions'>
                            <div className='helpModalContentMain'>
                                <p className='helpModalContentP'><span className='helpModalContentPSpan'>How to Download / Save</span></p>
                                <p className='helpModalContentPWide'>Long press / right click the image to save. Only the map lines and stat text will be saved on a transparent background.</p>
                                <br></br>
                                <p className='helpModalContentP'>Under the <span className='helpModalContentPSpan'>Options:</span></p>
                                <div className='helpModalContentSubDiv'>
                                    <p className='helpModalContentP'>- Toggle between 2 layouts.</p>
                                    <p className='helpModalContentP'>- Change the line & text color.</p>
                                    <p className='helpModalContentP'>- Toggle between km and miles.</p>
                                    <p className='helpModalContentP'>- Select up to 6 stat's to display.</p>
                                    <p className='helpModalContentP'>- Drag and drop stat's on the grid to arrange.</p>
                                </div> 
                                <br></br>
                                <p className='helpModalContentP'><span className='helpModalContentPSpan'>Layout Options:</span></p>
                                <div className=''>
                                    <p className='helpModalContentPWide'><span className='helpModalContentPSpan'>Option 1:</span> A simple representation of the your route over the selected stat's.</p>
                                    <p className='helpModalContentPWide'><span className='helpModalContentPSpan'>Option 2:</span> A more stylized layout that also contains a graph depicting the routes elevation profile.</p>
                                    <p className='helpModalContentPWide'><span className='helpModalContentPSpan'>Note:</span> Empty grid spots are ignored when Layout Option 2 is selected.</p>
                                </div>
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