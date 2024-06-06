import React, { useContext, useEffect, useRef, useState } from "react";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionIconButton from "./DirectionIcon";
import LocationOn from "@mui/icons-material/LocationOn";
import { ToastContainer, toast } from "react-toastify";

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
  Close,
  CloseOutlined,
  EditLocation,
  History,
  MyLocation,
  StraightenOutlined,
  TripOrigin,
} from "@mui/icons-material";
import { DirectionContext, TAB } from "../../layout/SideBar";
import { useLocationPicker } from "../../hooks/useLocationPicker";
import { useDirectionResult } from "../../layout/contexts/DirectionResultContext";
import { useDirectionSearch } from "../../layout/contexts/DirectionSearchContext";
import useURLParams from "../../hooks/useURLParams";
import PrintPage from "../../layout/PrintPage";
import { measure } from "../../utils/distanceMeasure";
function DirectionBox(props) {
  const { handleChangeTab } = props;
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const { map } = useContext(MapContext);
  const { routing } = useContext(RouterServiceContext);
  const { service } = useContext(SearchContext);
  const { userLocation } = useContext(LocationContext);
  const { directionResult, setDirectionResult } = useDirectionResult();
  const { directionSearch, setDirectionSearch } = useDirectionSearch();

  const [locationType, setLocationType] = useState("");
  const [result, setResult] = useState(directionResult);
  console.log(result);
  useLocationPicker(
    map,
    service,
    setDirectionSearch,
    setLocationType,
    locationType
  );
  const { params } = useURLParams();

  useEffect(() => {
    console.log(params);
    if (
      params?.origin &&
      params?.destination &&
      ["car", "truck", "bicyle", "pedestrian"].includes(params?.transportMode)
    ) {
      setDirectionSearch(prevSearch => ({...prevSearch, transportMode: params?.transportMode }));
      service?.reverseGeocode(
        {
          at: params?.origin,
        },
        (response) => {
          let title = response.items[0].address.label;
          let position = response.items[0].access[0];
          setDirectionSearch((prevSearch) => ({
            ...prevSearch,
            originName: title,
            origin: `${position.lat},${position.lng}`,
          }));
        },
        console.error
      );
      service?.reverseGeocode(
        {
          at: params?.destination,
        },
        (response) => {
          let title = response.items[0].address.label;
          let position = response.items[0].access[0];
          setDirectionSearch((prevSearch) => ({
            ...prevSearch,
            destinationName: title,
            destination: `${position.lat},${position.lng}`,
          }));
        },
        console.error
      );
    } else {
      setDirectionSearch(prevSearch => ({...prevSearch, transportMode: "car" }));
    }
  }, [params]);

  useEffect(() => {
    if (!directionSearch.origin) {
      originInputRef.current.focus();
    } else {
      originInputRef.current.blur();
    }
  }, [directionSearch?.origin]);

  const handleSwap = () => {
    setDirectionSearch((prevSearch) => ({
      ...prevSearch,
      origin: directionSearch.destination,
      destination: directionSearch.origin,
      originName: directionSearch.destinationName,
      destinationName: directionSearch.originName,
    }));
  };

  // Define a callback function to process the routing response:
  const onResult = function (result) {
    console.log(result);
    // Ensure that at least one route was found
    if (result.routes.length > 0) {
      setResult((prevResult) => ({
        locations: {
          origin: directionSearch.originName,
          destination: directionSearch.destinationName,
        },
        duration: result.routes[0].sections[0].travelSummary.duration,
        length: result.routes[0].sections[0].travelSummary.length,
        actions: result.routes[0].sections[0].actions,
      }));

      setDirectionResult({
        transportMode: directionSearch.transportMode,
        locations: {
          origin: directionSearch.originName,
          destination: directionSearch.destinationName,
        },
        duration: result.routes[0].sections[0].travelSummary.duration,
        length: result.routes[0].sections[0].travelSummary.length,
        actions: result.routes[0].sections[0].actions,
      });

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
          lineJoin: "round",
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
          lat: directionSearch.origin.split(",")[0],
          lng: directionSearch.origin.split(",")[1],
        },
        {
          icon: new H.map.Icon("/assets/startmarker.svg", {
            size: { w: 32, h: 32 },
          }),
        }
      );

      startMarker.setData({
        label: `Start: ${directionSearch.originName}`,
      });

      const endMarker = new H.map.Marker(
        {
          lat: directionSearch.destination.split(",")[0],
          lng: directionSearch.destination.split(",")[1],
        },
        {
          icon: new H.map.Icon("/assets/endmarker.svg", {
            size: { w: 32, h: 32 },
          }),
        }
      );

      endMarker.setData({
        label: `Destination: ${directionSearch.destinationName}`,
      });

      window.history.replaceState(
        null,
        null,
        `/route-planer?origin=${directionSearch.origin}&destination=${directionSearch.destination}&transportMode=${directionSearch.transportMode}`
      );

      // Create a group to hold all map objects
      const group = new H.map.Group();
      group.addObjects([routeLine, startMarker, endMarker]);

      var originBubble = new H.ui.InfoBubble(
        {
          lat: directionSearch.origin.split(",")[0],
          lng: directionSearch.origin.split(",")[1],
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
          lat: directionSearch.destination.split(",")[0],
          lng: directionSearch.destination.split(",")[1],
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
    } else {
      toast.error("Get route failed!");
    }
  };

  // Create the parameters for the routing request:
  const routingParameters = {
    routingMode: "fast",
    transportMode: `${directionSearch?.transportMode}`,
    // The start point of the route:
    origin: `${directionSearch.origin}`,
    // The end point of the route:
    destination: `${directionSearch?.destination}`,
    // Include the route shape in the response
    return: "polyline,travelSummary,actions,instructions",
  };

  const handleGetDirection = () => {
    console.log(routingParameters);
    if (!directionSearch.destination || !directionSearch.destination) return;
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
      return `${hours} hrs, ${minutes} mins`;
    }
    if (minutes > 0) {
      return `${minutes} minutes`;
    }
    return milliseconds + " seconds";
  };

  const handleOnClickOrigin = (id, origin, originName) => {
    setDirectionSearch((prevSearch) => ({
      ...prevSearch,
      origin: `${origin.lat},${origin.lng}`,
      originName: originName,
      originId: id,
    }));
  };

  const handleOnClickDestination = (id, des, destinationName) => {
    setDirectionSearch((prevSearch) => ({
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
        if (directionSearch.onFocus == "origin") {
          setDirectionSearch((prevSearch) => ({
            ...prevSearch,
            originName: title,
            origin: `${position.lat},${position.lng}`,
          }));
        } else {
          setDirectionSearch((prevSearch) => ({
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
    setDirectionSearch((prevSearch) => ({
      ...prevSearch,
      onFocus: onFocus,
    }));
    // Check the input search is empty?
    if (value == "") {
      //Set search to local storage history.
      const items = JSON.parse(localStorage.getItem("history"));

      return setDirectionSearch((prevSearch) => ({
        ...prevSearch,
        result: [],
        historyResult: items?.length != 0 ? items : [],
      }));
    } else {
      return handleOnChange(value);
    }
  };

  useEffect(() => {
    if (directionSearch.destination && directionSearch.origin) {
      handleGetDirection();
    }
  }, [
    directionSearch.origin,
    directionSearch.destination,
    directionSearch.transportMode,
  ]);

  const handleOnChange = (value) => {
    // Set the input text
    if (directionSearch.onFocus == "origin") {
      setDirectionSearch((prevSearch) => ({
        ...prevSearch,
        originName: value,
        origin: null,
      }));
    } else if (directionSearch.onFocus == "destination") {
      setDirectionSearch((prevSearch) => ({
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
          at: `${userLocation.lat},${userLocation.lng}`,
          limit: 5,
        },
        function (searchResult) {
          setDirectionSearch((prevSearch) => ({
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

      return setDirectionSearch((prevSearch) => ({
        ...prevSearch,
        historyResult: items.length != 0 ? items : [],
        result: [],
      }));
    }
  };

  const handleOnBlur = () => {
    // Set the onFocus to "" and hide the searchResult
    setDirectionSearch((prevSearch) => ({
      ...prevSearch,
      onFocus: "",
    }));
  };

  const handleOnClick = (id, position, locationName) => {
    if (directionSearch.onFocus == "origin") {
      handleOnClickOrigin(id, position, locationName);
    } else if (directionSearch.onFocus == "destination") {
      handleOnClickDestination(id, position, locationName);
    }
  };

  const handleBack = (e) => {
    if (!document.referrer.startsWith(window.location.origin)) {
      console.log(document.referrer);
      history.replaceState(null, "", "/");
    } else {
      window.history.back();
    }
    handleChangeTab(TAB.SEARCH);
    map?.removeObjects(map?.getObjects());
    setDirectionSearch((prevSearch) => ({
      ...prevSearch,
      origin: "",
      originId: "",
      originName: "",
      destinationId: "",
      destinationName: "",
      destination: "",
      transportMode: "",
    }));
    setDirectionResult(null);
  };

  return (
    <>
      <div className=" h-full flex flex-col rounded-r-xl w-full">
        <div className=" mobile:hidden tablet:flex bg-primary ">
          <div className="flex flex-auto p-4 border-2 border-scaffold justify-end items-center ">
            <div className="hover:cursor-pointer text-bg" onClick={handleBack}>
              <CloseOutlined />
            </div>
          </div>
        </div>
        <div
          className="tablet:hidden size-4 hover:cursor-pointer"
          onClick={handleBack}
        >
          <ArrowBack />
        </div>
        {/* Transport method */}
        <div className=" p-4 border-scaffold border-b-2">
          <div className="flex flex-row justify-between p-2">
            <DirectionIconButton
              transportMode="car"
              IconComponent={DirectionsCarFilledIcon}
              onClick={(event) => {
                const mode = event.currentTarget.getAttribute("type");
                setDirectionSearch((search) => ({
                  ...search,
                  transportMode:
                    search.transportMode !== mode ? mode : search.transportMode,
                }));
              }}
              selectedtransportMode={directionSearch.transportMode}
            />
            <DirectionIconButton
              transportMode="pedestrian"
              IconComponent={DirectionsWalkIcon}
              onClick={(event) => {
                const mode = event.currentTarget.getAttribute("type");
                setDirectionSearch((search) => ({
                  ...search,
                  transportMode:
                    search.transportMode !== mode ? mode : search.transportMode,
                }));
              }}
              selectedtransportMode={directionSearch.transportMode}
            />

            <DirectionIconButton
              transportMode="truck"
              IconComponent={LocalShippingIcon}
              onClick={(event) => {
                const mode = event.currentTarget.getAttribute("type");
                setDirectionSearch((search) => ({
                  ...search,
                  transportMode:
                    search.transportMode !== mode ? mode : search.transportMode,
                }));
              }}
              selectedtransportMode={directionSearch.transportMode}
            />
            <DirectionIconButton
              transportMode="bicycle"
              IconComponent={DirectionsBikeIcon}
              onClick={(event) => {
                const mode = event.currentTarget.getAttribute("type");
                setDirectionSearch((search) => ({
                  ...search,
                  transportMode:
                    search.transportMode !== mode ? mode : search.transportMode,
                }));
              }}
              selectedtransportMode={directionSearch.transportMode}
            />
          </div>
          <div className="flex flex-row  mt-4">
            <div className="flex gap-2 flex-col flex-auto">
              {/* Search Input */}
              <div className="flex flex-row">
                <div className=" items-center p-2 text-green">
                  <TripOrigin />
                </div>
                <div className="w-64 overflow-hidden flex-auto border-2 flex flex-row items-center rounded-full border-scaffold">
                  <input
                    ref={originInputRef}
                    value={directionSearch.originName}
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
                  {directionSearch?.originName?.length > 0 && (
                    <div
                      onClick={() => {
                        setDirectionSearch((prevSearch) => ({
                          ...prevSearch,
                          originName: "",
                          originId: "",
                          origin: "",
                        }));
                        setResult(null);
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
                <div className="w-64 flex-auto border-2 overflow-hidden flex flex-row items-center rounded-full border-scaffold">
                  <input
                    ref={destinationInputRef}
                    value={directionSearch.destinationName}
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
                  {directionSearch?.destinationName?.length > 0 && (
                    <div
                      onClick={() => {
                        map?.removeObjects(map?.getObjects());
                        setDirectionSearch((prevSearch) => ({
                          ...prevSearch,
                          destinationName: "",
                          destinationId: "",
                          destination: "",
                        }));
                        setResult(null);
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
            <div className=" ml-4 flex flex-row items-center size-auto justify-center">
              <div
                className="hover:cursor-pointer hover:bg-scaffold w-8 h-8 flex justify-center items-center hover:bg-black rounded-lg"
                onClick={handleSwap}
              >
                <SwapVertIcon />
              </div>
            </div>
          </div>
        </div>
        {/* Search direction input result */}
        {(directionSearch.onFocus == "origin" ||
          directionSearch.onFocus == "destination") && (
          <div className="flex flex-col mt-2 mobile:w-full mobile:overflow-auto tablet:overflow-hidden  ">
            <div
              onMouseDown={() => handleOnClickYourLocation()}
              className="flex flex-row  flex-auto hover:bg-primary hover:text-bg "
            >
              <div className="p-4 hover:cursor-pointer flex-auto flex flex-row">
                <div className="text-green">
                  <MyLocation />
                </div>
                <div className=" line-clamp-1 ml-4 text-pretty text-md font-bold">
                  Current position
                </div>
              </div>
            </div>

            {directionSearch.result && directionSearch.result?.length != 0
              ? directionSearch.result.map(
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
                        <div className="p-4 items-center hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto ">
                          <div className=" text-red">
                            <LocationOn />
                          </div>
                          <div className="flex flex-col">
                            <div className=" line-clamp-1 ml-4 overflow-clip font-bold text-md">
                              {item.title}
                            </div>
                            <div className=" line-clamp-1 ml-4 overflow-clip text-sm">
                              {item?.address?.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )
              : directionSearch.historyResult
                  ?.reverse()
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={index}
                      onMouseDown={() =>
                        handleOnClick(item?.id, item.position, item.name)
                      }
                      className="flex flex-col mt-2 "
                    >
                      <div className="flex flex-row">
                        <div className="p-4 hover:bg-primary border-scaffold hover:text-bg hover:cursor-pointer items-center flex flex-row flex-auto ">
                          <div className="text-yellow">
                            <History />
                          </div>
                          <div className="flex flex-col">
                            <div className=" line-clamp-1 ml-4 overflow-clip font-bold text-md">
                              {item.name}
                            </div>
                            <div className=" line-clamp-1 ml-4 overflow-clip text-sm">
                              {item.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
        )}
        {/* Calculate Direction Result */}
        {directionSearch.origin != "" &&
        directionSearch.destination != "" &&
        directionResult?.actions?.length != 0 &&
        directionSearch.onFocus === "" ? (
          <div className="max-h-full overflow-y-auto overflow-x-hidden">
            <div className="">
              <div className="flex flex-row">
                <div className="flex flex-col flex-auto">
                  <div className="flex flex-row border-b-2 border-scaffold">
                    <div className="flex flex-row flex-1 p-2 justify-start">
                      <div className="text-primary justify-center flex items-center">
                        <StraightenOutlined fontSize="large" />
                      </div>
                      <div className="flex-auto text-lg flex justify-center items-center">
                        {measure.meterToMiles(directionResult?.length) > 0.25
                          ? `${measure.meterToMiles(directionResult?.length)} miles`
                          : `${measure.meterToFeets(directionResult?.length)} feets`}
                      </div>
                    </div>
                    <div className="flex flex-row p-2 flex-1 items-center justify-start border-l-2 border-scaffold">
                      <div className="text-yellow justify-center items-center">
                        <AccessTime fontSize="large" />
                      </div>
                      <div
                        aria-label={formatTimeDifference(result?.duration)}
                        className="flex-auto text-md flex justify-center items-center line-clamp-1 overflow-auto"
                      >
                        {formatTimeDifference(result?.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <InstructionModal instructions={directionResult?.actions} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default DirectionBox;
