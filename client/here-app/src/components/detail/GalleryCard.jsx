import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React, { useState } from "react";

const GalleryCard = ({ images = [] }) => {
  const [openImage, setOpenImage] = useState({
    isOpen: false,
    imageLink: "",
  });
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <div className="mt-2">
      <Modal
        onClose={() => {
          setOpenImage({
            imageLink: "",
            isOpen: false,
          });
        }}
        open={openImage.isOpen}
      >
        <div
          onClick={() => {
            setOpenImage({
              imageLink: "",
              isOpen: false,
            });
          }}
          className="w-full h-full flex flex-row justify-around items-center"
        >
          {imageIndex > 0 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prevIndex) =>
                  prevIndex - 1 >= 0 ? prevIndex - 1 : 0
                );
              }}
              className="bg-scaffold rounded-full size-12 hover:cursor-pointer  flex justify-center items-center"
            >
              <ArrowBack />
            </div>
          )}
          <img
            className="border-2 max-h-96 w-auto rounded-2xl  border-bg object-cover"
            src={images[imageIndex]?.node?.url || "/assets/no-image.jpg"}
            alt=""
          />

          {imageIndex < 5 && imageIndex < images.length - 1 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prevIndex) =>
                  prevIndex + 1 <= images.length ? prevIndex + 1 : images.length
                );
              }}
              className="bg-scaffold rounded-full size-12 hover:cursor-pointer flex justify-center items-center"
            >
              <ArrowForward />
            </div>
          )}
        </div>
      </Modal>
      <p className="text-pretty text-lg font-bold">Photos: </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {(images?.length == 0 || images == null) && (
          <img
            className="  border-2 rounded-2xl border-scaffold w-40 h-40 object-cover cursor-pointer"
            src="/assets/no-image.jpg"
            alt="No image available"
          />
        )}
        {images?.slice(0, 6)?.map((image, index) => (
          <img
            onError={(e) => {
              e.target.src = "/assets/no-image.jpg"; // Replace the broken image with the placeholder image
              e.target.onerror = null; // Prevent infinite loop by removing the error handler
            }}
            key={index}
            src={image.node.url}
            onClick={() => {
              setOpenImage({
                isOpen: true,
              });
              setImageIndex(index);
            }}
            className=" cursor-pointer h-28 w-28 rounded-xl border-2 border-scaffold"
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryCard;
