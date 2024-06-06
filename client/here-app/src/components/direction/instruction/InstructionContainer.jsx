import React, { forwardRef } from "react";
import InstructionItem from "./InstructionItem";

const InstructionContainer = forwardRef(({ instructions }, ref) => (
  <div className="flex flex-col gap-8" ref={ref}>
    {instructions.map((instruction, index) => (
      <InstructionItem key={index} instruction={instruction} />
    ))}
  </div>
));

export default InstructionContainer;
