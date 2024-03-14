import React, { useContext, useEffect, useState } from "react";
import { ContentCopy, Directions, Language, Share } from "@mui/icons-material";
import { LinkGenarator } from "./linkGenerator";
import { TAB } from "../../layout/SideBar";
import { useDirectionSearch } from "../../layout/contexts/DirectionSearchContext";

const InformationCard = ({
  website,
  location,
  title,
  phone,
  rating,
  totalCount,
  id,
  handleChangeTab,
  position
}) => {
  console.log(location);
  const [linkCopied, setLinkCopied] = useState(false);
  useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 5000);
    }
  }, [linkCopied]);
  const {setDirectionSearch} = useDirectionSearch();

  return (
    <div className="flex flex-col max-h-fit ">
      <div className="mt-4 flex flex-row flex-auto bg-bg border-2 border-scaffold rounded-2xl overflow-hidden">
        {(
          <div
            onClick={() => {
              window.history.pushState(null,"","/route-planer");
              handleChangeTab(TAB.DIRECTION);
              setDirectionSearch((prevSearch) => ({
                ...prevSearch,
                destinationName: title,
                destinationId: id,
                destination: position,
              }))
            }}
            className="flex flex-row items-center text-text hover:text-bg flex-1 hover:cursor-pointer  hover:bg-primary justify-center"
          >
            <Directions />
            <div className="p-2 text-lg ">Direction</div>
          </div>
        )}
        <div
          onClick={() => {
            navigator.clipboard.writeText(
              LinkGenarator.convertLocationToUrl(id, location?.country || location?.countryCode, title)
            );
            setLinkCopied(true);
          }}
          className="flex flex-row border-l-2 hover:cursor-pointer hover:bg-primary hover:text-bg border-scaffold items-center flex-1 justify-center"
        >
          <Share />
          <div className="p-2 text-lg">Share</div>
        </div>
      </div>
      {linkCopied && (
        <div className="flex-auto gap-4 items-center flex flex-row text-lg bg-primary mt-2 justify-center p-2 rounded-2xl text-center text-pretty text-bg">
          <ContentCopy />
          <div className="">Link copied</div>
        </div>
      )}
    </div>
  );
};

export default InformationCard;
