import React, { createContext, useState } from 'react';

export const InstructionsContext = createContext();

export const InstructionsProvider = ({ children }) => {
  const [instructions, setInstructions] = useState([]);

  return (
    <InstructionsContext.Provider value={{ instructions, setInstructions }}>
      {children}
    </InstructionsContext.Provider>
  );
};