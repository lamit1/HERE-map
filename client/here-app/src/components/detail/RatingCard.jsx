import { Star } from "@mui/icons-material";
import React from "react";

const RatingCard = ({ value, totalCount, fontSize="medium" }) => {
  return (
    <div className=" text-pretty text-base">
      <div className="flex">
        <div className="relative flex-1 flex flex-col justify-start">
          {/* Yellow stars */}
          <div
            className={`flex z-10  flex-row items-center justify-start overflow-hidden`}
            style={{ width: `${Number((value || 0) * 20)}%` }}
          >
            {Array.from({ length: 5 }, (_, index) => index + 1).map((index) => (
              <div key={index} className="text-yellow">
                <Star fontSize={`${fontSize}`} />
              </div>
            ))}
          </div>
          {/* Black star */}
          <div
            className={`absolute top-0 left-0 right-0 flex flex-row items-center justify-start`}
          >
            {Array.from({ length: 5 }, (_, index) => index + 1).map((index) => (
              <div key={index} className={`text-text`}>
                <Star fontSize={`${fontSize}`}/>
              </div>
            ))}
          </div>
          <div className={`text-right text-yellow font-semibold ${fontSize!='medium' ? `text-sm` : 'text-base'}`}>
            {totalCount} reviews
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
