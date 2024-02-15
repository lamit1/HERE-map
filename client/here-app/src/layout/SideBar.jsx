import React, { useContext, useEffect, useState } from 'react'
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionIconButton from '../components/DirectionIcon';
import SearchInput from '../components/SearchInput';
import LocationOn from '@mui/icons-material/LocationOn';
import { MapContext, RouterServiceContext } from './Map';
import H from '@here/maps-api-for-javascript';
import { duration } from '@mui/material';


function SideBar() {
    const { map } = useContext(MapContext)
    const { routing } = useContext(RouterServiceContext)

    const [hidden, setHidden] = useState(false)

    const [result, setResult] = useState({
        locations: {
            origin: "",
            destination: ""
        },
        duration: 0,
        length: 0
    })

    const [search, setSearch] = useState({
        origin: '52.5308,13.3847',
        destination: '52.5264,13.3686',
        transportMode: 'car',
        returnType: 'summary',
        originName: "",
        destinationName: ""
    });


    // Create the parameters for the routing request:
    const routingParameters = {
        'routingMode': 'fast',
        'transportMode': `${search.transportMode}`,
        // The start point of the route:
        'origin': `${search.origin}`,
        // The end point of the route:
        'destination': `${search.destination}`,
        // Include the route shape in the response
        'return': 'polyline,travelSummary,actions,instructions',
    };

    // Define a callback function to process the routing response:
    const onResult = function (result) {
        // Ensure that at least one route was found
        if (result.routes.length) {
            console.log(result)
            setResult(prevResult=>({
                locations: {
                    origin: search.originName,
                    destination: search.destinationName
                },
                duration: result.routes[0].sections[0].travelSummary.duration,
                length: result.routes[0].sections[0].travelSummary.length
            }));
            const lineStrings = [];
            result.routes[0].sections.forEach((section) => {
                // Create a linestring to use as a point source for the route line
                lineStrings.push(H.geo.LineString.fromFlexiblePolyline(section.polyline));
            });

            // Create an instance of H.geo.MultiLineString
            const multiLineString = new H.geo.MultiLineString(lineStrings);

            // Create a polyline to display the route:
            const routeLine = new H.map.Polyline(multiLineString, {
                style: {
                    strokeColor: 'blue',
                    lineWidth: 3
                }
            });

            // Create a marker for the start point:
            const startMarker = new H.map.Marker({lat:search.origin.split(",")[0], lng: search.origin.split(",")[1]});

            // Create a marker for the end point:
            const endMarker = new H.map.Marker({lat:search.destination.split(",")[0], lng: search.destination.split(",")[1]});

            // Create a H.map.Group to hold all the map objects and enable us to obtain 
            // the bounding box that contains all its objects within
            const group = new H.map.Group();
            group.addObjects([routeLine, startMarker, endMarker]);
            // Add the group to the map
            map.addObject(group);

            // Set the map viewport to make the entire route visible:
            map.getViewModel().setLookAtData({
                bounds: group.getBoundingBox()
            });
        };
    };

    const handleGetDirection = async () => {
        //Remove the current marker
        const currentObjects = map.getObjects();
        if (currentObjects.length > 0) {
            map.removeObjects(currentObjects);
        }
        //Add the origin and the destination marker
        routing.calculateRoute(routingParameters, onResult,
            function (error) {
                alert(error.message);
            });
    };

    const formatTimeDifference = (milliseconds) => {
        const seconds = Math.floor(milliseconds) % 60;
        const minutes = Math.floor(milliseconds /  60) % 60;
        const hours = Math.floor(milliseconds /  (60 * 60)) % 24;
        const days = Math.floor(milliseconds /  (60 * 60 * 24));
      
        return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      };

    const handleOnClickOrigin = (origin, originName) => {
        console.log('Called origin')
        setSearch(prevSearch => ({
            ...prevSearch,
            origin: origin,
            originName: originName
        }))
    }


    const handleOnClickDestination = (des, destinationName) => {
        setSearch(prevSearch => ({
            ...prevSearch,
            destination: des,
            destinationName: destinationName
        }))
    }


    return (
        !hidden
            ? <>
                <div class="absolute top-1 left-1 w-80 h-auto rounded-md bg-slate-500" >
                    <div class=" p-4">
                        <div class="flex justify-between">
                            <div class="text-pretty font-medium mb-2"> Directions </div>
                            <div class="hover:cursor-pointer w-8 h-8 flex justify-center items-center hover:bg-black rounded-lg" onClick={() => { setHidden(hidden => !hidden) }}>
                                <CloseIcon />
                            </div>
                        </div>
                        <div class="flex flex-row justify-between p-2">
                            <DirectionIconButton
                                transportMode="pedestrian"
                                IconComponent={DirectionsWalkIcon}
                                onClick={(event) => {
                                    const mode = event.currentTarget.getAttribute('type');
                                    setSearch((search) => ({
                                        ...search,
                                        transportMode: search.transportMode !== mode ? mode : search.transportMode,
                                    }));
                                }}
                                selectedtransportMode={search.transportMode}
                            />
                            <DirectionIconButton
                                transportMode="car"
                                IconComponent={DirectionsCarFilledIcon}
                                onClick={(event) => {
                                    const mode = event.currentTarget.getAttribute('type');
                                    setSearch((search) => ({
                                        ...search,
                                        transportMode: search.transportMode !== mode ? mode : search.transportMode,
                                    }));
                                }}
                                selectedtransportMode={search.transportMode}
                            />
                            <DirectionIconButton
                                transportMode="truck"
                                IconComponent={LocalShippingIcon}
                                onClick={(event) => {
                                    const mode = event.currentTarget.getAttribute('type');
                                    setSearch((search) => ({
                                        ...search,
                                        transportMode: search.transportMode !== mode ? mode : search.transportMode,
                                    }));
                                }}
                                selectedtransportMode={search.transportMode}

                            />
                            <DirectionIconButton
                                transportMode="bicycle"
                                IconComponent={DirectionsBikeIcon}
                                onClick={(event) => {
                                    const mode = event.currentTarget.getAttribute('type');
                                    setSearch((search) => ({
                                        ...search,
                                        transportMode: search.transportMode !== mode ? mode : search.transportMode,
                                    }));
                                }}
                                selectedtransportMode={search.transportMode}
                            />
                        </div>
                        <div class="flex gap-4 flex-col ">
                            <SearchInput IconComponent={LocationOn} handleOnChoose={handleOnClickOrigin} />
                            <div class="flex flex-row justify-center">
                                <div class="hover:cursor-pointer w-8 h-8 flex justify-center items-center hover:bg-black rounded-lg" onClick={() => { }}>
                                    <SyncAltIcon />
                                </div>
                            </div>
                            <SearchInput IconComponent={LocationOn} handleOnChoose={handleOnClickDestination} />
                            <button onClick={() => { handleGetDirection() }}>Get Directions</button>
                        </div>
                    </div>
                    {result.length !== null && <>
                        <div class="h-1 w-full bg-black mt-1"></div>
                        <div class="p-4">
                            <div class="text-pretty font-medium mb-2"> RECOMMENDED WAYS TO GO </div>
                            <div class="">From: { result.locations?.origin }</div>
                            <div class="">To: { result.locations?.destination }</div>
                            <div class="">Distance: { `${(result.length/1000)} km` }</div>
                            <div class="">Estimate time: { formatTimeDifference(result.duration) }</div>
                        </div>
                    </>}
                </div>
            </> :
            <div class="absolute top-1 left-1 w-auto h-auto rounded-md bg-slate-500">
                <div class="hover:cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-black rounded-lg" onClick={() => { setHidden(hidden => !hidden) }}>
                    <DirectionsIcon />
                </div>
            </div>
    )
}

export default SideBar