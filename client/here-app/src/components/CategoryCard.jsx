import React, { useContext, useEffect, useState } from 'react'
import { MapContext, PlaceServiceContext, SearchContext } from '../layout/Map';

function CategoryCard(props) {
    const { Icon, title, setSearch } = props;
    const [isHovered, setIsHovered] = useState(false);


    const handleOnClickCateCard = () => {
        setSearch(title);
    }


    return (
        <div className={` p-2 flex flex-wrap max-w-96 justify-between  `} onMouseOver={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
            <button className={` rounded-full focus:outline-none outline-none relative border-2 border-primary m-1 bg-bg text-primary`}
                onClick={() => {
                    handleOnClickCateCard();
                }}>
                <Icon />
                <div className={`${isHovered ? 'block' : 'hidden'} text-primary absolute top-full left-3/4 z-50 bg-bg border-2 border-primary line-clamp-1`}>
                    {title}
                </div>
            </button>
        </div>

    )
}

export default CategoryCard