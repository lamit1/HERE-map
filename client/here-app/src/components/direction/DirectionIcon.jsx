import React from 'react';

const DirectionIconButton = ({ transportMode, IconComponent, onClick, selectedtransportMode }) => {
  const isSelected = transportMode === selectedtransportMode;

  return (
    <div
      type={transportMode}
      className={`hover:cursor-pointer border-2 border-scaffold p-4 w-8 h-8 flex justify-center items-center rounded-xl ${isSelected ? 'bg-primary border-none text-bg' : 'hover:bg-scaffold'
        }`}
      onClick={onClick}
    >
      <IconComponent />
    </div>
  );
};

export default DirectionIconButton;
