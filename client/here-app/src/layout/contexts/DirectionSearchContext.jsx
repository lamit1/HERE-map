import { createContext, useContext, useState } from "react";

const DirectionSearchContext = createContext();



export const DirectionSearchProvider = ({children, origin, destination}) => {
    const initialState = {
        origin: `${
            origin?.position?.lat || origin?.position?.lng
              ? `${origin?.position?.lat},${origin?.position?.lng}`
              : ""
          }` || "",
        originId: origin?.id || "",
        originName: origin?.name || "",
        destinationId: destination?.id || "",
        destinationName: destination?.name || "",
        destination:
          `${
            destination?.position?.lat || destination?.position?.lng
              ? `${destination?.position?.lat},${destination?.position?.lng}`
              : ""
          }` || "",
        transportMode: "car",
        returnType: "summary",
        focusOn: "",
        result: [],
        historyResult: [],
      };
    const [directionSearch, setDirectionSearch] = useState(initialState);
    return <DirectionSearchContext.Provider value={{directionSearch, setDirectionSearch}}>
        {children}
    </DirectionSearchContext.Provider>
}

export const useDirectionSearch = () => {return useContext(DirectionSearchContext)}
