import React from "react";
import { useDirectionResult } from "../../layout/contexts/DirectionResultContext";
import { measure } from "../../utils/distanceMeasure";

const DirectionSummary = () => {
  const { directionResult, setDirectionResult } = useDirectionResult();
  console.log(directionResult);
  return (
    <div className=" w-full my-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold">
        Travel plan from {directionResult?.locations.origin} to{" "}
        {directionResult?.locations.destination}
      </h2>
      <p className="text-lg text-pretty">
        Travel by:{" "}
        {directionResult.transportMode
          .split("")
          .map((s, index) => (index === 0 ? s.toUpperCase() : s))
          .join("")}
      </p>
      <summary className="flex flex-row justify-between">
        <p className=" text-lg text-pretty">
          Length:{" "}
          {measure.meterToMiles(directionResult?.length) > 0.25
            ? `${measure.meterToMiles(directionResult?.length)} miles`
            : `${measure.meterToFeets(directionResult?.length)} feets`}
        </p>
        <p className=" text-lg text-pretty">
          Durations: {measure.formatTimeDifference(directionResult?.duration)}
        </p>
      </summary>
    </div>
  );
};

export default DirectionSummary;
