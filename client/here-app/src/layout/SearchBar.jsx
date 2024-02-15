import React, { useContext, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { MapContext, SearchContext } from './Map';
import SearchInput from '../components/SearchInput';

function SearchBar(props) {
  const { map } = useContext(MapContext)
  const { service } = useContext(SearchContext)

  return (
    <div class="absolute left-2/4 top-1 min-w-13  w-fit h-fit bg-slate-500 rounded-md z-1">
      <div class="flex p-2 items-center">
        <div class="flex items-center justify-center  rounded-md size-10" onClick={() => searchLocation(query)}>
          <SearchIcon />
        </div>
        <SearchInput/>
      </div>
    </div>
  )
}

export default SearchBar