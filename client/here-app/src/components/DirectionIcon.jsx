import React from 'react';

const DirectionIconButton = ({ transportMode, IconComponent, onClick, selectedtransportMode }) => {
  const isSelected = transportMode === selectedtransportMode;

  return (
    <div
      type={transportMode}
      className={`hover:cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg ${isSelected ? 'bg-black' : 'hover:bg-black'
        }`}
      onClick={onClick}
    >
      <IconComponent />
    </div>
  );
};

export default DirectionIconButton;
