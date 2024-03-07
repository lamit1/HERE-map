import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InstructionItem from './InstructionItem';

export const InstructionModal = (props) => {
    const { instructions } = props
    return (
        <div className="flex flex-col bg-bg mt-2">
            {instructions?.length == 0 ? 
            <div className=""> No route found!</div>
            :
            <div className="flex flex-col border-r-2 border-scaffold gap-6 p-4 overflow-x-hidden">
                {instructions?.map((item, index) => (
                    // Instruction item
                    <InstructionItem key={index} instruction={item}/>
                ))}
            </div>
            }
        </div>
    )
}
