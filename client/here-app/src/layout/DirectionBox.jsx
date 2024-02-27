import React, { useContext, useEffect, useState } from 'react'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionIconButton from '../components/DirectionIcon';
import LocationOn from '@mui/icons-material/LocationOn';
import { LocationContext, MapContext, RouterServiceContext, SearchContext } from './Map';
import H from '@here/maps-api-for-javascript';
import { InstructionModal } from '../components/InstructionBox';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { AccessTime, BikeScooter, CloseOutlined, Directions, History, MyLocation, StraightenOutlined, TripOrigin } from '@mui/icons-material';
import { TAB } from './SideBar';


function DirectionBox(props) {
    const { handleChangeTab, origin } = props;
    console.log(origin);

    const { map } = useContext(MapContext);
    const { routing } = useContext(RouterServiceContext);
    const { service } = useContext(SearchContext);
    const { userLocation } = useContext(LocationContext);
    const [showInstructions, setShowInstructions] = useState(false);

    const [result, setResult] = useState({
        locations: {
            origin: "",
            destination: ""
        },
        duration: 0,
        length: 0,
        actions: []
    })


    const [search, setSearch] = useState({
        origin: origin?.position,
        destination: null,
        transportMode: 'car',
        returnType: 'summary',
        originName: origin?.locationName || "",
        destinationName: "",
        focusOn: "",
        result: [],
        historyResult: [],
        originId: "",
        destinationId: ""
    });


    useEffect(() => {
        if (origin) {
            map?.removeEventListener("mapviewchange", ()=>{
                
            });
            console.log(origin.locationName)
            setSearch(prevSearch => ({
                ...prevSearch,
                origin: `${origin.position.lat},${origin.position.lng}`,
                originName: origin.locationName,
                originId: origin.originId
            }))
        }
    }, [origin]);

    const handleSwap = () => {
        setSearch((prevSearch) => ({
            ...prevSearch,
            origin: search.destination,
            destination: search.origin,
            originName: search.destinationName,
            destinationName: search.originName,
        }));
    };

    // Define a callback function to process the routing response:
    const onResult = function (result) {
        // Ensure that at least one route was found
        if (result.routes.length > 0) {
            console.log(result);
            setResult(prevResult => ({
                locations: {
                    origin: search.originName,
                    destination: search.destinationName
                },
                duration: result.routes[0].sections[0].travelSummary.duration,
                length: result.routes[0].sections[0].travelSummary.length,
                actions: result.routes[0].sections[0].actions
            }));

            // Create an array to store the line strings for each route section
            const lineStrings = result.routes[0].sections.map(section => {
                return H.geo.LineString.fromFlexiblePolyline(section.polyline);
            });

            // Create a multi-line string combining all route sections
            const multiLineString = new H.geo.MultiLineString(lineStrings);

            // Create a polyline to display the route
            const routeLine = new H.map.Polyline(multiLineString, {
                style: {
                    strokeColor: 'blue',
                    lineWidth: 3
                }
            });

            // Attach data to the route line
            routeLine.setData({
                distance: result.routes[0].sections[0].travelSummary.length,
                duration: result.routes[0].sections[0].travelSummary.duration
            });

            // Create markers for start and end points
            const startMarker = new H.map.Marker({
                lat: search.origin.split(",")[0],
                lng: search.origin.split(",")[1]
            }, {
                icon: new H.map.Icon("https://cdn-icons-png.flaticon.com/512/7945/7945007.png", {
                    size: { w: 56, h: 56 }
                })
            });
            startMarker.setData({
                label: search.originName
            });

            const endMarker = new H.map.Marker({
                lat: search.destination.split(",")[0],
                lng: search.destination.split(",")[1]
            }, {
                icon: new H.map.Icon("https://cdn-icons-png.flaticon.com/512/8830/8830930.png", {
                    size: { w: 56, h: 56 }
                })
            });
            endMarker.setData({
                label: search.destinationName
            });

            // Create a group to hold all map objects
            const group = new H.map.Group();
            group.addObjects([routeLine, startMarker, endMarker]);

            // Add tap event listener to the group to show info bubble
            group.addEventListener('tap', function (evt) {
                var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                    content: evt.target.getData().label // Extract label from marker data
                });
                map.UI.addBubble(bubble);
            }, false);

            // Add group to the map
            map.addObject(group);

            // Set map viewport to show entire route
            map.getViewModel().setLookAtData({
                bounds: group.getBoundingBox()
            });
        }
    };


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

    const handleGetDirection = () => {
        console.log(search);
        console.log(routingParameters.destination);
        //Remove the current marker
        const currentObjects = map.getObjects();
        if (currentObjects.length > 0) {
            map.removeObjects(currentObjects);
        }
        console.log(routingParameters);
        //Add the origin and the destination marker
        routing.calculateRoute(routingParameters, onResult,
            function (error) {
                console.error(error);
                alert("No route found, please check the locations");
            }
        );
    };

    const formatTimeDifference = (milliseconds) => {
        const seconds = Math.floor(milliseconds) % 60;
        const minutes = Math.floor(milliseconds / 60) % 60;
        const hours = Math.floor(milliseconds / (60 * 60)) % 24;
        const days = Math.floor(milliseconds / (60 * 60 * 24));
        if (days > 0)
            return `${days} days, ${hours} hours`;
        if (days == 0 && hours > 0) {
            return `${hours} hours, ${minutes} minutes`;
        }
        if (minutes > 0) {
            return `${minutes} minutes`;
        }
        return `Less than 1 minutes`;
    };

    const handleOnClickOrigin = (id, origin, originName) => {
        setSearch(prevSearch => ({
            ...prevSearch,
            origin: `${origin.lat},${origin.lng}`,
            originName: originName,
            originId: id
        }));
    }


    const handleOnClickDestination = (id, des, destinationName) => {
        setSearch(prevSearch => ({
            ...prevSearch,
            destination: `${des.lat},${des.lng}`,
            destinationName: destinationName,
            destinationId: id
        }));
    }

    const handleOnClickYourLocation = () => {
        service?.reverseGeocode({
            'at': `${userLocation?.lat},${userLocation?.lng}`
        }, (response) => {
            console.log(response)
            let title = response.items[0].address.label;
            let position = response.items[0].access[0];
            // let id = response.items[0]?.id;
            if (search.onFocus == "origin") {
                setSearch(prevSearch => ({
                    ...prevSearch,
                    originName: title,
                    origin: `${position.lat},${position.lng}`
                }));
            } else {
                setSearch(prevSearch => ({
                    ...prevSearch,
                    destinationName: title,
                    destination: `${position.lat},${position.lng}`
                }));
            }
        }, console.error);
    }

    const handleClickShowInstructions = () => {
        console.log(result)
        setShowInstructions(prevState => !prevState);
    }

    const handleOnFocus = (value, onFocus) => {
        // Set onFocus in search
        setSearch(prevSearch => ({
            ...prevSearch,
            onFocus: onFocus
        }))
        // Check the input search is empty?
        if (value == "") {
            //Set search to local storage history.
            const items = JSON.parse(localStorage.getItem("history"));
            console.log(items);
            return setSearch(prevSearch => ({
                ...prevSearch,
                result: [],
                historyResult: (items?.length != 0) ? items : []
            }));
        } else {
            return handleOnChange(value);
        }
    }


    useEffect(() => {
        if (search.destination && search.origin) {
            handleGetDirection();
        }
    }, [search.origin, search.destination, search.transportMode])

    const handleOnChange = (value) => {
        // Set the input text
        if (search.onFocus == "origin") {
            setSearch(prevSearch => ({
                ...prevSearch,
                originName: value,
                origin: null
            }));
        } else if (search.onFocus == "destination") {
            setSearch(prevSearch => ({
                ...prevSearch,
                destinationName: value,
                destination: null
            }));
        }
        if (value != "") {
            // Query the autosuggest result and handle result or error
            service?.autosuggest({
                'q': value,
                'in': `circle:${userLocation.lat},${userLocation.lng};r=${100000}`,
                'limit': 5,
            }, function (searchResult) {
                setSearch(prevSearch => ({
                    ...prevSearch,
                    result: searchResult?.items
                }));
            }, function (error) {
                console.error(error);
            });
        } else {
            const items = JSON.parse(localStorage.getItem("history"));
            console.log(items);
            return setSearch(prevSearch => ({
                ...prevSearch,
                historyResult: (items.length != 0) ? items : [],
                result: []
            }));
        }
    }

    const handleOnBlur = () => {
        // Set the onFocus to "" and hide the searchResult
        setSearch(prevSearch => ({
            ...prevSearch,
            onFocus: ""
        }));
    }

    const handleOnClick = (id, position, locationName) => {
        if (search.onFocus == "origin") {
            handleOnClickOrigin(id, position, locationName);
        } else if (search.onFocus == "destination") {
            handleOnClickDestination(id, position, locationName);
        }
    }



    return (
        <div class=" h-full max-w-96 min-w-96 flex flex-col" >
            <div className="flex bg-primary">
                <div className="flex flex-auto p-4 justify-end items-center ">
                    <div className="hover:cursor-pointer text-bg" onClick={(e) => {
                        handleChangeTab(TAB.SEARCH);
                        map?.removeObjects(map?.getObjects());
                    }}>
                        <CloseOutlined />
                    </div>
                </div>
            </div>
            {/* Transport method */}
            <div class=" p-4 border-scaffold">
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
                <div className="flex flex-row  mt-4">
                    <div class="flex gap-2 flex-col flex-auto">
                        {/* Search Input */}
                        <div className="flex flex-row">
                            <div className=' items-center p-2 text-green'>
                                <TripOrigin />
                            </div>
                            <input
                                value={search.originName}
                                onFocus={(e) => { handleOnFocus(e.target.value, "origin") }}
                                onChange={(e) => { handleOnChange(e.target.value) }}
                                onBlur={(e) => { handleOnBlur() }}
                                className=' border-scaffold text-pretty text-base focus:border-primary border-transparent focus:outline-none m-0  px-4 py-0 rounded-full bg-bg border-2 flex-auto' placeholder='Type to search' />
                        </div>

                        <div className="flex flex-row">
                            <div className=' items-center p-2 text-red'>
                                <LocationOn />
                            </div>
                            <input

                                value={search.destinationName}
                                onFocus={(e) => { handleOnFocus(e.target.value, "destination") }}
                                onChange={(e) => { handleOnChange(e.target.value) }}
                                onBlur={(e) => { handleOnBlur() }}
                                className=' border-scaffold text-pretty text-base focus:border-primary border-transparent focus:outline-none m-0  px-4 py-0 rounded-full bg-bg border-2 flex-auto' placeholder='Type to search' />
                        </div>
                        {/* <button onClick={() => { handleGetDirection() }}>Get Directions</button> */}
                    </div>
                    <div class="flex flex-row ml-5 items-center justify-center">
                        <div class="hover:cursor-pointer hover:bg-scaffold w-8 h-8 flex justify-center items-center hover:bg-black rounded-lg" onClick={handleSwap}>
                            <SwapVertIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-0.5 bg-scaffold shadow-2xl"></div>
            {/* Search direction input result */}
            {(search.onFocus == "origin" || search.onFocus == "destination") && <div className="flex flex-col mt-2 max-w-96 min-w-96">
                <div
                    onMouseDown={() => handleOnClickYourLocation()}
                    className="flex flex-row  flex-auto hover:bg-primary hover:text-bg ">
                    <div className="p-4 hover:cursor-pointer flex-auto flex flex-row">
                        <div className="text-green">
                            <MyLocation />
                        </div>
                        <div className=" line-clamp-1 ml-4 text-pretty">
                            Current position
                        </div>
                    </div>
                </div>

                {search.result.length != 0 ? search.result.map((item, index) => item?.access?.[0] &&
                    (<div
                        key={index}
                        onMouseDown={() => { handleOnClick(item?.id, {lat: item?.access?.[0]?.lat, lng: item?.access?.[0]?.lng}, item.title) }}
                        className="flex flex-row">
                        <div className="p-4 hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
                            <div className=" text-red">
                                <LocationOn />
                            </div>
                            <div className=" line-clamp-1 ml-4 overflow-clip">
                                {item.title}
                            </div>
                        </div>
                    </div>))
                    :
                    (
                        search.historyResult?.reverse().slice(0, 5).map(
                            (item, index) =>
                            (< div key={index}
                                onMouseDown={() => handleOnClick(item?.id, item.position, item.name)}
                                className="flex flex-col mt-2 max-w-96 min-w-96">
                                <div className="flex flex-row">
                                    <div className="p-4 hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
                                        <div className="text-yellow">
                                            <History />
                                        </div>
                                        <div className=" line-clamp-1 ml-4 overflow-clip">
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        )
                    )
                }
            </div>}
            {/* Calculate Direction Result */}
            {
                (search.origin != null && search.destination != null && search.onFocus == "") ?
                    <div className="max-h-full overflow-y-auto">
                        <div className="mt-2 pl-4 py-4 max-w-96 min-w-96">
                            <div className='flex flex-row gap-2'>
                                <div className="flex flex-row">
                                    <div className="text-primary">
                                        <Directions fontSize='large' />
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <div className="flex-1">
                                            <p className="line-clamp-1 max-w-80 overflow-clip text-base">{search.originName}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="line-clamp-1 max-w-80 overflow-clip text-base">{search.destinationName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row mt-4">
                                <div className="flex flex-col flex-auto gap-4">
                                    <div className="flex flex-row justify-left ">
                                        <div className="text-primary">
                                            <StraightenOutlined />
                                        </div>
                                        <div className="ml-4"> {result.length > 1000 ? `${(result.length / 1000).toPrecision(2)} km` : `${result.length} m`} </div>
                                    </div>
                                    <div className="flex flex-row justify-left">
                                        <div className="text-yellow">
                                            <AccessTime />
                                        </div>
                                        <div className="ml-4"> {formatTimeDifference(result.duration)} </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div
                                            onClick={() => handleClickShowInstructions()}
                                            className='bg-bg text-primary hover:bg-primary hover:text-bg hover:cursor-pointer text-xl border-2 rounded-full px-4 py-1'>
                                            Detail
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {result.length !== null && <>
                                <div className=''>
                                    {showInstructions && <InstructionModal instructions={result.actions} />}
                                </div>
                            </>}
                        </div>
                    </div>
                    : null
            }
        </div >
    )
}

export default DirectionBox