import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React, { useState } from "react";

const ImageMasonryContainer = ({ images = [], columnSize = 3 }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const handleOpenModal = (imgIndex) => {
    setCurrentImage(imgIndex);
    setModalOpen(true);
  };

  if (images === null || images.length === 0)
    return (
      <div className="flex bg-text flex-row flex-wrap gap-2 p-2 mt-2 rounded-md overflow-hidden">
        <img
          loading="lazy"
          src={'/assets/no-image.jpg'}
          className=" w-36 hover:opacity-50 hover:cursor-pointer h-auto rounded-md border-2 border-bg"
        ></img>
      </div>
    );

  return (
    <div className="flex bg-text flex-row flex-wrap gap-2 p-2 mt-2 rounded-md overflow-hidden">
      <Modal onClose={(e) => setModalOpen(false)} open={isModalOpen}>
        <div className="">
          <div
            className="absolute text-text left-4 top-1/2 bg-bg opacity-60 hover:opacity-100 rounded-full size-10 flex justify-center items-center cursor-pointer"
            onClick={(e) =>
              setCurrentImage((prevIdx) =>
                prevIdx === 0 ? images.length - 1 : prevIdx - 1
              )
            }
          >
            <ArrowBack />
          </div>
          <div
            className="absolute text-text right-4 top-1/2 bg-bg opacity-60 hover:opacity-100 rounded-full size-10 flex justify-center items-center cursor-pointer"
            onClick={(e) =>
              setCurrentImage((prevIdx) =>
                prevIdx === images.length - 1 ? 0 : prevIdx + 1
              )
            }
          >
            <ArrowForward />
          </div>
          <img
            src={images[currentImage]}
            onError={(e) => {
              e.target.src = "/assets/no-image.jpg";
            }}
            className=" max-w-[800px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-96 m-2 rounded-md border-bg border-2"
          />
        </div>
      </Modal>

      {Array.from({
        length: images.length < columnSize ? images.length : columnSize,
      }).map((_, index) => (
        <div key={index} className=" flex flex-1 flex-col gap-2 ">
          {images
            .filter((image, imgIndex) => imgIndex % columnSize === index)
            .map((imageUrl, imgUpdateIndex) => (
              <img
                loading="lazy"
                src={imageUrl}
                key={imgUpdateIndex}
                onError={(e) => {
                  e.target.src = "/assets/no-image.jpg";
                }}
                onClick={(e) =>
                  handleOpenModal(imgUpdateIndex * columnSize + index)
                }
                className="  w-full hover:opacity-50 hover:cursor-pointer h-auto rounded-md border-2 border-bg"
              ></img>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ImageMasonryContainer;
