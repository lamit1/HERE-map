import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useState, useRef, useEffect } from 'react';

const DescriptionCard = ({ description }) => {
  const [extended, setExtended] = useState(false);
  const [height, setHeight] = useState(0)
  const descriptionCardRef = useRef(null);

  useEffect(() => {
    setHeight(descriptionCardRef.current?.clientHeight);
  }, [])

  return (
    <div className="flex flex-col justify-center">
      <div ref={descriptionCardRef} className={'overflow-hidden  '  + ((extended || height < 128) ? ' max-h-fit' : 'max-h-32 bg-gradient-to-b from-text to-bg text-transparent bg-clip-text')}>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      {height >= 128 && (
        <div className="flex justify-center">
          <div onClick={() => setExtended(prevExtended => !prevExtended)} className='outline-none hover:cursor-pointer p-2  rounded-lg my-2'>
            {extended ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionCard;
