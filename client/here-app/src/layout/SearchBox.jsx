import React, { useContext, useEffect, useRef, useState } from 'react'
import { LocationContext, MapContext, SearchContext } from './Map';
import Slider from '@mui/material-next/Slider';
import CategorySearchItem from '../components/CategorySearchItem';
import CategoryCard from '../components/CategoryCard';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOn from '@mui/icons-material/LocationOn';


function SearchBox
  () {
  const { map } = useContext(MapContext);
  const { service } = useContext(SearchContext);
  const { userLocation } = useContext(LocationContext);
  const searchInputRef = useRef(null)
  const [hidden, setHidden] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(userLocation);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState({
    at: `${currentPosition?.lat},${currentPosition?.lng}`,
    limit: 5,
    r: 1
  });
  const [circle, setCircle] = useState(null);
  const [result, setResult] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchHidden, setSearchHidden] = useState(false);

  useEffect(() => {
    setCurrentPosition(userLocation);
    console.log(userLocation);
    if (currentPosition?.lat && currentPosition?.lng) {
      setQuery((prevState) => ({
        ...prevState,
        at: `${currentPosition?.lat},${currentPosition?.lng}`,
      }));
      handleReverseGeocode()
    }
  }, [userLocation]);

  useEffect(() => {
    if (!circle) {
      let circle = new H.map.Circle({ lat: currentPosition?.lat, lng: currentPosition?.lng }, query.r)
      map?.addObject(circle);
      map?.addObject(new H.map.Marker({ lat: currentPosition?.lat, lng: currentPosition?.lng }, { icon: new H.map.Icon("https://cdn-icons-png.flaticon.com/512/7945/7945007.png", { size: { w: 56, h: 56 } }) }))
      setCircle(circle);
    } else {
      if (currentPosition?.lat && currentPosition?.lng) {
        circle?.setRadius(query.r);
      }
    }
  }, [query])

  const handleReverseGeocode = () => {
    service?.reverseGeocode({
      'at': `${currentPosition?.lat},${currentPosition?.lng}`
    }, (response) => {
      const locationName = response.items[0].address.label;
      searchInputRef.current.value = locationName;
      map?.setCenter({ lat: currentPosition?.lat, lng: currentPosition?.lng })
    }, console.error);
  }

  const handleChangeRadius = (event, range) => {
    setQuery(prevState => ({
      ...prevState,
      r: range
    }))
  }

  const handleChangeLimit = (event, limit) => {
    setQuery(prevState => ({
      ...prevState,
      limit: limit
    }))
  }


  const handleOnChangeSearch = (query) => {
    if (query !== "") {
      console.log(query)
      service?.discover({
        'q': query,
        'at': `${currentPosition?.lat},${currentPosition?.lng}`
      }, (response) => {
        setSearchResult(response);
        console.log(searchResult);
      }, console.error);
    }
  }

  const handleClickSearchItem = (item) => {
    if(!item.position) {
      console.error("Location was unknown")
    }
    setCurrentPosition(item.position);
    searchInputRef.current.value = item?.address?.label;
    setSearchHidden(true);
  }

  return (
    <div class="min-w-13 p-2  w-fit h-fit bg-slate-500 rounded-b-md rounded-tr-md z-1">
      <div className="pl-2 pr-4 text-pretty text-lg">Choose starting point:</div>
      <div class="flex p-2 items-center flex-row">
        <div className="relative w-full">
          <input ref={searchInputRef} onFocus={()=>{setSearchHidden(false)}} onBlur={()=>setSearchHidden(true)} className="rounded-md w-full h-10 p-1" onChange={(e) => handleOnChangeSearch(e.target.value)} />
          <ul className="absolute z-10 max-h-80  overflow-auto flex flex-col w-full text-black">
            {
              (!searchHidden && !searchResult?.items?.map(location => (
                <li className='p-2 border-b-2 rounded-r-md hover:bg-blue-500 hover:cursor-pointer bg-white' onClick={()=> {handleClickSearchItem(location)}}>
                  <div className="flex flex-row">
                    <LocationOn />
                    <p>
                      {/* {location.address.label} */}
                      123
                    </p>
                  </div>
                </li>
              )))
            }
          </ul>
        </div>
        <button class="flex items-center justify-center ml-2 rounded-full size-10" onClick={() => handleReverseGeocode()}>
          <MyLocationIcon />
        </button>
      </div>
      <div className="pl-4 pr-4">
        Choose the distance from:
        <Slider
          className="mt-6"
          value={query.r}
          min={1}
          max={10000}
          onChange={handleChangeRadius}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => {
            return value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
          }}
        />
      </div>
      <div className="pl-4 pr-4">
        Limit:
        <Slider
          className="mt-6"
          value={query.limit}
          min={1}
          max={50}
          onChange={handleChangeLimit}
          valueLabelDisplay="on"
        />
      </div>
      <p className='pl-2'>Options:</p>
      <div className="flex flex-row max-w-96 overflow-auto">
        <CategoryCard query={query} setResult={setResult} selected={selected} setSelected={setSelected} title={"Walmart"} />
        <CategoryCard query={query} setResult={setResult} selected={selected} setSelected={setSelected} title={"School"} />
        <CategoryCard query={query} setResult={setResult} selected={selected} setSelected={setSelected} title={"Food"} />
        <CategoryCard query={query} setResult={setResult} selected={selected} setSelected={setSelected} title={"Hotel"} />
        <CategoryCard query={query} setResult={setResult} selected={selected} setSelected={setSelected} title={"Mixue"} />
      </div>
      <button className='p-2 mt-2' onClick={() => { setHidden(prevState => !prevState) }}>{hidden ? `Show Result` : `Hide Result`}</button>
      <div className="absolute top-0 left-full overflow-auto w-96 max-h-96 bg-slate-500 ml-2 rounded-lg">
        {result?.length !== 0 ? (
          // Use parentheses to group the JSX elements
          !hidden && <div className='p-4'>
            <p className='text-lg text-pretty'>Place Found: </p>
            {result?.map((item, index) => (
              <CategorySearchItem key={index} item={item} />
            ))}
          </div>
        ) : null}
      </div>

    </div>
  )
}

export default SearchBox
