import React, { useEffect, useRef, useState } from "react";
import H from "@here/maps-api-for-javascript";
import SideBar from "./SideBar";
import useURLParams from "../hooks/useURLParams";

export const MapContext = React.createContext(null);
export const SearchContext = React.createContext(null);
export const RouterServiceContext = React.createContext(null);
export const LocationContext = React.createContext(null);
export const PlaceServiceContext = React.createContext(null);

function HEREMap({ apikey }) {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);
  const [center, setCenter] = useState({
    lat: null,
    lng: null,
  });

  const { path, params } = useURLParams();

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
      lng: "-96.79973",
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
          platform.current.routerService = platform.current.getRoutingService(
            null,
            8
          );
          const defaultLayers = platform.current?.createDefaultLayers();

          const newMap = new H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
              pixelRatio: window.devicePixelRatio || 1,
              center: initialCenter,
              zoom: 15,
            }
          );

          const behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(newMap)
          );

          map.current = newMap;
          // Add resize to window
          window.addEventListener("resize", () =>
            map.current.getViewPort().resize()
          );

          const ui = H.ui.UI.createDefault(map.current, defaultLayers);

          map.current.UI = ui;

          // Create zoom bar
          // Create container
          var container = new H.ui.Control();
          container.addClass(
            "bg-bg w-16 h-30 border-scaffold border-2 absolute right-4 bottom-4 p-2 rounded-lg flex flex-col gap-4 justify-center items-center"
          );

          // Create zoom-in button
          var zoomInButton = new H.ui.base.Button({
            label: `<img class="  rounded-full overflow-hidden border-2 border-text  w-10 h-10 hover:bg-scaffold cursor-pointer" src="/assets/add.svg" />`,
            onStateChange: (evt) => {
              if (zoomInButton.getState() === H.ui.base.Button.State.UP) {
                const zoom = map.current?.getZoom();
                map.current?.setZoom(zoom + 0.5);
              }
            },
          });
          // Create zoom-out button
          var zoomOutButton = new H.ui.base.Button({
            label: `<img class="  rounded-full overflow-hidden border-2 border-text  w-10 h-10 hover:bg-scaffold cursor-pointer" src="/assets/minus.svg" />`,
            onStateChange: (evt) => {
              if (zoomOutButton.getState() === H.ui.base.Button.State.UP) {
                const zoom = map.current?.getZoom();
                map.current?.setZoom(zoom - 0.5);
              }
            },
          });

          // Add 2 button to container
          container.addChild(zoomInButton);
          container.addChild(zoomOutButton);
          // Add zoom bar to ui layer

          map.current?.UI.addControl("zoom-container", container);

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

  return (
    <div>
      <SearchContext.Provider
        value={{ service: platform.current?.searchService }}
      >
        <MapContext.Provider value={{ map: map.current }}>
          <RouterServiceContext.Provider
            value={{ routing: platform.current?.routerService }}
          >
            <LocationContext.Provider value={{ userLocation: center }}>
              <SideBar />
            </LocationContext.Provider>
          </RouterServiceContext.Provider>
        </MapContext.Provider>
      </SearchContext.Provider>
      <div className=" w-screen h-screen" ref={mapRef} />
    </div>
  );
}

export default HEREMap;
