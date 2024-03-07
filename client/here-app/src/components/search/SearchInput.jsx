import React, { useContext, useRef } from "react";
import { MapContext } from "../../layout/Map";
import { Close, Directions } from "@mui/icons-material";
import { SearchBoxContext } from "./SearchBox";
import { DirectionContext, TAB } from "../../layout/SideBar";

const SearchInput = ({ handleChangeTab, setIsFocused, setCategoryResults }) => {
  const { search, setSearch, setDetailId } = useContext(SearchBoxContext);
  const { setDestination } = useContext(DirectionContext);
  const { map } = useContext(MapContext);

  const handleClear = () => {
    setSearch("");
    setDetailId("");
    map?.removeObjects(map?.getObjects());
    setDestination(null);
    setCategoryResults([]);
  };

  return (
    <div className="flex flex-row border-b-2 border-scaffold p-4  focus:border-primary bg-primary">
      <input
        value={search}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
        }}
        onChange={(e) => {
          setCategoryResults([]);
          setSearch(e.target.value);
        }}
        placeholder="Type to search ..."
        className=" placeholder-bg text-pretty text-lg text-bg flex-auto bg-primary outline-none "
      />
      {search != "" && (
        <div
          onClick={() => {
            handleClear();
            window.history.replaceState(null, "New Page Title", "/");
          }}
          className="flex text-bg flex-1 px-2 justify-center items-center  hover:cursor-pointer"
        >
          <Close />
        </div>
      )}
      <div
        onClick={() => {
          handleChangeTab(TAB.DIRECTION);
        }}
        className="flex-1 flex  text-bg  justify-center px-2 items-center hover:cursor-pointer"
      >
        <div className="">
          <Directions />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
