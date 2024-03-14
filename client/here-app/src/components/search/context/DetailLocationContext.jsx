import { createContext, useContext, useState } from "react";

const DetailLocationContext = createContext();

export const DetailLocationProvider = ({ children }) => {
  const [info, setInfo] = useState(null);

  return (
    <DetailLocationContext.Provider value={{ info, setInfo }}>
      {children}
    </DetailLocationContext.Provider>
  );
};

export const useDetailLocation = () => useContext(DetailLocationContext);
