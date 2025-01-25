const GridSpot = ({
    position,
    option,
    dropHandler,
    dragOverHandler,
    handleTouchStart,
}) => {
    return (
        <div 
            draggable={(option && option.val ? option.val.on : false)}
            className='textOptionGridItem' 
            id={`textOptionGridItem${position}`} 
            onDrop={dropHandler} 
            onDragOver={dragOverHandler}
            onTouchStart={handleTouchStart}
            data-id={position}
        >
            <p data-id={position}>{option && option.val ? option.val.displayName : null}</p>
        </div>
    )
};

export default GridSpot