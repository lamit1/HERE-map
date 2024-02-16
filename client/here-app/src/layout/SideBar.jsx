import React, { useContext, useState } from 'react'
import DirectionBox from './DirectionBox'
import SearchBox from './SearchBox'
import TabOptionContainer from '../components/TabOptionContainer';
import TabOption from '../components/TabOption';
import { MapContext } from './Map';

const SideBar = () => {

    const { map } = useContext(MapContext);
    const TAB = {
        DIRECTION: "Direction",
        SEARCH: "Search"
    };
    const [tab, setTab] = useState(TAB.DIRECTION);

    const handleReturnTab = () => {
        switch (tab) {
            case TAB.DIRECTION:
                return <DirectionBox />;
            case TAB.SEARCH:
                return <SearchBox />;
            default:
                return null; // Add a default case to handle unexpected values of 'tab'
        }
    }

    const handleChooseTab = (tab) => {
        map?.removeObjects(map?.getObjects());
        setTab(tab);
    }


    return (
        <div className='absolute top-2 left-2 '>
            <TabOptionContainer>
                <TabOption onSelected={tab==TAB.DIRECTION} type={TAB.DIRECTION} handleChooseTab={() => handleChooseTab(TAB.DIRECTION)} />
                <TabOption onSelected={tab==TAB.SEARCH} type={TAB.SEARCH} handleChooseTab={() => handleChooseTab(TAB.SEARCH)} />
            </TabOptionContainer>
            {handleReturnTab()}
        </div>
    )
}

export default SideBar