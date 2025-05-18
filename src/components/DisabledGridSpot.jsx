const DisabledGridSpot = ({
    position,
    option,
}) => {
    return (
        <div 
            className={`textOptionGridItem position${position} disabled`}
            id={`textOptionGridItem${position}`} 
            data-id={position}
            data-active={0}
        >
            <p data-active={0} data-id={position}>{option && option.val ? option.val.displayName : null}</p>
        </div>
    )
};

export default DisabledGridSpot