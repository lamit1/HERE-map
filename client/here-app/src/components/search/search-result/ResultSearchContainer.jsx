import React, { useContext, useEffect, useRef } from "react";
import CategorySearchItem from "./CategorySearchItem";
import ResultSearchItem from "./ResultSearchItem";
import { usePageResult } from "../../../layout/contexts/PageResultContext";
const ResultSearchContainer = ({ items, handleChangeTab }) => {
  const {page} = usePageResult();
  return (
    <div className="flex-1 min-h-24">
      {items?.slice(page?.index*15, (page?.index+1)*15).map((item, index) => {
        if (item.type === "location")
          return (
            <ResultSearchItem
              key={index}
              item={item}
              handleChangeTab={handleChangeTab}
            />
          );
        if (item.type === "category")
          return (
            <CategorySearchItem
              key={index}
              item={item}
              handleChangeTab={handleChangeTab}
            />
          );
      })}
    </div>
  );
};

export default ResultSearchContainer;
