import React from "react";
import LocationRating from "./LocationRating";
import { Link } from "@mui/icons-material";
import ImageSweeperContainer from "./ImageSweeperContainer";
import ImageMasonryContainer from "./ImageMasonryContainer";

const LocationInfo = ({ location, index }) => {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <h2 className=" text-balance text-xl text-red font-bold">
            {index + 1}. {location.title}
          </h2>
          <a className=" text-primary text-lg" href={location.link.url}>
            <Link />
          </a>
        </div>

        <LocationRating value={location.rating.value} />
      </div>

      {/* <ImageSweeperContainer images={location.images}/> */}
      <ImageMasonryContainer
        columnSize={4}
        images={location.images?.slice(0, 12)}
      />
      <p className=" text-pretty">{location.description}</p>
    </section>
  );
};

export default LocationInfo;
