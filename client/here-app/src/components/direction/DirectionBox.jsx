import React, { useContext, useEffect, useRef, useState } from "react";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionIconButton from "./DirectionIcon";
import LocationOn from "@mui/icons-material/LocationOn";
import {
  LocationContext,
  MapContext,
  RouterServiceContext,
  SearchContext,
} from "../../layout/Map";
import H from "@here/maps-api-for-javascript";
import { InstructionModal } from "./instruction/InstructionBox";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  AccessTime,
  ArrowBack,
  ArrowDownward,
  Close,
  CloseOutlined,
  Directions,
  EditLocation,
  History,
  MyLocation,
  StraightenOutlined,
  TripOrigin,
} from "@mui/icons-material";
import { DirectionContext, TAB } from "../../layout/SideBar";
import { useLocationPicker } from "../../hooks/useLocationPicker";

function DirectionBox(props) {
  const { handleChangeTab } = props;

  const { destination, setDestination, setOrigin } =
    useContext(DirectionContext);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const { map } = useContext(MapContext);
  const { routing } = useContext(RouterServiceContext);
  const { service } = useContext(SearchContext);
  const { userLocation } = useContext(LocationContext);

  const [locationType, setLocationType] = useState("");

  const initialState = {
    locations: {
      origin: "",
      destination: "",
    },
    duration: 0,
    length: 0,
    actions: [],
  };

  const [result, setResult] = useState(initialState);

  const [search, setSearch] = useState({
    origin: "",
    originId: "",
    originName: "",
    destinationId: destination?.id || "",
    destinationName: destination?.name || "",
    destination:
      `${
        destination?.position?.lat || destination?.position?.lng
          ? `${destination?.position?.lat},${destination?.position?.lng}`
          : ""
      }` || "",
    transportMode: "car",
    returnType: "summary",
    focusOn: "",
    result: [],
    historyResult: [],
  });

  useLocationPicker(map, service, setSearch, setLocationType, locationType);

  useEffect(() => {
    if (destination) {
      originInputRef.current.focus();
    }
  }, [destination]);

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
    console.log(result);
    // Ensure that at least one route was found
    if (result.routes.length > 0) {
      setResult((prevResult) => ({
        locations: {
          origin: search.originName,
          destination: search.destinationName,
        },
        duration: result.routes[0].sections[0].travelSummary.duration,
        length: result.routes[0].sections[0].travelSummary.length,
        actions: result.routes[0].sections[0].actions,
      }));

      // Create an array to store the line strings for each route section
      const lineStrings = result.routes[0].sections.map((section) => {
        return H.geo.LineString.fromFlexiblePolyline(section.polyline);
      });

      // Create a multi-line string combining all route sections
      const multiLineString = new H.geo.MultiLineString(lineStrings);

      // Create a polyline to display the route
      const routeLine = new H.map.Polyline(multiLineString, {
        style: {
          strokeColor: "#695ee0",
          lineWidth: 6,
          lineDash: [1, 2],
          lineJoin: "round",
          lineDashOffset: 3,
        },
      });

      // Attach data to the route line
      routeLine.setData({
        distance: result.routes[0].sections[0].travelSummary.length,
        duration: result.routes[0].sections[0].travelSummary.duration,
      });

      // Create markers for start and end points
      const startMarker = new H.map.Marker(
        {
          lat: search.origin.split(",")[0],
          lng: search.origin.split(",")[1],
        },
        {
          icon: new H.map.Icon("/assets/startmarker.png", {
            size: { w: 28, h: 28 },
          }),
        }
      );

      startMarker.setData({
        label: `Start: ${search.originName}`,
      });

      const endMarker = new H.map.Marker(
        {
          lat: search.destination.split(",")[0],
          lng: search.destination.split(",")[1],
        },
        {
          icon: new H.map.Icon("/assets/endmarker.png", {
            size: { w: 28, h: 28 },
          }),
        }
      );

      endMarker.setData({
        label: `Destination: ${search.destinationName}`,
      });

      // Create a group to hold all map objects
      const group = new H.map.Group();
      group.addObjects([routeLine, startMarker, endMarker]);

      var originBubble = new H.ui.InfoBubble(
        {
          lat: search.origin.split(",")[0],
          lng: search.origin.split(",")[1],
        },
        {
          content: startMarker.getData().label, // Extract label from marker data
        }
      );
      // Add tap event listener to the group to show info bubble
      startMarker.addEventListener(
        "pointerenter",
        function (evt) {
          map.UI.addBubble(originBubble);
          originBubble.open();
        },
        false
      );

      startMarker.addEventListener("pointerleave", function (event) {
        originBubble.close();
      });

      var destinationBubble = new H.ui.InfoBubble(
        {
          lat: search.destination.split(",")[0],
          lng: search.destination.split(",")[1],
        },
        {
          content: endMarker.getData().label, // Extract label from marker data
        }
      );
      // Add tap event listener to the group to show info bubble
      endMarker.addEventListener(
        "pointerenter",
        function (evt) {
          map.UI.addBubble(destinationBubble);
          destinationBubble.open();
        },
        false
      );

      endMarker.addEventListener("pointerleave", function (event) {
        destinationBubble.close();
      });

      // Add group to the map
      map.addObject(group);

      // Set map viewport to show entire route
      map.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
      });
    }
  };

  // Create the parameters for the routing request:
  const routingParameters = {
    routingMode: "fast",
    transportMode: `${search.transportMode}`,
    // The start point of the route:
    origin: `${search.origin}`,
    // The end point of the route:
    destination: `${search.destination}`,
    // Include the route shape in the response
    return: "polyline,travelSummary,actions,instructions",
  };

  const handleGetDirection = () => {
    if (!search.destination || !search.destination) return;
    //Remove the current marker
    const currentObjects = map.getObjects();
    if (currentObjects.length > 0) {
      map.removeObjects(currentObjects);
    }
    //Add the origin and the destination marker
    routing.calculateRoute(routingParameters, onResult, function (error) {
      console.error(error);
      alert("No route found, please check the locations");
    });
  };

  const formatTimeDifference = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60) % 60;
    const hours = Math.floor(milliseconds / (60 * 60)) % 24;
    const days = Math.floor(milliseconds / (60 * 60 * 24));
    if (days > 0) return `${days} days, ${hours} hours`;
    if (days == 0 && hours > 0) {
      return `${hours} hours, ${minutes} minutes`;
    }
    if (minutes > 0) {
      return `${minutes} minutes`;
    }
    return milliseconds + " seconds";
  };

  const handleOnClickOrigin = (id, origin, originName) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      origin: `${origin.lat},${origin.lng}`,
      originName: originName,
      originId: id,
    }));
  };

  const handleOnClickDestination = (id, des, destinationName) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      destination: `${des.lat},${des.lng}`,
      destinationName: destinationName,
      destinationId: id,
    }));
  };

  const handleOnClickYourLocation = () => {
    service?.reverseGeocode(
      {
        at: `${userLocation?.lat},${userLocation?.lng}`,
      },
      (response) => {
        let title = response.items[0].address.label;
        let position = response.items[0].access[0];
        // let id = response.items[0]?.id;
        if (search.onFocus == "origin") {
          setSearch((prevSearch) => ({
            ...prevSearch,
            originName: title,
            origin: `${position.lat},${position.lng}`,
          }));
        } else {
          setSearch((prevSearch) => ({
            ...prevSearch,
            destinationName: title,
            destination: `${position.lat},${position.lng}`,
          }));
        }
      },
      console.error
    );
  };

  const handleOnFocus = (value, onFocus) => {
    // Set onFocus in search
    setSearch((prevSearch) => ({
      ...prevSearch,
      onFocus: onFocus,
    }));
    // Check the input search is empty?
    if (value == "") {
      //Set search to local storage history.
      const items = JSON.parse(localStorage.getItem("history"));

      return setSearch((prevSearch) => ({
        ...prevSearch,
        result: [],
        historyResult: items?.length != 0 ? items : [],
      }));
    } else {
      return handleOnChange(value);
    }
  };

  useEffect(() => {
    if (search.destination && search.origin) {
      handleGetDirection();
    }
  }, [search.origin, search.destination, search.transportMode]);

  const handleOnChange = (value) => {
    // Set the input text
    if (search.onFocus == "origin") {
      setSearch((prevSearch) => ({
        ...prevSearch,
        originName: value,
        origin: null,
      }));
    } else if (search.onFocus == "destination") {
      setSearch((prevSearch) => ({
        ...prevSearch,
        destinationName: value,
        destination: null,
      }));
    }
    if (value != "") {
      // Query the autosuggest result and handle result or error
      service?.autosuggest(
        {
          q: value,
          in: `circle:${userLocation.lat},${userLocation.lng};r=${100000}`,
          limit: 5,
        },
        function (searchResult) {
          setSearch((prevSearch) => ({
            ...prevSearch,
            result: searchResult?.items,
          }));
        },
        function (error) {
          console.error(error);
        }
      );
    } else {
      const items = JSON.parse(localStorage.getItem("history"));

      return setSearch((prevSearch) => ({
        ...prevSearch,
        historyResult: items.length != 0 ? items : [],
        result: [],
      }));
    }
  };

  const handleOnBlur = () => {
    // Set the onFocus to "" and hide the searchResult
    setSearch((prevSearch) => ({
      ...prevSearch,
      onFocus: "",
    }));
  };

  const handleOnClick = (id, position, locationName) => {
    if (search.onFocus == "origin") {
      handleOnClickOrigin(id, position, locationName);
    } else if (search.onFocus == "destination") {
      handleOnClickDestination(id, position, locationName);
    }
  };

  return (
    <div className=" h-full w-96 flex flex-col rounded-r-xl">
      <div className="flex bg-primary ">
        <div className="flex flex-auto p-4 border-2 border-scaffold justify-end items-center ">
          <div
            className="hover:cursor-pointer text-bg"
            onClick={(e) => {
              window.history.replaceState(null, "New Page Title", "/");
              handleChangeTab(TAB.SEARCH);
              map?.removeObjects(map?.getObjects());
              setOrigin({
                position: {
                  lat: "",
                  lng: "",
                },
                locationName: "",
                locationId: "",
              });
              setDestination({
                position: {
                  lat: "",
                  lng: "",
                },
                locationName: "",
                locationId: "",
              });
            }}
          >
            <CloseOutlined />
          </div>
        </div>
      </div>
      {/* Transport method */}
      <div className=" p-4 border-scaffold">
        <div className="flex flex-row justify-between p-2">
          <DirectionIconButton
            transportMode="pedestrian"
            IconComponent={DirectionsWalkIcon}
            onClick={(event) => {
              const mode = event.currentTarget.getAttribute("type");
              setSearch((search) => ({
                ...search,
                transportMode:
                  search.transportMode !== mode ? mode : search.transportMode,
              }));
            }}
            selectedtransportMode={search.transportMode}
          />
          <DirectionIconButton
            transportMode="car"
            IconComponent={DirectionsCarFilledIcon}
            onClick={(event) => {
              const mode = event.currentTarget.getAttribute("type");
              setSearch((search) => ({
                ...search,
                transportMode:
                  search.transportMode !== mode ? mode : search.transportMode,
              }));
            }}
            selectedtransportMode={search.transportMode}
          />
          <DirectionIconButton
            transportMode="truck"
            IconComponent={LocalShippingIcon}
            onClick={(event) => {
              const mode = event.currentTarget.getAttribute("type");
              setSearch((search) => ({
                ...search,
                transportMode:
                  search.transportMode !== mode ? mode : search.transportMode,
              }));
            }}
            selectedtransportMode={search.transportMode}
          />
          <DirectionIconButton
            transportMode="bicycle"
            IconComponent={DirectionsBikeIcon}
            onClick={(event) => {
              const mode = event.currentTarget.getAttribute("type");
              setSearch((search) => ({
                ...search,
                transportMode:
                  search.transportMode !== mode ? mode : search.transportMode,
              }));
            }}
            selectedtransportMode={search.transportMode}
          />
        </div>
        <div className="flex flex-row  mt-4">
          <div className="flex gap-2 flex-col">
            {/* Search Input */}
            <div className="flex flex-row">
              <div className=" items-center p-2 text-green">
                <TripOrigin />
              </div>
              <div className="w-64 overflow-hidden border-2 flex flex-row items-center rounded-full border-scaffold">
                <input
                  ref={originInputRef}
                  value={search.originName}
                  onFocus={(e) => {
                    handleOnFocus(e.target.value, "origin");
                  }}
                  onChange={(e) => {
                    handleOnChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    handleOnBlur();
                  }}
                  className=" text-pretty w-40 text-base focus:outline-none m-0 pl-4 py-0 rounded-full bg-bg  flex-auto"
                  placeholder="Start point..."
                />
                {search?.originName?.length > 0 && (
                  <div
                    onClick={() => {
                      setSearch((prevSearch) => ({
                        ...prevSearch,
                        originName: "",
                        originId: "",
                        origin: "",
                      }));
                      setResult(initialState);
                      map?.removeObjects(map?.getObjects());
                    }}
                    className=" hover:cursor-pointer size-10 hover:bg-scaffold flex items-center justify-center"
                  >
                    <Close />
                  </div>
                )}
                <div
                  className={`
                   hover:cursor-pointer
                    size-10 
                    flex
                      justify-center
                       items-center
                        focus:outline-none 
                        ${
                          locationType === "origin"
                            ? "bg-primary text-bg"
                            : "bg-bg hover:bg-scaffold text-green"
                        } `}
                  onClick={() => {
                    setLocationType("origin");
                  }}
                >
                  <EditLocation />
                </div>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="  items-center p-2 text-red">
                <LocationOn />
              </div>
              <div className="w-64 border-2 overflow-hidden flex flex-row items-center rounded-full border-scaffold">
                <input
                  ref={destinationInputRef}
                  value={search.destinationName}
                  onFocus={(e) => {
                    handleOnFocus(e.target.value, "destination");
                  }}
                  onChange={(e) => {
                    handleOnChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    handleOnBlur();
                  }}
                  className="w-40 border-scaffold text-pretty text-base focus:outline-none m-0  px-4 py-0 rounded-full bg-bg flex-auto"
                  placeholder="Destination..."
                />
                {search?.destinationName?.length > 0 && (
                  <div
                    onClick={() => {
                      map?.removeObjects(map?.getObjects());
                      setSearch((prevSearch) => ({
                        ...prevSearch,
                        destinationName: "",
                        destinationId: "",
                        destination: "",
                      }));
                      setResult(initialState);
                      setOrigin({
                        position: {
                          lat: "",
                          lng: "",
                        },
                        locationName: "",
                        locationId: "",
                      });
                      setDestination({
                        position: {
                          lat: "",
                          lng: "",
                        },
                        locationName: "",
                        locationId: "",
                      });
                    }}
                    className=" hover:cursor-pointer hover:bg-scaffold flex items-center justify-center size-10"
                  >
                    <Close />
                  </div>
                )}
                <div
                  className={`
                 hover:cursor-pointer
                   flex justify-center
                    items-center
                     size-10
                      focus:outline-none
                      ${
                        locationType === "destination"
                          ? "bg-primary text-bg"
                          : "bg-bg hover:bg-scaffold text-red"
                      }`}
                  onClick={() => {
                    setLocationType("destination");
                  }}
                >
                  <EditLocation />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center flex-auto justify-center">
            <div
              className="hover:cursor-pointer hover:bg-scaffold w-8 h-8 flex justify-center items-center hover:bg-black rounded-lg"
              onClick={handleSwap}
            >
              <SwapVertIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-scaffold shadow-2xl"></div>
      {/* Search direction input result */}
      {(search.onFocus == "origin" || search.onFocus == "destination") && (
        <div className="flex flex-col mt-2 max-w-96 min-w-96">
          <div
            onMouseDown={() => handleOnClickYourLocation()}
            className="flex flex-row  flex-auto hover:bg-primary hover:text-bg "
          >
            <div className="p-4 hover:cursor-pointer flex-auto flex flex-row">
              <div className="text-green">
                <MyLocation />
              </div>
              <div className=" line-clamp-1 ml-4 text-pretty">
                Current position
              </div>
            </div>
          </div>

          {search.result.length != 0
            ? search.result.map(
                (item, index) =>
                  item?.access?.[0] && (
                    <div
                      key={index}
                      onMouseDown={() => {
                        handleOnClick(
                          item?.id,
                          {
                            lat: item?.access?.[0]?.lat,
                            lng: item?.access?.[0]?.lng,
                          },
                          item.title
                        );
                      }}
                      className="flex flex-row"
                    >
                      <div className="p-4 hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
                        <div className=" text-red">
                          <LocationOn />
                        </div>
                        <div className=" line-clamp-1 ml-4 overflow-clip">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  )
              )
            : search.historyResult
                ?.reverse()
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={index}
                    onMouseDown={() =>
                      handleOnClick(item?.id, item.position, item.name)
                    }
                    className="flex flex-col mt-2 max-w-96 min-w-96"
                  >
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
                  </div>
                ))}
        </div>
      )}
      {/* Calculate Direction Result */}
      {search.origin != "" &&
      search.destination != "" &&
      result.actions.length != 0 &&
      search.onFocus == "" ? (
        <div className="max-h-full overflow-y-auto overflow-x-hidden">
          <div className="max-w-96 min-w-96">
            <div className="flex flex-row">
              <div className="flex flex-col flex-auto">
                <div className="flex flex-row border-b-2 border-scaffold">
                  <div className="flex flex-row flex-1 p-2 justify-start">
                    <div className="text-primary  ">
                      <StraightenOutlined fontSize="large" />
                    </div>
                    <div className="flex-auto text-lg flex justify-center items-center">
                      {result.length > 1000
                        ? `${(result.length / 1000).toPrecision(2)} km`
                        : `${result.length} m`}
                    </div>
                  </div>
                  <div className="flex flex-row p-2 flex-1 items-center justify-start border-l-2 border-scaffold">
                    <div className="text-yellow">
                      <AccessTime fontSize="large" />
                    </div>
                    <div className="flex-auto text-lg flex justify-center items-center">
                      {formatTimeDifference(result.duration)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {result.length !== null && (
              <InstructionModal instructions={result.actions} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DirectionBox;
