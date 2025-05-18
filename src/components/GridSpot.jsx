const GridSpot = ({
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
            draggable={true}
            className={`textOptionGridItem position${position}`}
            id={`textOptionGridItem${position}`} 
            onDrop={dropHandler} 
            onDragOver={dragOverHandler}
            onTouchStart={handleTouchStart}
            onDragStart={onDragStart}
            onDragLeave={onDragLeave}
            data-id={position}
            data-active={1}
        >
            <p data-active={1} data-id={position}>{option && option.val ? option.val.displayName : null}</p>
        </div>
    )
};

export default GridSpot