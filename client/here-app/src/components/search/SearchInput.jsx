import React, { useContext, useRef } from "react";
import { MapContext } from "../../layout/Map";
import { Close, Directions } from "@mui/icons-material";
import { SearchBoxContext } from "./SearchBox";
import { DirectionContext, TAB } from "../../layout/SideBar";
import { useSearchResult } from "./context/ResultSearchContext";
import { usePageResult } from "../../layout/contexts/PageResultContext";

const SearchInput = ({ handleChangeTab, setIsFocused }) => {
  const { setDetailId } = useContext(SearchBoxContext);
  const { setDestination } = useContext(DirectionContext);
  const { map } = useContext(MapContext);
  const { searchResults, setSearchResults } = useSearchResult();
  const { setPage } = usePageResult();

  const handleClear = () => {
    setDetailId("");
    map?.removeObjects(map?.getObjects());
    setDestination(null);
    window.history.replaceState(null, "", "/");
    setPage(prevPage=>({
      ...prevPage,
      maxPage: 0
    }))
    setSearchResults((prevResults) => ({
      keyword: "",
      items: [],
    }));
    setIsFocused(false);
  };


  return (
    <div className="flex flex-row border-b-2 border-scaffold p-4  focus:border-primary bg-primary">
      <input
        value={searchResults?.keyword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
        }}
        onChange={(e) => {
          setSearchResults((prevResult) => ({
            items: [],
            keyword: e.target.value,
          }));
          if(e.target.value === "" ) setPage({index:0, maxPage: 0})
        }}
        placeholder="Type to search ..."
        className=" placeholder-bg text-pretty text-lg text-bg flex-auto bg-primary outline-none "
      />
      {searchResults?.keyword != "" && (
        <div
          onClick={() => {
            handleClear();
          }}
          className="flex text-bg flex-1 px-2 justify-center items-center  hover:cursor-pointer"
        >
          <Close />
        </div>
      )}
      <div
        onClick={() => {
          window.history.pushState(null, "", "/route-planer");
          map?.removeObjects(map?.getObjects());
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
