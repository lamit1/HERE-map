import React, { useContext, useEffect, useState } from "react";
import { LocationContext, MapContext, SearchContext } from "../../layout/Map";
import CategoryCard from "./CategoryCard";
import {
  Coffee,
  Hotel,
  Map,
  School,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import DetailContainer from "../detail/DetailContainer";
import SearchInput from "./SearchInput";
import ResultSearchContainer from "./search-result/ResultSearchContainer";
import HistorySearchContainer from "./history-result/HistorySearchContainer";
import { DirectionContext } from "../../layout/SideBar";
import { useSearchLocation } from "../../hooks/useSearchLocation";
import { fetchSearchMapQuest } from "../../graphql/api/search";
import { LinkGenarator } from "../detail/linkGenerator";
import { useSearchResult } from "./context/ResultSearchContext";
import { useDetailLocation } from "./context/DetailLocationContext";
import useURLParams from "../../hooks/useURLParams";
import _ from "lodash";
import { addBubbleInfoCategory, addBubbleLabel } from "../../utils/bubble";
import { usePageResult } from "../../layout/contexts/PageResultContext";
import PageList from "./search-result/PageList";

export const CATEGORY_PLACES = ["Coffee", "Shop", "School", "Hotel"];

export const SearchBoxContext = React.createContext();

function SearchBox(props) {
  const { service } = useContext(SearchContext);
  const { setDestination } = useContext(DirectionContext);
  const { handleChangeTab } = props;
  const { map } = useContext(MapContext);

  const [detailId, setDetailId] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const { setSearchResults, searchResults } = useSearchResult();

  const { info } = useDetailLocation();

  const { path, params } = useURLParams();

  const { page, setPage } = usePageResult();

  const { loading, data, error } = useSearchLocation(
    map,
    map?.getCenter()?.lat,
    map?.getCenter()?.lng,
    searchResults?.keyword,
    service
  );
  console.log(path, params);

  const searchCategory = async (category) => {
    const categoryResults = await fetchSearchMapQuest(
      map,
      map?.getCenter()?.lat,
      map?.getCenter()?.lng,
      category,
      setDestination,
      setDetailId,
      setSearchResults,
      handleChangeTab
    );
    setSearchResults({ keyword: category, items: categoryResults });
    setPage((prevPage) => ({
      index: 0,
      maxPage: Number.isInteger(categoryResults?.length / 15)
        ? Math.floor(categoryResults?.length / 15)
        : Math.floor(categoryResults?.length / 15) + 1,
    }));
    window.history.pushState(
      null,
      "",
      `/search?position=${map?.getCenter()?.lat},${
        map?.getCenter()?.lng
      }&title=${category}`
    );
  };

  useEffect(() => {
    if (params?.position && params?.title) {
      map?.setCenter({
        lat: params?.position?.split(",")?.[0],
        lng: params?.position?.split(",")?.[1],
      });
      searchCategory(params?.title);
      searchResults.items.forEach((item) => {
        if (item?.type == "location") {
          addBubbleLabel(
            map,
            item?.name || item?.title,
            item?.adress?.label,
            item?.position,
            item?.id,
            item?.title,
            item?.adress?.country
          );
        } else if (item?.type == "category") {
          addBubbleInfoCategory(
            map,
            item?.position?.lat,
            item?.position?.lng,
            item?.id,
            item?.name,
            item?.image,
            item?.address,
            item?.rating,
            item?.totalReviews,
            setDestination,
            setDetailId,
            setSearchResults,
            item?.country || "unknown"
          );
        }
      });
    } else if (_.isEmpty(params) && path.startsWith("/search/locations")) {
      const id = LinkGenarator.convertUrlToId(window.location.href);
      setDetailId(id);
    }
  }, [path, params]);

  return (
    <SearchBoxContext.Provider
      value={{
        search: searchResults?.keyword,
        setSearch: (keyword) => {
          setSearchResults((prevResult) => ({
            ...prevResult,
            keyword: keyword,
          }));
        },
        setDetailId: setDetailId,
      }}
    >
      <div className="flex flex-col relative w-full">
        {detailId != "" || info?.id != null ? (
          <DetailContainer
            id={detailId || info?.id}
            handleChangeTab={handleChangeTab}
          />
        ) : (
          <>
            <SearchInput
              handleChangeTab={handleChangeTab}
              setIsFocused={setIsFocused}
            />
            <div className="flex flex-col overflow-y-auto overflow-x-hidden flex-auto">
              {/* Category Item */}
              <div className="flex flex-row justify-around max-w-96 border-b-2 border-scaffold">
                <CategoryCard
                  title={"Hotel"}
                  search={searchCategory}
                  Icon={Hotel}
                />
                <CategoryCard
                  title={"School"}
                  search={searchCategory}
                  Icon={School}
                />
                <CategoryCard
                  title={"Cafe"}
                  search={searchCategory}
                  Icon={Coffee}
                />
                <CategoryCard
                  title={"Shop"}
                  search={searchCategory}
                  Icon={ShoppingCart}
                />
              </div>
              {/* Category Search Result */}
              {data?.length > 0 || searchResults.items?.length > 0 ? (
                // Network search
                <ResultSearchContainer
                  items={
                    searchResults?.items?.length > 0
                      ? searchResults.items
                      : data
                  }
                  handleChangeTab={handleChangeTab}
                />
              ) : // History search
              isFocused ? (
                <HistorySearchContainer />
              ) : (
                /* Label when there is no result */
                <div className="flex-auto flex justify-center items-center">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center text-primary">
                      <div className="flex justify-center items-center">
                        <Search sx={{ fontSize: 30 }} />
                      </div>
                      <div className=" text-pretty text-right text-3xl font-bold pl-2">
                        MapOne
                      </div>
                    </div>
                    <div className=" text-pretty text-scaffold flex flex-row">
                      <div className="flex items-center">
                        <Map />
                      </div>
                      <div className="pl-2 flex items-center">
                        Search anywhere, find anything.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <PageList index={page?.index} maxPage={page?.maxPage} />
          </>
        )}
      </div>
    </SearchBoxContext.Provider>
  );
}

export default SearchBox;
