import { Language } from "@mui/icons-material";
import LocationOn from "@mui/icons-material/LocationOn";
import React from "react";
import RatingCard from "./RatingCard";

const DetailHeader = ({ name, address, website, value, totalCount }) => {
  return (
    <div>
      <div className="flex flex-row">
        <div className="flex-1 text-2xl font-bold max-w-72">{name}</div>
        <RatingCard value={value} totalCount={totalCount} />
      </div>
      <div className="flex flex-row items-center">
        <div className="text-red flex">
          <LocationOn />
        </div>
        <div className="ml-2 text-red">
          {`${address?.street + "," || ""} ${`${address?.locality},` || ""} ${
            address?.country
          }`}
        </div>
      </div>
      {website && (
        <div className="max-w-xs">
          <a
            className="flex flex-row items-center text-primary hover:cursor-pointer"
            href={website}
          >
            <div className="">
              <Language />
            </div>
            <div className="px-2 line-clamp-1">Website</div>
          </a>
        </div>
      )}
    </div>
  );
};

export default DetailHeader;
