import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { measure } from "../../../utils/distanceMeasure";
import { LocationOn } from "@mui/icons-material";

const InstructionItem = ({ instruction }) => {
  const formatTimeDifference = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60) % 60;
    const hours = Math.floor(milliseconds / (60 * 60)) % 24;
    const days = Math.floor(milliseconds / (60 * 60 * 24));
    if (days > 0) return `${days} days, ${hours} hours`;
    if (days == 0 && hours > 0) {
      return `${hours} hours, ${minutes} minutes`;
    }
    if (minutes > 0) {
      return `${minutes} minutes`;
    }
    return milliseconds + " seconds";
  };

  const handleDirectionIconRender = (direction) => {
    if (direction == null) {
      return <ArrowUpwardIcon />;
    }
    switch (direction) {
      case "left":
        return <ArrowBackIcon />;
      case "right":
        return <ArrowForwardIcon />;
    }
  };

  return (
    <div className="flex relative p-2 rounded-xl first:mt-2 border-scaffold border-2">
      <div className="absolute -top-4 -left-2 flex flex-row gap-2 ">
        <div className=" bg-bg p-2 border-2 border-scaffold rounded-xl ">
          {instruction?.action == "arrive" ? <LocationOn/> : handleDirectionIconRender(instruction?.direction)}
        </div>
        <div className="bg-bg p-2 border-2 border-scaffold rounded-xl">
          {instruction?.action == "arrive"
            ? "Arrive"
            : formatTimeDifference(instruction?.duration)}
        </div>
      </div>
      <div className="mt-8 mb-2 font-bold">
        {instruction?.action == "arrive"
            ? instruction.instruction : measure.formatStringContainMeasurement(instruction.instruction)}
      </div>
    </div>
  );
};

export default InstructionItem;
