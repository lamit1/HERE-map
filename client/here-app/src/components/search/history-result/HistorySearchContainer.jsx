import React, { useContext, useEffect, useState } from 'react'
import HistorySearchItem from './HistorySearchItem';
import { MapContext } from '../../../layout/Map';
import { SearchBoxContext } from '../SearchBox';
import { DirectionContext } from '../../../layout/SideBar';

const HistorySearchContainer = () => {
  const {map} = useContext(MapContext);
  const {search, setDetailId, setSearch} = useContext(SearchBoxContext);
  const {setOrigin} = useContext(DirectionContext);
  const [localSearch, setLocalSearch] = useState([]);

  useEffect(() => {
    // Process the search flow
    if (search != "") {
      setSearch(search);
    } else {
      // Show the history option
      let storageString = localStorage.getItem("history");
      if (storageString != null) {
        let storageItems = JSON.parse(storageString);
        setLocalSearch(storageItems?.reverse()?.slice(0, 5));
      }
    }
  }, []);
    return (
        localSearch.map((item, index) => (
            <HistorySearchItem key={index} item={item}/>
        ))
    )
}

export default HistorySearchContainer