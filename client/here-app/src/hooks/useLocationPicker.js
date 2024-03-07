import { useEffect } from "react";
import { addBubbleLabel } from "../utils/bubble";

export const useLocationPicker = (
  map,
  service,
  setSearch,
  setLocationType,
  locationType
) => {
  useEffect(() => {
    let timeoutId = null;

    const handleTap = (evt) => {
      if (locationType === "") return;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        var position = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        let locationName = `${position.lat?.toPrecision(
          2
        )},${position.lng?.toPrecision(2)}`;
        let locationId = "unknown";
        let locationAddress = "";
        service?.browse(
          { at: `${position.lat},${position.lng}`, limit: 1 },
          function (res) {
            locationName = res?.items?.[0]?.title;
            locationId = res?.items?.[0]?.id;
            locationAddress = res?.items?.[0]?.address?.label;
            map?.removeObjects(map?.getObjects());
            if (locationType === "origin") {
              setSearch((prevSearch) => ({
                ...prevSearch,
                origin: `${position.lat},${position.lng}`,
                originName: locationName,
                originId: locationId,
              }));
              addBubbleLabel(map, "Start: " + locationName, "Address: " +  locationAddress, position);
            } else if (locationType === "destination") {
              setSearch((prevSearch) => ({
                ...prevSearch,
                destination: `${position.lat},${position.lng}`,
                destinationName: locationName,
                destinationId: locationId,
              }));
              addBubbleLabel(map, "Destination: " + locationName, "Address: " +  locationAddress, position);
            }
          },
          function (error) {
            console.error(error);
          }
        );
        setLocationType("");
      }, 300); // Adjust the delay as needed (e.g., 300 milliseconds)
    };

    map?.addEventListener("tap", handleTap, { once: true });

    return () => {
      map?.removeEventListener("tap", handleTap);
    };
  }, [locationType, map, setSearch, setLocationType]);
};
