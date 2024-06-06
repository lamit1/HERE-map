import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import InstructionItem from "../components/direction/instruction/InstructionItem";
import { InstructionsContext } from "./contexts/InstructionsContext";
import { TAB } from "./SideBar";
import ReactToPrint from "react-to-print";
import DirectionSummary from "../components/direction/DirectionSummary";

const PrintPage = ({
  instructions = [],
  closeModal,
  originName,
  destinationName,
  length,
  duration,
  transportMode,
}) => {
  const printContentRef = useRef(null);
  const printContent = useCallback(() => {
    return printContentRef.current;
  }, [printContentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return <button className="underline">Print</button>;
  }, []);

  return (
    <div className="fixed h-screen w-screen bg-bg top-0 left-0 z-50 text-text overflow-auto">
      {/* Header */}
      <div className="sticky h-10 bg-primary pl-2 flex text-bg items-center w-full font-bold text-xl no-print">
        MapOne
      </div>

      {/* Button */}
      <div className="flex justify-around no-print p-2 ">
        <button
          className="size-auto underline border-scaffold bg-bg text-scaffold rounded-md"
          onClick={closeModal}
        >
          Back to result
        </button>
        <ReactToPrint
          removeAfterPrint={false}
          trigger={reactToPrintTrigger}
          content={printContent}
        />
      </div>
      {/* Content */}

      <div className="flex items-center justify-center overflow-auto mt-4">
        <div className="border-dashed border-2 min-h-[841px]">
          <div ref={printContentRef} className="a4">
            <div className="page-content">
              <DirectionSummary
              />
              <h2 className="my-2 text-xl font-bold">Routing detail: </h2>
              <div className="flex flex-col gap-8">
                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={index % 7 === 0 && index > 0 ? "divider" : ""}
                  >
                    <InstructionItem instruction={instruction} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
