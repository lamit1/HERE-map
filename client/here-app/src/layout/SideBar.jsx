import React, { useContext, useEffect, useRef, useState } from "react";
import DirectionBox from "../components/direction/DirectionBox";
import SearchBox, { SearchBoxContext } from "../components/search/SearchBox";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";
import { ResultSearchProvider } from "../components/search/context/ResultSearchContext";
import { DetailLocationProvider } from "../components/search/context/DetailLocationContext";
import { DirectionResultProvider } from "./contexts/DirectionResultContext";
import { DirectionSearchProvider } from "./contexts/DirectionSearchContext";
import useURLParams from "../hooks/useURLParams";
import { PageResultProvider } from "./contexts/PageResultContext";
import { InstructionsProvider } from "./contexts/InstructionsContext";

export const TAB = {
  DIRECTION: "Direction",
  SEARCH: "Search",
  NOT_FOUND: "Not found",
  PRINT: "Print",
};

export const DirectionContext = React.createContext(null);

const SideBar = () => {
  const { path, params } = useURLParams();
  const [isClose, setIsClose] = useState(false);
  const [origin, setOrigin] = useState({
    id: "",
    name: "",
    position: null,
  });
  const [tab, setTab] = useState(TAB.SEARCH);
  const [destination, setDestination] = useState({
    id: "",
    name: "",
    position: null,
  });
  const [height, setHeight] = useState(window.innerHeight / 2);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    console.log(path);
    if (path.startsWith("/route-planer")) {
      setTab(TAB.DIRECTION);
    } else if (
      path.startsWith("/search") ||
      path.startsWith("/") ||
      path.startsWith("")
    ) {
      setTab(TAB.SEARCH);
    } else if (path.startsWith("/print")) {
      setTab(TAB.PRINT);
    } else {
      setTab(TAB.NOT_FOUND);
    }
  }, [path]);

  const sideBarRef = useRef(null);

  const handleChangeTab = (tab) => {
    if (tab === TAB.DIRECTION || tab === TAB.SEARCH) {
      setTab(tab);
    } else {
      alert("Tab is invalid!");
    }
  };

  const handlePressClose = () => {
    setIsClose((prevState) => !prevState);
  };

  const handleMouseDown = (mouseDownEvent) => {
    setIsDragging(true);
    const startY = mouseDownEvent.clientY;
    const startHeight = sideBarRef.current.clientHeight;

    const onMouseMove = (mouseMoveEvent) => {
      const newHeight = startHeight + (startY - mouseMoveEvent.clientY);
      if (isDragging) setHeight(newHeight);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleTouchStart = (touchStartEvent) => {
    setIsDragging(true);
    const startY = touchStartEvent.touches[0].clientY;
    const startHeight = sideBarRef.current.clientHeight;

    const onTouchMove = (touchMoveEvent) => {
      const newHeight =
        startHeight + (startY - touchMoveEvent.touches[0].clientY);
      setHeight(newHeight);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
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
        style={{ height }}
        ref={sideBarRef}
        id="side-bar"
        className={`
        ${!isClose ? "mobile:w-full tablet:w-96" : " w-0"}
        flex flex-col
        mobile:max-h-[75%] mobile:min-h-[25%] table:min-h-none tablet:max-h-none
        mobile:max-w-full  mobile:bottom-0 absolute z-10 tablet:top-0 left-0 shadow-2xl tablet:h-full border-scaffold bg-bg text-text `}
      >
        {/* Line Corner */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className=" cursor-row-resize border-2 border-scaffold tablet:hidden p-2 flex h-4 w-full justify-center items-center"
        >
          <div className="h-2 w-8 bg-scaffold rounded-xl"></div>
        </div>
        <PageResultProvider maxPage={0}>
          <DirectionResultProvider>
            <DirectionSearchProvider origin={origin} destination={destination}>
              <ResultSearchProvider>
                <DetailLocationProvider>
                  {!isClose &&
                    ((tab === TAB.DIRECTION && (
                      <DirectionBox handleChangeTab={handleChangeTab} />
                    )) ||
                      (tab === TAB.SEARCH && (
                        <SearchBox handleChangeTab={handleChangeTab} />
                      )) ||
                      (tab === TAB.NOT_FOUND && (
                        <div className="">Not found!</div>
                      )))}
                </DetailLocationProvider>
              </ResultSearchProvider>
            </DirectionSearchProvider>
          </DirectionResultProvider>
        </PageResultProvider>
        <div
          onClick={handlePressClose}
          className=" mobile:hidden tablet:flex absolute top-1/2 flex left-full w-8 h-12 resize-x shadow-2xl rounded-e-3xl hover:bg-scaffold hover:cursor-pointer bg-bg"
        >
          {isClose ? (
            <div className="  flex items-center flex-auto">
              <ArrowForward />
            </div>
          ) : (
            <div className="  flex items-center flex-auto">
              <ArrowBack />
            </div>
          )}
        </div>
      </div>
    </DirectionContext.Provider>
  );
};

export default SideBar;
