import React, { useContext, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { MapContext, SearchContext } from './Map';
import Slider from '@mui/material-next/Slider';


function SearchBar(props) {
  const { map } = useContext(MapContext)
  const { service } = useContext(SearchContext)
  const { location } = props
  const [query, setQuery] = useState({
    at: location.lat && location.lng ? `${location.lat},${location.lng}` : "",
    limit: 5,
    r: 1
  });
  const [result, setResult] = useState([])

  useEffect(() => {
    setQuery(prevState => ({
      ...prevState,
      at: `${location.lat},${location.lng}`
    }))
  }, [location]);

  const handleQuery = (q) => {
    if (query !== "") {
      const suggestQuery = {
        'q': q,
        // 'at': query.at,
        'limit': query.limit,
        'in': `circle:${query.at};r=${query.r}`
      }
      console.log(suggestQuery)
      service.autosuggest(suggestQuery, onSuccess, onError);
    }
  }


  const onSuccess = (result) => {
    setResult(result.items);
    console.log(result)
  }

  const onError = (error) => {
    console.log(error);
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

  return (
    <div class="absolute left-2/4 top-1 min-w-13  w-fit h-fit bg-slate-500 rounded-md z-1">
      <div class="flex p-2 items-center flex-row">
        <button class="flex items-center justify-center ml-2 rounded-full size-10" onClick={() => handleQuery()}>
          <SearchIcon />
        </button>
      </div>
      <div className="pl-4 pr-4">
        Choose the distance from:
        <Slider
          className="mt-6"
          value={query.r}
          min={1}
          max={100000}
          onChange={handleChangeRadius}
          valueLabelDisplay="on"
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
      <div className="p-2 flex flex-wrap max-w-96 justify-between">
        <button type='supermarket' className="m-1" onClick={() => {
          handleQuery('market');
        }}>
          Super market
        </button>
      </div>
      <div className="max-h-96 overflow-auto">
        {
          result?.map((item, index) => (<div key={index} className='p-2 border-t-2'>
            {`${index} - ${item.title}`}
          </div>))
        }
      </div>
    </div>
  )
}

export default SearchBar