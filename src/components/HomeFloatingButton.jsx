
const HomeFloatingButton = ({textVal, buttonClickHandler}) => {
    return (
        <div className='homeFloatingButton buttonShadowFloat' onClick={buttonClickHandler}>
            <p className='homeButtonText'>{textVal}</p>
        </div>
    )
}

export default HomeFloatingButton