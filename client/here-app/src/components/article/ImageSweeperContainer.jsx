import React, { useState } from "react";
import {ArrowBack, ArrowForward} from "@mui/icons-material"

const ImageSweeperContainer = ({ images = [] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (images === null || images.length === 0) return <div className="">Not have any images!</div>

  return (
    <div className="relative bg-text flex justify-center rounded-md">
      <div className="absolute left-4 top-1/2 bg-bg opacity-60 hover:opacity-100 rounded-full size-10 flex justify-center items-center cursor-pointer"
       onClick={(e) => setCurrentImage(prevIdx => prevIdx === 0 ? images.length-1 : prevIdx-1)}>
        <ArrowBack/>
      </div>
      <div className="absolute right-4 top-1/2 bg-bg opacity-60 hover:opacity-100 rounded-full size-10 flex justify-center items-center cursor-pointer"
       onClick={(e) => setCurrentImage(prevIdx => prevIdx === images.length-1 ? 0 : (prevIdx +1))}>
        <ArrowForward/>
      </div>
      <img src={images[currentImage]} className='w-auto h-96 m-2 rounded-md border-bg border-2'/>

    </div>
  );
};

export default ImageSweeperContainer;
