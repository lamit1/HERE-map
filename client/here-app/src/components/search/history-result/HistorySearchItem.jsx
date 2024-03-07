import { Timer } from "@mui/icons-material";
import React, { useContext } from "react";
import { MapContext } from "../../../layout/Map";
import { SearchBoxContext } from "../SearchBox";
import { DirectionContext } from "../../../layout/SideBar";
import { addBubbleInfoCategory } from "../../../utils/bubble";
import { LinkGenarator } from "../../detail/linkGenerator";

const HistorySearchItem = ({ item }) => {
  const { map } = useContext(MapContext);
  const { setDetailId, setSearch } = useContext(SearchBoxContext);
  const { setDestination } = useContext(DirectionContext);

  const handleOnClickLocalSearch = (item) => {
    map?.removeObjects(map?.getObjects());
    setDetailId(item.id);
    setSearch(item.name);
    addBubbleInfoCategory(
      map,
      item.position.lat,
      item.position.lng,
      item.id,
      item.name,
      item.image,
      item.address,
      item.rating,
      item.totalReviews,
      setDestination,
      setDetailId,
      setSearch
    );
    setDestination({
      position: item?.position,
      name: item?.name,
      id: item?.id,
    });
    window.history.pushState("","",LinkGenarator.convertLocationToUrl(item.id, item.country, item.name));
  };

  return (
    <div
      onMouseDown={() => handleOnClickLocalSearch(item)}
      className="flex flex-row border-b-2 first:border-t-2 border-scaffold"
    >
      <div className="p-4  hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
        <div className="text-yellow">
          <Timer />
        </div>
        <div className=" line-clamp-1 ml-4 overflow-clip">{item?.name}</div>
      </div>
    </div>
  );
};

export default HistorySearchItem;
