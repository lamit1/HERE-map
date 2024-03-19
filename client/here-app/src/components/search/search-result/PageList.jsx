import React, { useEffect } from "react";
import { usePageResult } from "../../../layout/contexts/PageResultContext";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const PageList = ({ index = 0, maxPage = 0 }) => {
  const { setPage } = usePageResult();

  useEffect(()=>{
    console.log(index, maxPage);
  }, [index])

  return maxPage >= 1 ? (
    <div className="py-2 max-h-20 flex-auto flex-row justify-around items-center w-full flex border-y-2 border-scaffold">
      <div
        className="border-2 rounded-xl
      hover:cursor-pointer hover:bg-scaffold hover:text-bg hover:border-text
      flex items-center size-10 justify-center"
        onClick={() => {
          setPage((prevPage) => ({
            ...prevPage,
            index: prevPage.index - 1 >= 0 ? prevPage.index - 1 : 0,
          }));
        }}
      >
        <ArrowBack />
      </div>
      <div className=" flex flex-row items-center justify-around overflow-hidden border-2 rounded-xl">
        {(index == maxPage-1 && index > 1) && (
          <div
            className="flex hover:cursor-pointer 
          justify-center items-center
           size-10 bg-bg text-text border-r-2 hover:bg-scaffold"
          >
            ...
          </div>
        )}
        {Array.from({ length: 3 }).map((value, _index) => {
          return (
            ((index + _index ) > 0 && (index + _index ) <= maxPage) && <div
              key={_index}
              onClick={() => {
                setPage((prevPage) => ({
                  ...prevPage,
                  index: Number(index+_index-1),
                }));
              }}
              className={`flex hover:cursor-pointer 
                justify-center items-center
                 size-10 border-text 
                 ${index+_index == maxPage ? '' : 'border-r-2'}
                  ${
                    _index == 1
                      ? "bg-primary text-bg "
                      : "bg-bg text-text hover:bg-scaffold"
                  }
                  `}
            >
              {(index + _index )}
            </div>
          );
        })}
        {(index == 0 && maxPage>2) && (
          <div
            className="flex hover:cursor-pointer 
          justify-center items-center
           size-10 bg-bg  text-text hover:bg-scaffold"
          >
            ...
          </div>
        )}
      </div>
      <div
        onClick={(e) => {
          setPage((prevPage) => ({
            ...prevPage,
            index:
              prevPage.index + 1 < maxPage ? prevPage.index + 1 : maxPage - 1,
          }));
        }}
        className="border-2 rounded-xl
      hover:cursor-pointer hover:bg-scaffold hover:text-bg hover:border-text
      flex items-center size-10 justify-center"
      >
        <ArrowForward />
      </div>
    </div>
  ) : null;
};

export default PageList;
