import GridSpot from './GridSpot';
import DisabledGridSpot from './DisabledGridSpot';
import { useTextGridProvider } from '../providers/TextGridProvider'


const TextGrid2 = ({
    activity,
}) => {
    let lastTapTime = 0;
    let gridElements = [];

    const {
        grid,
        swapGridSpot,
    } = useTextGridProvider();

    const dragStartHandler = (event) => {
        event.dataTransfer.setData("gridOption", event.target.dataset.id);
        event.dataTransfer.effectAllowed = "move";
    }

    const dropHandler = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("gridOption");
        const destinationId = event.target.dataset.id
        swapGridSpot(data, destinationId)
        const element = event.target;
        element.classList.remove('dragOver')
    }

    const dragOverHandler = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        const element = event.target;
        let classList = element.classList;
        if ('dragOver' in classList) {
            // good
        } else {
            element.classList.add('dragOver')
        }
    }

    const dragOverLeaveHandler = (event) => {
        event.preventDefault();
        const element = event.target;
        element.classList.remove('dragOver')
    }

    const handleTouchStart = (event) => {
        // event.preventDefault();
        // const body = document.getElementsByTagName('body')[0];
        // body.classList.add('noscroll');
        console.log('starting')

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected!
            console.log('Double tap!');
            event.preventDefault(); // Prevent default behavior 
        }

        lastTapTime = currentTime;

        // event.preventDefault();
        const grid1 = document.getElementById('textOptionGridItem1')
        const grid2 = document.getElementById('textOptionGridItem2')
        const grid3 = document.getElementById('textOptionGridItem3')
        const grid4 = document.getElementById('textOptionGridItem4')
        const grid5 = document.getElementById('textOptionGridItem5')
        const grid6 = document.getElementById('textOptionGridItem6')

        gridElements = [
            {el: grid1, rect: grid1.getBoundingClientRect()},
            {el: grid2, rect: grid2.getBoundingClientRect()},
            {el: grid3, rect: grid3.getBoundingClientRect()},
            {el: grid4, rect: grid4.getBoundingClientRect()},
            {el: grid5, rect: grid5.getBoundingClientRect()},
            {el: grid6, rect: grid6.getBoundingClientRect()},
        ]

        const handleTouchMove = (event) => {
            // event.preventDefault();
            const body = document.getElementsByTagName('body')[0];
            // body.classList.add('noscroll');
            const touch = event.touches[0];
            gridElements.forEach((element) => {
                let classList = element.el.classList;
                if (
                    touch.clientX >= element.rect.left &&
                    touch.clientX <= element.rect.right &&
                    touch.clientY >= element.rect.top &&
                    touch.clientY <= element.rect.bottom
                ) {
                    // Touch is inside the element
                    // Handle the drag event here
                    if ('dragOver' in classList) {
                        // good
                    } else {
                        element.el.classList.add('dragOver')
                    }
                } else {
                    element.el.classList.remove('dragOver')
                }
            })
        }
    
        const handleTouchEnd = (event) => {
            // const body = document.getElementsByTagName('body')[0];
            // body.classList.remove('noscroll');
            const touch = event.changedTouches[0];
            const originId = event.target.dataset.id
            gridElements.forEach((element) => {
                if (
                    touch.clientX >= element.rect.left &&
                    touch.clientX <= element.rect.right &&
                    touch.clientY >= element.rect.top &&
                    touch.clientY <= element.rect.bottom
                ) {
                    // Touch is inside the element
                    // Handle the drag event here 
                    const destinationId = element.el.dataset.id
                    swapGridSpot(originId, destinationId)
                }

                element.el.classList.remove('dragOver')
            })
            
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }

        // document.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }

    return (
        <div className='textOptionsOrderGrid'>
            <div className='textOptionsOrderGridRow'>
                {
                    grid[1].val ? (
                        <GridSpot
                            position={1}
                            option={grid[1]} 
                            dropHandler={dropHandler} 
                            dragOverHandler={dragOverHandler}
                            handleTouchStart={handleTouchStart}
                            onDragStart={dragStartHandler}
                            onDragLeave={dragOverLeaveHandler}
                        ></GridSpot>
                    ) : (
                        <DisabledGridSpot 
                            position={1}
                            option={grid[1]} 
                        />
                    )
                }
                {
                    grid[2].val ? (
                        <GridSpot
                            position={2}
                            option={grid[2]} 
                            dropHandler={dropHandler} 
                            dragOverHandler={dragOverHandler}
                            handleTouchStart={handleTouchStart}
                            onDragStart={dragStartHandler}
                            onDragLeave={dragOverLeaveHandler}
                        ></GridSpot>
                    ) : (
                        <DisabledGridSpot 
                            position={2}
                            option={grid[2]} 
                        />
                    )
                }
                {
                    grid[3].val ? (
                        <GridSpot
                            position={3}
                            option={grid[3]}
                            dropHandler={dropHandler} 
                            dragOverHandler={dragOverHandler}
                            handleTouchStart={handleTouchStart}
                            onDragStart={dragStartHandler}
                            onDragLeave={dragOverLeaveHandler}
                        ></GridSpot>
                    ) : (
                        <DisabledGridSpot 
                            position={3}
                            option={grid[3]} 
                        />
                    )
                }
            </div>
            <div className='textOptionsOrderGridRow'>
                {
                    grid[4].val ? (
                        <GridSpot
                            position={4}
                            option={grid[4]} 
                            dropHandler={dropHandler} 
                            dragOverHandler={dragOverHandler}
                            handleTouchStart={handleTouchStart}
                            onDragStart={dragStartHandler}
                            onDragLeave={dragOverLeaveHandler}
                        ></GridSpot>
                    ) : (
                        <DisabledGridSpot 
                            position={4}
                            option={grid[4]} 
                        />
                    )
                }
                {
                    grid[5].val ? (
                        <GridSpot
                            position={5}
                            option={grid[5]} 
                            dropHandler={dropHandler} 
                            dragOverHandler={dragOverHandler}
                            handleTouchStart={handleTouchStart}
                            onDragStart={dragStartHandler}
                            onDragLeave={dragOverLeaveHandler}
                        ></GridSpot>
                    ) : (
                        <DisabledGridSpot 
                            position={5}
                            option={grid[5]} 
                        />
                    )
                }
                {
                    grid[6].val ? (
                        <GridSpot
                            position={6}
                            option={grid[6]} 
                            dropHandler={dropHandler} 
                            dragOverHandler={dragOverHandler}
                            handleTouchStart={handleTouchStart}
                            onDragStart={dragStartHandler}
                            onDragLeave={dragOverLeaveHandler}
                        ></GridSpot>
                    ) : (
                        <DisabledGridSpot 
                            position={6}
                            option={grid[6]} 
                        />
                    )
                }
                
            </div>
        </div>    
    )
}

export default TextGrid2