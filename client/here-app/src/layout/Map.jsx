import React, { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';
import SideBar from './SideBar';


export const MapContext = React.createContext(null)
export const SearchContext = React.createContext(null)
export const RouterServiceContext = React.createContext(null)
export const LocationContext = React.createContext(null)
export const PlaceServiceContext = React.createContext(null)


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
        // try {
        //     if (navigator.geolocation) {
        //         const position = await new Promise((resolve, reject) => {
        //             navigator.geolocation.getCurrentPosition(
        //                 (position) => resolve(position),
        //                 (error) => reject(error),
        //                 { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
        //             );
        //         });

        //         // Use the state callback function to log the updated state
        //         setCenter(prevState => {
        //             console.log(prevState); // This will log the previous state
        //             return {
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude
        //             };
        //         });

        //         console.log(center); // This may log the previous state, not the updated state
        //     } else {
        //         throw new Error("Geolocation is not supported by your browser.");
        //     }
        // } catch (error) {
        //     console.error("Error getting location:", error);
        // }
        setCenter({
            lat: "32.78052",
            lng: "-96.79973"
        });

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
                    platform.current.placeService = platform.current.getPlacesService();
                    platform.current.routerService = platform.current.getRoutingService(null, 8);
                    const defaultLayers = platform.current?.createDefaultLayers();

                    const newMap = new H.Map(
                        mapRef.current,
                        defaultLayers.vector.normal.map, {
                        pixelRatio: window.devicePixelRatio || 1,
                        center: initialCenter,
                        zoom: 17,
                    });


                    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

                    map.current = newMap;
                    // Add resize to window
                    window.addEventListener('resize', () => map.current.getViewPort().resize());


                    const ui = H.ui.UI.createDefault(map.current, defaultLayers);

                    map.current.UI = ui;

                    setMapInitialized(true);

                } else if (map.current) {
                    // Update the center of the map whenever the state changes
                    map.current.setCenter(initialCenter);

                    // map.current.addEventListener('pointermove', function (evt) {
                    //     // Get the latitude and longitude of the pointer position
                    //     const pointerPosition = map.current.screenToGeo(
                    //         evt.currentPointer.viewportX,
                    //         evt.currentPointer.viewportY
                    //     );
                    //     console.log(pointerPosition);
                    // });
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
        <PlaceServiceContext.Provider value={{ placeService: platform.current?.placeService }}>
            <SearchContext.Provider value={{ service: platform.current?.searchService }}>
                <MapContext.Provider value={{ map: map.current }}>
                    <RouterServiceContext.Provider value={{ routing: platform.current?.routerService }}>
                        <LocationContext.Provider value={{ userLocation: center }}>
                            <SideBar />
                        </LocationContext.Provider>
                    </RouterServiceContext.Provider>
                </MapContext.Provider>
            </SearchContext.Provider>
        </PlaceServiceContext.Provider>
    </div>

}

export default HEREMap;
