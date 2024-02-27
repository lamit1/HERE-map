import React, { useContext, useState } from 'react'
import DirectionBox from './DirectionBox'
import SearchBox from './SearchBox'
import ArrowBack from '@mui/icons-material/ArrowBack';
import { ArrowForward } from '@mui/icons-material';
import DetailContainer from '../components/detail-container/DetailContainer';


export const TAB = {
    DIRECTION: "Direction",
    SEARCH: "Search"
};

const SideBar = () => {
    const [tab, setTab] = useState(TAB.SEARCH);
    const [isClose, setIsClose] = useState(false);
    const [origin, setOrigin] = useState(null);

    const handleReturnTab = () => {
        switch (tab) {
            case TAB.DIRECTION:
                return <DirectionBox handleChangeTab = {(e) =>handleChangeTab(e)}  origin = {origin} />;
            case TAB.SEARCH:
                return <SearchBox handleChangeTab = {(e) =>handleChangeTab(e)} setOrigin={setOrigin} />;
            default:
                return null; // Add a default case to handle unexpected values of 'tab'
        }
    }

    const handleChangeTab = (tab) => {
        setTab(tab);
    } 

    const handleClose = () => {
        setIsClose(prevState => !prevState);
    }


    return (
        <div className='absolute flex flex-row top-0 left-0 shadow-2xl h-full bg-bg text-text'>
            {!isClose && handleReturnTab()}
            <div
                onClick={handleClose}
                className="absolute top-1/2 flex left-full w-8 h-12 shadow-2xl rounded-e-3xl hover:bg-scaffold hover:cursor-pointer bg-bg">
                {
                    (isClose) ?
                        <div className=" flex items-center flex-auto">
                            <ArrowForward />
                        </div>
                        :
                        <div className=" flex items-center flex-auto">
                            <ArrowBack />
                        </div>
                }
            </div>
        </div>
    )
}

export default SideBar