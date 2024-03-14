import { createContext, useContext, useState } from "react";

const PageResultContext = createContext();

export const PageResultProvider = ({ children }) => {
  const [page, setPage] = useState({ index: 0 , maxPage: 0});
  console.log(page?.maxPage);
  return (<PageResultContext.Provider value={{page,setPage}}>
    {children}
  </PageResultContext.Provider>);
};

export const usePageResult = () => {
  return useContext(PageResultContext);
};
