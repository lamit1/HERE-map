import React, { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';
import DirectionBox from "./DirectionBox"
import SearchBar from './SearchBox';
import SideBar from './SideBar';


export const MapContext = React.createContext(null)
export const SearchContext = React.createContext(null)
export const RouterServiceContext = React.createContext(null)
export const LocationContext = React.createContext(null)


function HEREMap(props) {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);
    const { apikey } = props;
    const [center, setCenter] = useState({
        lat: null,
        lng: null,
    });

    const [mapInitialized, setMapInitialized] = useState(false);

    async function getLocation() {
        try {
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => resolve(position),
                        (error) => reject(error),
                        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
                    );
                });

                // Use the state callback function to log the updated state
                setCenter(prevState => {
                    console.log(prevState); // This will log the previous state
                    return {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });

                console.log(center); // This may log the previous state, not the updated state
            } else {
                throw new Error("Geolocation is not supported by your browser.");
            }
        } catch (error) {
            console.error("Error getting location:", error);
        }
    }


    useEffect(() => {
        const initializeMap = async () => {
            try {
                let initialCenter = center;

                if (!map.current && !mapInitialized) {
                    platform.current = new H.service.Platform({ apikey });
                    const rasterTileService = platform.current.getRasterTileService({
                        queryParams: {
                            style: "explore.day",
                            size: 512,
                        },
                    });

                    platform.current.searchService = platform.current.getSearchService();
                    platform.current.routerService = platform.current.getRoutingService(null, 8);

                    const rasterTileProvider = new H.service.rasterTile.Provider(rasterTileService);
                    const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

                    const newMap = new H.Map(mapRef.current, rasterTileLayer, {
                        pixelRatio: window.devicePixelRatio,
                        center: initialCenter,
                        zoom: 20,
                    });

                    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

                    map.current = newMap;
                    // Add resize to window
                    window.addEventListener('resize', () => map.current.getViewPort().resize());
                    setMapInitialized(true);
                } else if (map.current) {
                    // Update the center of the map whenever the state changes
                    map.current.setCenter(initialCenter);
                }

                if (!center.lat || !center.lng) {
                    // Fetch user's current position if center coordinates are not available
                    await getLocation();
                }


            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };


        initializeMap();
    }, [apikey, center, mapInitialized]);

    return <div>
        <div className=" w-screen h-screen" ref={mapRef} />
        <SearchContext.Provider value={{ service: platform.current?.searchService }}>
            <MapContext.Provider value={{ map: map.current }}>
                <RouterServiceContext.Provider value={{ routing: platform.current?.routerService }}>
                    <LocationContext.Provider value={{ userLocation: center }}>
                        <SideBar/>
                    </LocationContext.Provider>
                </RouterServiceContext.Provider>
            </MapContext.Provider>
        </SearchContext.Provider>
    </div>

}

export default HEREMap;
