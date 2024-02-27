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
        <div className="flex flex-col bg-bg">
            {instructions?.length == 0 ? 
            <div className=""> No route found!</div>
            :
            <div className="flex flex-col">
                {instructions?.map((item, index) => (
                    <div key={index} className='p-1'>
                        <div className="">
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
