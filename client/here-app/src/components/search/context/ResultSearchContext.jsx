import { createContext, useContext, useEffect, useState } from "react";

const ResultSearchContext = createContext();


const initialState = {
  items: [],
  keyword: ""
}

export const ResultSearchProvider = ({children}) => {
  const [searchResults, setSearchResults] = useState(initialState);
  return <ResultSearchContext.Provider value={{searchResults, setSearchResults}}>
    {children}
  </ResultSearchContext.Provider>
} 

export const useSearchResult = () => useContext(ResultSearchContext);