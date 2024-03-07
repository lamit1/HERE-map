import React, { useContext, useEffect, useState } from "react";
import { LocationContext, MapContext, SearchContext } from "../../layout/Map";
import CategoryCard from "./CategoryCard";
import {
  Coffee,
  Hotel,
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

export const CATEGORY_PLACES = ["Coffee", "Shop", "School", "Hotel"];

export const SearchBoxContext = React.createContext();

function SearchBox(props) {
  const { userLocation } = useContext(LocationContext);
  const { service } = useContext(SearchContext);
  const { setDestination } = useContext(DirectionContext);
  const { handleChangeTab } = props;
  const { map } = useContext(MapContext);

  const [detailId, setDetailId] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const [search, setSearch] = useState("");

  const [categoryResults, setCategoryResults] = useState([]);

  const { loading, data, error } = useSearchLocation(
    map,
    map?.getCenter()?.lat,
    map?.getCenter()?.lng,
    search,
    service
  );

  const searchCategory = async (category) => {
    const categoryResults = await fetchSearchMapQuest(
      map,
      map?.getCenter()?.lat,
      map?.getCenter()?.lng,
      category,
      setDestination,
      setDetailId,
      setSearch,
      handleChangeTab
    );
    setCategoryResults(categoryResults);
    setSearch(category);
    window.history.pushState(null,"",`/search?position=${map?.getCenter()?.lat},${map?.getCenter()?.lng}&title=${category}`);
  };


  useEffect(()=> {
    const id = LinkGenarator.convertUrlToId(window.location.href);
    setDetailId(id);
  }, [])

  return (
    <SearchBoxContext.Provider
      value={{
        search: search,
        setSearch: setSearch,
        setDetailId: setDetailId,
      }}
    >
      <div className="flex flex-col relative w-full">
        <SearchInput
          handleChangeTab={handleChangeTab}
          setCategoryResults={setCategoryResults}
          setIsFocused={setIsFocused}
        />
        {detailId != "" ? (
          <DetailContainer id={detailId} handleChangeTab={handleChangeTab}/>
        ) : (
          <div className="flex flex-col overflow-y-auto overflow-x-hidden flex-auto">
            {/* Category Search */}
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
            {data?.length > 0 || categoryResults?.length > 0 ? (
              // Network search
              <ResultSearchContainer
                items={categoryResults?.length > 0 ? categoryResults : data}
                handleChangeTab={handleChangeTab}
              />
            ) : // History search
            isFocused ? (
              <HistorySearchContainer />
            ) : (
              <div className="flex-auto"> </div>
            )}
          </div>
        )}
      </div>
    </SearchBoxContext.Provider>
  );
}

export default SearchBox;
