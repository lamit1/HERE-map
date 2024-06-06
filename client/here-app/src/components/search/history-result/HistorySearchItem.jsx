import { History } from "@mui/icons-material";
import React, { useContext } from "react";
import { MapContext } from "../../../layout/Map";
import { SearchBoxContext } from "../SearchBox";
import { DirectionContext } from "../../../layout/SideBar";
import { LinkGenarator } from "../../detail/linkGenerator";
import { useDirectionSearch } from "../../../layout/contexts/DirectionSearchContext";

const HistorySearchItem = ({ item }) => {
  const { map } = useContext(MapContext);
  const { setDetailId, setSearch } = useContext(SearchBoxContext);
  const { setDestination } = useContext(DirectionContext);
  const { setDirectionSearch } = useDirectionSearch();
  const handleOnClickLocalSearch = (item) => {
    setDetailId(item.id);
    setSearch(item.name);

    setDestination({
      position: item?.position,
      name: item?.name,
      id: item?.id,
    });
    window.history.pushState(
      "",
      "",
      LinkGenarator.convertLocationToUrl(item.id, item.country, item.name)
    );
  };

  return (
    <div
      onMouseDown={() => handleOnClickLocalSearch(item)}
      className="flex flex-col border-b-2 first:border-t-2 border-scaffold"
    >
      <div className="p-4 items-center hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
        <div className="text-yellow">
          <History />
        </div>
        <div className="flex flex-col ml-4">
          <div className=" line-clamp-1 overflow-clip text-lg font-bold">{item?.name}</div>
          <div className="text-pretty text-sm">{item?.address}</div>
        </div>
      </div>
    </div>
  );
};

export default HistorySearchItem;
