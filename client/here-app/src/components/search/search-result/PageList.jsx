import React from "react";
import { usePageResult } from "../../../layout/contexts/PageResultContext";

const PageList = ({ index = 0, maxPage = 0 }) => {
  const { setPage } = usePageResult();
  return maxPage >= 1 ? (
    <div className="py-2 max-h-20 flex-auto w-full flex border-y-2 border-scaffold">
      <div className=" flex flex-row flex-auto items-center justify-around">
        {Array.from({ length: maxPage }).map((_index, value) => {
          return (
            <div
              key={_index}
              onClick={() => {
                setPage((prevPage) => ({
                  ...prevPage,
                  index: Number(value),
                }));
              }}
              className={`flex hover:cursor-pointer 
                justify-center items-center
                 size-10 rounded-full
                 border-2
                  ${
                    index == Number(value)
                      ? "bg-primary text-bg border-bg"
                      : "bg-bg text-text border-text hover:bg-scaffold"
                  }
                  `}
            >
              {value + 1}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default PageList;
