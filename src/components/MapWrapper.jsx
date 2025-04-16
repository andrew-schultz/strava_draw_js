import dynamic from 'next/dynamic';

const MapWrapper = ({
    polylines, 
    activity, 
    activityStreams, 
    layout,
}) => {
    const MapComponent = dynamic(() => import('./LeafletMap'), {
        ssr: false,
    });

    const MapComponent2 = dynamic(() => import('./LeafletMap2'), {
        ssr: false,
    });

    return (
        <div>
            {activityStreams && layout === '2' ? (
                <MapComponent2 
                    polylines={polylines} 
                    activity={activity}
                    data={activityStreams['altitude']['data']} 
                    xData={activityStreams['distance']['data']}
                >
                </MapComponent2>
            ) : (
                <MapComponent
                    polylines={polylines} 
                    activity={activity}
                />
            )}
            
        </div>
    )
}

export default MapWrapper;