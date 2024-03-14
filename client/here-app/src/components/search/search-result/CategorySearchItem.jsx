import React, { useContext } from "react";
import { SearchBoxContext } from "../SearchBox";
import { MapContext } from "../../../layout/Map";
import { Language, LocationOn, Star } from "@mui/icons-material";
import { DirectionContext } from "../../../layout/SideBar";
import { LinkGenarator } from "../../detail/linkGenerator";
import RatingCard from "../../detail/RatingCard";
import { useDetailLocation } from "../context/DetailLocationContext";

const CategorySearchItem = ({ item, handleChangeTab }) => {
  const { search, setDetailId, setSearch } = useContext(SearchBoxContext);
  const { map } = useContext(MapContext);
  const { setDestination } = useContext(DirectionContext);
  const { info, setInfo } = useDetailLocation();

  const handleOnClickResultItem = (item) => {
    if (!item?.position) {
      alert("Location was unknown");
    } else {
      map?.removeObjects(map?.getObjects());
      setInfo({ id: item?.id });
      setDetailId(item?.id);
      

      //Pre-set the info
      setDestination({
        position: item?.position,
        name: item?.name,
        id: item?.id,
      });

      //Get the localstorage items string.
      let items = localStorage.getItem("history");

      // Check if the items are stored or not
      if (items != null) {
        // Parse the stored items
        let storedItems = JSON.parse(items);

        // Check if the stored items is an array
        if (Array.isArray(storedItems)) {
          let foundIndex = -1;

          // Find the index of the item with the same name if it exists
          for (let i = 0; i < storedItems.length; i++) {
            if (storedItems[i]?.name === item?.name) {
              foundIndex = i;
              break;
            }
          }

          // If the item with the same name was found, remove all occurrences of that item
          if (foundIndex !== -1) {
            storedItems = storedItems.filter(
              (item, index) => index !== foundIndex
            );
          }

          // Push the new item into the stored items array
          storedItems.push(item);

          // Store the updated items in local storage
          localStorage.setItem("history", JSON.stringify(storedItems));
        }
      } else {
        let storedItems = [];
        storedItems.push(item);
        localStorage.setItem("history", JSON.stringify(storedItems));
      }
    }
    window.history.pushState(
      null,
      "",
      LinkGenarator.convertLocationToUrl(item?.id, item?.country, item?.name)
    );
  };
  return (
    <div
      onMouseDown={() => handleOnClickResultItem(item)}
      className="flex flex-row min-h-36 hover:bg-scaffold hover:cursor-pointer hover:text-bg flex-auto border-b-2 border-scaffold"
    >
      <div className="p-4 flex flex-row flex-auto max-w-96 min-w-96">
        <img
          className="size-20 min-w-20 min-h-20 object-cover border-4 rounded-full border-primary"
          src={item?.image || "/assets/no-image.jpg"}
          onError={(e) => {
            e.target.src = "/assets/no-image.jpg"; // Replace the broken image with the placeholder image
            e.target.onerror = null; // Prevent infinite loop by removing the error handler
          }}
        />
        <div className="flex flex-col gap-2 flex-auto ml-2">
          <div className="flex flex-row">
            <div className="text-lg font-bold flex-1 mr-4">{item.name}</div>
            {item.totalReviews > 0 && (
              <RatingCard
                value={item.rating.value}
                totalCount={item.totalReviews}
              />
            )}
          </div>
          <div className="flex flex-row">
            <div className="text-red">
              <LocationOn />
            </div>
            <div className="text-sm flex items-center">{item.address}</div>
          </div>
          {item.website && (
            <a className="flex flex-row" href={item.website}>
              <div className="flex items-center">
                <Language />
              </div>
              <div className="">Website</div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySearchItem;
