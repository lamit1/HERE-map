import React, { useEffect, useState } from 'react';
import HEREMap from './layout/Map';


function App() {
  const apiKey = import.meta.env.VITE_API_KEY
  return (
    <HEREMap apikey={apiKey} />
  );
}

export default App;
