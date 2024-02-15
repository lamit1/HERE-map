import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const InstructionModal = (props) => {

    const handleDirectionIconRender = (direction) => {
        if (direction == null) {
            return <ArrowUpwardIcon />
        }
        switch (direction) {
            case 'left':
                return <ArrowBackIcon />
            case 'right':
                return <ArrowForwardIcon />
        }
    }

    const { instructions } = props
    return (
        <div className="absolute rounded-md top-0 left-full ml-2 w-80 h-auto max-h-96 overflow-auto bg-slate-500 p-2">
            <div className="text-lg text-pretty font-medium">
                Instructions
            </div>
            {instructions?.length == 0 ? 
            <div className=""> No route found!</div>
            :
            <div className="flex flex-col">
                {instructions?.map((item, index) => (
                    <div key={index} className='p-1'>
                        <div className="">
                            {`${index + 1}`}
                            {handleDirectionIconRender(item?.direction)}
                            {`${item?.instruction}`}
                        </div>
                    </div>
                ))}
            </div>
            }
        </div>
    )
}
