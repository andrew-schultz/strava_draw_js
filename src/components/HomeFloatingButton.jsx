
const HomeFloatingButton = ({textVal, buttonClickHandler, buttonClasses}) => {
    return (
        <div className={`homeFloatingButton buttonShadowFloat ${buttonClasses}`} onClick={buttonClickHandler}>
            <div className={`homeFloatingButtonInner`}>
                <p className={`homeButtonText ${buttonClasses}`}>{textVal}</p>
            </div>
        </div>
    )
}

export default HomeFloatingButton