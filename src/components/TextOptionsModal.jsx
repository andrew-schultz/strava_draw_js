
import { useEffect, useState } from 'react';

const TextOptionsModal = ({
    showDuration,
    handleShowDuration,
    showDistance,
    handleShowDistance,
    showElevGain,
    handleShowElevGain,
    showPace,
    handleShowPace,
    showAvgPower,
    handleShowAvgPower,
    showAvgSpeed,
    handleShowAvgSpeed,
    showCalories,
    handleShowCalories,
    rawLineColor,
    lineColor,
    handleSetColor,
    rawShowText,
    showText,
    handleShowText,
}) => {
    const [showTextOptionsModal, setShowTextOptionsModal] = useState(false);
    // const [internalTextOptions, setInternalTextOptions] = useState();

    const toggleTextOptionsModal = () => {
        setShowTextOptionsModal(!showTextOptionsModal) 
    }

    // useEffect(() => {
    //     // debugger

    //     setInternalTextOptions(textOptions)
    // }, [textOptions])

    // useEffect(() => {
    //     // debugger
    // }, [internalTextOptions])
    // // console.log(textOptions)

    // const internalHandleToggleTextField = (e, key) => {
    //     handleToggleTextField(e, key)
    //     const rawVal = e.target.value;
    //     // // setRawShowText(rawVal)
    //     console.log('before', internalTextOptions)
    //     if (rawVal === '1') {
    //         internalTextOptions[key] = false
    //         setInternalTextOptions(internalTextOptions)
    //         console.log('after', internalTextOptions)

    //     } else if (rawVal === '2') {
    //         internalTextOptions[key] = true
    //         setInternalTextOptions(internalTextOptions)
    //         console.log('after', internalTextOptions)
    //     }
    // }


    return (   
        <div>
            <div className={`mapButton right ${showTextOptionsModal ? ('selected') : null }`} onClick={toggleTextOptionsModal}>Options</div>
            {showTextOptionsModal ? (
                <div className='textOptionsModalContainer'>
                    <div className='textOptionsModalContent'>
                        <p className='closeModal' onClick={toggleTextOptionsModal}>x</p>
                        <div className="slidersContainerTextOption">
                            <div className="slidersContainerTextOptionInner" key={`lineColorSliderContainer1`}>
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
                            <div className="slidersContainerTextOptionInner" key={`showTextSliderContainer1`}>
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
                            </div>
                            <br></br>
                            {/* {Object.keys(internalTextOptions).map(key => {
                                return (
                                    <div className="slidersContainerTextOptionInner" key={`${key}SliderContainer`}>
                                        <div className="textOptionLabel">
                                            <p>{key}</p>
                                        </div>
                                        <div className="textOptionInput">
                                            <p>{internalTextOptions[key] ? '2' : '1'}</p>
                                            <input 
                                                type="range"
                                                min="1" 
                                                max="2" 
                                                value={internalTextOptions[key] ? '2' : '1'} 
                                                className={`textOptionInputActual slider ${internalTextOptions[key] ? ('on') : ('off')}`} 
                                                id={`${key}Selector`} 
                                                onChange={(e) => internalHandleToggleTextField(e, key)}
                                            ></input>
                                        </div>
                                    </div>
                                )
                            })} */}
                            <div className="slidersContainerTextOptionInner" key={`durationSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Duration'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showDuration ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showDuration ? ('on') : ('off')}`} 
                                        id={`${'duration'}Selector`} 
                                        onChange={(e) => handleShowDuration(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                            <div className="slidersContainerTextOptionInner" key={`distanceSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Distance'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showDistance ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showDistance ? ('on') : ('off')}`} 
                                        id={`${'distance'}Selector`} 
                                        onChange={(e) => handleShowDistance(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                            <div className="slidersContainerTextOptionInner" key={`elevGainSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Elev. Gain'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showElevGain ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showElevGain ? ('on') : ('off')}`} 
                                        id={`${'elevGain'}Selector`} 
                                        onChange={(e) => handleShowElevGain(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                            <div className="slidersContainerTextOptionInner" key={`paceSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Pace'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showPace ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showPace ? ('on') : ('off')}`} 
                                        id={`${'pace'}Selector`} 
                                        onChange={(e) => handleShowPace(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                            <div className="slidersContainerTextOptionInner" key={`avgPowerSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Avg Power'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showAvgPower ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showAvgPower ? ('on') : ('off')}`} 
                                        id={`${'avgPower'}Selector`} 
                                        onChange={(e) => handleShowAvgPower(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                            <div className="slidersContainerTextOptionInner" key={`avgSpeedSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Avg Speed'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showAvgSpeed ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showAvgSpeed ? ('on') : ('off')}`} 
                                        id={`${'avgSpeed'}Selector`} 
                                        onChange={(e) => handleShowAvgSpeed(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                            <div className="slidersContainerTextOptionInner" key={`caloriesSliderContainer1`}>
                                <div className="textOptionLabel">
                                    <p>{'Calories'}</p>
                                </div>
                                <div className="textOptionInput">
                                    <input 
                                        type="range"
                                        min="1"
                                        max="2"
                                        value={showCalories ? '2' : '1'}
                                        className={`textOptionInputActual slider ${showCalories ? ('on') : ('off')}`} 
                                        id={`${'calories'}Selector`} 
                                        onChange={(e) => handleShowCalories(e.target.value == '1' ? false : true)}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (null)}
        </div>
    )
};

export default TextOptionsModal