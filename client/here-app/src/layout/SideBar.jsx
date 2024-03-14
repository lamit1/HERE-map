import React, { useContext, useEffect, useState } from "react";
import DirectionBox from "../components/direction/DirectionBox";
import SearchBox, { SearchBoxContext } from "../components/search/SearchBox";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";
import DetailContainer from "../components/detail/DetailContainer";
import { MapContext, SearchContext } from "./Map";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ResultSearchProvider } from "../components/search/context/ResultSearchContext";
import { DetailLocationProvider } from "../components/search/context/DetailLocationContext";
import { DirectionResultProvider } from "./contexts/DirectionResultContext";
import { DirectionSearchProvider } from "./contexts/DirectionSearchContext";
import useURLParams from "../hooks/useURLParams";
import { PageResultProvider } from "./contexts/PageResultContext";

export const TAB = {
  DIRECTION: "Direction",
  SEARCH: "Search",
  NOT_FOUND: "Not found",
};

export const DirectionContext = React.createContext(null);

const SideBar = ({ match }) => {
  const { path, params } = useURLParams();
  const [tab, setTab] = useState();

  useEffect(() => {
    const currentTab =
      path.startsWith("/search") || path.startsWith("/")
        ? TAB.SEARCH
        : path.startsWith("/route-planer")
        ? TAB.DIRECTION
        : TAB.NOT_FOUND;
    setTab(currentTab);
  }, [path, params]);

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
        <PageResultProvider maxPage={0}>
          <DirectionResultProvider>
            <DirectionSearchProvider origin={origin} destination={destination}>
              <ResultSearchProvider>
                <DetailLocationProvider>
                  {!isClose && handleReturnTab()}
                </DetailLocationProvider>
              </ResultSearchProvider>
            </DirectionSearchProvider>
          </DirectionResultProvider>
        </PageResultProvider>
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
