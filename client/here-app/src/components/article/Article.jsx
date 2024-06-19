import React from "react";
import LocationInfo from "./LocationInfo";

const Article = ({ article }) => {
  return (
    <div className=" bg-bg max-w-[50%] p-4  flex-col flex gap-4">
      <h1 className=" font-serif">Famous places in {article.stateName}</h1>
      {article?.locations.map((location, index) => (
        <LocationInfo key={index} location={location} index={index} />
      ))}
    </div>
  );
};

export default Article;
