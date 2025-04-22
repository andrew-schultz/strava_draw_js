const DisabledGridSpot = ({
    position,
    option,
    dropHandler,
    dragOverHandler,
    handleTouchStart,
    onDragStart,
    onDragLeave,
}) => {
    return (
        <div 
            // draggable={(option && option.val ? option.val.on : false)}
            // draggable={false}
            className={`textOptionGridItem position${position} disabled`}
            id={`textOptionGridItem${position}`} 
            // onDrop={dropHandler} 
            // onDragOver={dragOverHandler}
            // onTouchStart={handleTouchStart}
            // onDragStart={onDragStart}
            // onDragLeave={onDragLeave}
            data-id={position}
        >
            <p data-id={position}>{option && option.val ? option.val.displayName : null}</p>
        </div>
    )
};

export default DisabledGridSpot