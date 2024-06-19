import { Link } from "@mui/icons-material";
import React from "react";

const LocationRating = ({ value, link }) => {
  return (
    <div className="">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2 items-center">
          <div className=" text-lg text-yellow">{value}</div>
          <img src="/assets/star.png" className=" size-5" />
        </div>
      </div>
    </div>
  );
};

export default LocationRating;
