const DisabledGridSpot = ({
    position,
    option,
}) => {
    return (
        <div 
            className={`textOptionGridItem position${position} disabled`}
            id={`textOptionGridItem${position}`} 
            data-id={position}
        >
            <p data-id={position}>{option && option.val ? option.val.displayName : null}</p>
        </div>
    )
};

export default DisabledGridSpot