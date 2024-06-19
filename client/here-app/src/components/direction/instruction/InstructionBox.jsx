import React, { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import InstructionContainer from "./InstructionContainer";
import PrintPage from "../../../layout/PrintPage";

export const InstructionModal = ({ instructions, handleChangeTab }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(location.href);
    toast.success("Link copied!");
  };
  const [isPrinting, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
  };

  const closeModal = () => {
    setPrinting(false);
  }

  return (
    <div className="flex flex-col bg-bg">
      {instructions?.length == 0 ? (
        <div className="text-red"> ✖️ No route found!</div>
      ) : (
        <div className="flex flex-col border-r-2 border-scaffold gap-6 p-4 overflow-x-hidden">
          <div className="flex justify-around border-2 border-scaffold rounded-full h-12 overflow-hidden">
            <div
              onClick={handlePrint}
              className="bg-transparent flex-1  flex items-center justify-center font-bold hover:bg-primary hover:text-bg hover:cursor-pointer"
            >
              🖨️ Print
            </div>
            <div className="h-full w-0.5 bg-scaffold"></div>
            <div
              onClick={handleShare}
              className="bg-transparent flex-1  flex items-center justify-center font-bold hover:bg-primary hover:text-bg hover:cursor-pointer"
            >
              🔗 Share
            </div>
          </div>
          <div className="font-bold flex gap-2 items-center">
            <img
              className="size-12"
              src="/assets/map-marker-svgrepo-com (1).svg"
            />
            <p className="text-xl">Route details:</p>
          </div>
          <InstructionContainer instructions={instructions} />
          {isPrinting ? <PrintPage instructions={instructions} closeModal = {closeModal} /> : null}
        </div>
      )}
    </div>
  );
};
