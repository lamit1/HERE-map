import { Modal } from "@mui/material";
import React, { useState } from "react";

const GalleryCard = ({ images = [] }) => {
  const [openImage, setOpenImage] = useState({
    isOpen: false,
    imageLink: "",
  });

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
          className="w-full h-full flex justify-center items-center"
        >
          <img
            className="border-2 max-h-96 w-auto rounded-2xl  border-bg object-cover"
            src={openImage.imageLink || "/assets/no-image.jpg"}
            alt=""
          />
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
            key={index}
            src={image.node.url}
            onClick={() => {
              setOpenImage({
                isOpen: true,
                imageLink: image.node.url,
              });
            }}
            className=" cursor-pointer h-28 w-28 rounded-xl border-2 border-scaffold"
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryCard;
