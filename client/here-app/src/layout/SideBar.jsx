import React, { useContext, useEffect, useState } from "react";
import DirectionBox from "../components/direction/DirectionBox";
import SearchBox from "../components/search/SearchBox";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";
import DetailContainer from "../components/detail/DetailContainer";
import { MapContext } from "./Map";
import { createBrowserRouter } from "react-router-dom";

export const TAB = {
  DIRECTION: "Direction",
  SEARCH: "Search",
};

export const DirectionContext = React.createContext(null);

const SideBar = () => {
  const [tab, setTab] = useState(TAB.SEARCH);
  const [isClose, setIsClose] = useState(false);
  const [origin, setOrigin] = useState({
    id: "",
    name: "",
    position: null,
  });
  const [destination, setDestination] = useState({
    id: "",
    name: "",
    position: null,
  });

  const handleReturnTab = () => {
    switch (tab) {
      case TAB.DIRECTION:
        return <DirectionBox handleChangeTab={(e) => handleChangeTab(e)} />;
      case TAB.SEARCH:
        return <SearchBox handleChangeTab={(e) => handleChangeTab(e)} />;
      default:
        return null; // Add a default case to handle unexpected values of 'tab'
    }
  };

  const handleChangeTab = (tab) => {
    if (tab === TAB.DIRECTION || tab === TAB.SEARCH) {
      setTab(tab);
    } else {
      throw Error("Tab is invalid!");
    }
  };

  const handleClose = () => {
    setIsClose((prevState) => !prevState);
  };

  return (
    <DirectionContext.Provider
      value={{
        origin: origin,
        destination: destination,
        setDestination: setDestination,
        setOrigin: setOrigin,
      }}
    >
      <div
        className={`absolute flex flex-row top-0 left-0 shadow-2xl h-full border-scaffold border-r-2 bg-bg text-text ${
          isClose ? "" : "w-96"
        }`}
      >
        {!isClose && handleReturnTab()}
        <div
          onClick={handleClose}
          className="absolute top-1/2 flex left-full w-8 h-12 shadow-2xl border-scaffold border-2 rounded-e-3xl hover:bg-scaffold hover:cursor-pointer bg-bg"
        >
          {isClose ? (
            <div className=" flex items-center flex-auto">
              <ArrowForward />
            </div>
          ) : (
            <div className=" flex items-center flex-auto">
              <ArrowBack />
            </div>
          )}
        </div>
      </div>
    </DirectionContext.Provider>
  );
};

export default SideBar;
