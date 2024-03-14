import { createContext, useContext, useState } from "react";



const DirectionResultContext = createContext();

const initialState = {
    locations: {
      origin: "",
      destination: "",
    },
    duration: 0,
    length: 0,
    actions: [],
  };

export const DirectionResultProvider = ({children}) => {
    const [directionResult, setDirectionResult] = useState(initialState);

    return <DirectionResultContext.Provider value={{directionResult, setDirectionResult: (e)=>setDirectionResult(e || initialState)}}>
        {children}
    </DirectionResultContext.Provider>
}

export const useDirectionResult = () => {return useContext(DirectionResultContext)}