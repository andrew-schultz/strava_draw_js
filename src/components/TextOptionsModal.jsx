
import { useEffect, useState } from 'react';
import TextGrid from './TextGrid';
import { useTextGridProvider } from '../providers/TextGridProvider';

const TextOptionsModal = ({
    activity,
}) => {
    const [showTextOptionsModal, setShowTextOptionsModal] = useState(false);
    const {
        setDrawNow,
        showDuration,
        showDistance,
        showElevGain,
        showPace,
        showAvgPower,
        showAvgSpeed,
        showWorkDone,
        setShowDuration,
        setShowDistance,
        setShowElevGain,
        setShowPace,
        setShowAvgPower,
        setShowAvgSpeed,
        setShowWorkDone,
        rawLineColor,
        lineColor,
        handleSetColor,
        rawShowText,
        showText,
        handleShowText,
    } = useTextGridProvider();

    const toggleTextOptionsModal = () => {
        setShowTextOptionsModal(!showTextOptionsModal);
        // const body = document.getElementsByTagName('body')[0];
        if (!showTextOptionsModal) {
            // modal is open, disable scroll
            // body.classList.add('noscroll');
        } else {
            // modal is closed, enable scroll
            // body.classList.remove('noscroll');
            setDrawNow(true)
        }
    }

    return (   
        <div>
            <div className={`mapButton right ${showTextOptionsModal ? ('selected') : null }`} onClick={toggleTextOptionsModal}>Options</div>
            {showTextOptionsModal ? (
                <div>
                    <div className='textOptionModalOuter top'>
                    </div>
                    <div className='textOptionsModalContainer'>
                        <div className='textOptionsModalContent'>
                            <p className='closeModal' onClick={toggleTextOptionsModal}>Apply</p>
                            <div className="slidersContainerTextOption">
                                <div className='textOptionsTitle'>
                                    {/* <p>Options</p> */}
                                </div>
                                <div className="slidersContainerTextOptionInner" key={`lineColorSliderContainer1`} >
                                    <div className="textOptionLabel">
                                        <p>{'Line Color'}</p>
                                    </div>
                                    <div className="textOptionInput">
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="2" 
                                            value={rawLineColor} 
                                            className={`textOptionInputActual slider ${lineColor == 'black' ? ('on') : ('off')}`} 
                                            id="lineColorSelector" 
                                            onChange={(e) => handleSetColor(e)}
                                        ></input>
                                    </div>
                                </div>
                                {/* <div className="slidersContainerTextOptionInner" key={`showTextSliderContainer1`}>
                                    <div className="textOptionLabel">
                                        <p>{'Show Text'}</p>
                                    </div>
                                    <div className="textOptionInput">
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="2" 
                                            value={rawShowText} 
                                            className={`textOptionInputActual slider ${showText ? ('on') : ('off')}`} 
                                            id="showTextSelector" 
                                            onChange={(e) => handleShowText(e)}
                                        ></input>
                                    </div>
                                </div> */}
                                <div className='optionsDivider'></div>
                                {/* <div className='textOptionsTitle'>
                                    <p>Stat Options</p>
                                </div> */}
                                <div className='sliderContainerRow'>
                                    <div className='sliderContainerRowItem'>
                                        <div className="slidersContainerTextOptionInnerGrid"  key={`durationSliderContainer1`}>
                                            <div className="textOptionLabelGrid" >
                                                <p>{'Duration'}</p>
                                            </div>
                                            <div className="textOptionInputGrid">
                                                <input 
                                                    type="range"
                                                    min="1"
                                                    max="2"
                                                    value={showDuration ? '2' : '1'}
                                                    className={`textOptionInputActual slider ${showDuration ? ('on') : ('off')}`} 
                                                    id={`${'duration'}Selector`} 
                                                    onChange={(e) => setShowDuration(e.target.value == '1' ? false : true)}
                                                ></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='sliderContainerRowItem'>
                                        <div className="slidersContainerTextOptionInnerGrid" id="dragOptionDistance"  key={`distanceSliderContainer1`}>
                                            <div className="textOptionLabelGrid">
                                                <p>{'Distance'}</p>
                                            </div>
                                            <div className="textOptionInputGrid">
                                                <input 
                                                    type="range"
                                                    min="1"
                                                    max="2"
                                                    value={showDistance ? '2' : '1'}
                                                    className={`textOptionInputActual slider ${showDistance ? ('on') : ('off')}`} 
                                                    id={`${'distance'}Selector`} 
                                                    onChange={(e) => setShowDistance(e.target.value == '1' ? false : true)}
                                                ></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='sliderContainerRow'>
                                    <div className="slidersContainerTextOptionInnerGrid" id="dragOptionElevGain"  key={`elevGainSliderContainer1`}>
                                        <div className="textOptionLabelGrid">
                                            <p>{'Elev. Gain'}</p>
                                        </div>
                                        <div className="textOptionInputGrid">
                                            <input 
                                                type="range"
                                                min="1"
                                                max="2"
                                                value={showElevGain ? '2' : '1'}
                                                className={`textOptionInputActual slider ${showElevGain ? ('on') : ('off')}`} 
                                                id={`${'elevGain'}Selector`} 
                                                onChange={(e) => setShowElevGain(e.target.value == '1' ? false : true)}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="slidersContainerTextOptionInnerGrid" id="dragOptionPace"  key={`paceSliderContainer1`}>
                                        <div className="textOptionLabelGrid">
                                            <p>{'Pace'}</p>
                                        </div>
                                        <div className="textOptionInputGrid">
                                            <input 
                                                type="range"
                                                min="1"
                                                max="2"
                                                value={showPace ? '2' : '1'}
                                                className={`textOptionInputActual slider ${showPace ? ('on') : ('off')}`} 
                                                id={`${'pace'}Selector`} 
                                                onChange={(e) => setShowPace(e.target.value == '1' ? false : true)}
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                                <div className='sliderContainerRow'>
                                    <div className="slidersContainerTextOptionInnerGrid" id="dragOptionAvgWatts"  key={`avgPowerSliderContainer1`}>
                                        <div className="textOptionLabelGrid">
                                            {/* <p className={`${activity.average_watts ? 'active' : 'disabledLabel'}`}>{'Avg Power'}</p> */}
                                            <p className='active'>{'Avg Power'}</p>
                                        </div>
                                        <div className="textOptionInputGrid">
                                            <input 
                                                type="range"
                                                min="1"
                                                max="2"
                                                // disabled={activity.average_watts ? false : true}
                                                value={showAvgPower ? '2' : '1'}
                                                className={`textOptionInputActual slider ${showAvgPower ? ('on') : ('off')}`}
                                                // className={`textOptionInputActual slider ${showAvgPower ? ('on') : ('off')} ${activity.kilojoules ? 'active' : 'disabled'}`} 
                                                id={`${'avgPower'}Selector`} 
                                                onChange={(e) => setShowAvgPower(e.target.value == '1' ? false : true)}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="slidersContainerTextOptionInnerGrid" id="dragOptionAvgSpeed"  key={`avgSpeedSliderContainer1`}>
                                        <div className="textOptionLabelGrid">
                                            <p>{'Avg Speed'}</p>
                                        </div>
                                        <div className="textOptionInputGrid">
                                            <input 
                                                type="range"
                                                min="1"
                                                max="2"
                                                value={showAvgSpeed ? '2' : '1'}
                                                className={`textOptionInputActual slider ${showAvgSpeed ? ('on') : ('off')}`} 
                                                id={`${'avgSpeed'}Selector`} 
                                                onChange={(e) => setShowAvgSpeed(e.target.value == '1' ? false : true)}
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                                <div className='sliderContainerRow'>
                                    <div className="slidersContainerTextOptionInnerGrid" id="dragOptionWorkDone"  key={`workDoneSliderContainer1`}>
                                        <div className="textOptionLabelGrid">
                                            {/* <p className={`${activity.kilojoules ? 'active' : 'disabledLabel'}`}>{'Work Done'}</p> */}
                                            <p className='active'>{'Work Done'}</p>
                                        </div>
                                        <div className="textOptionInputGrid">
                                            <input 
                                                type="range"
                                                // disabled={activity.kilojoules ? false : true}
                                                min="1"
                                                max="2"
                                                value={showWorkDone ? '2' : '1'}
                                                className={`textOptionInputActual slider ${showWorkDone ? ('on') : ('off')}`} 
                                                // className={`textOptionInputActual slider ${showWorkDone ? ('on') : ('off')} ${activity.kilojoules ? 'active' : 'disabled'}`} 
                                                id={`${'workDone'}Selector`} 
                                                onChange={(e) => setShowWorkDone(e.target.value == '1' ? false : true)}
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* <div className='optionsDivider'></div> */}
                            <TextGrid
                                activity={activity}
                            >
                            </TextGrid>
                        </div>
                    </div>
                </div>
            ) : (null)}
        </div>
    )
};

export default TextOptionsModal