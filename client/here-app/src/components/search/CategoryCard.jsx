import React, { useContext, useEffect, useState } from 'react'

function CategoryCard(props) {
    const { Icon, title, search } = props;
    const [isHovered, setIsHovered] = useState(false);


    const handleOnClickCateCard = () => {
        search(title);
    }


    return (
        <div className={` p-2 flex flex-wrap max-w-96 justify-between  `} onMouseOver={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
            <button className={`flex justify-center items-center rounded-full size-10 focus:outline-none
             relative hover:bg-primary hover:text-bg border-2 border-scaffold bg-bg text-scaffold`}
                onClick={() => {
                    handleOnClickCateCard();
                }}>
                <Icon />
                <div className={` mobile:hidden tablet:${isHovered ? 'block' : 'hidden'} p-1 rounded-lg text-scaffold absolute top-full left-0 bg-bg border-2 border-scaffold line-clamp-1`}>
                    {title}
                </div>
            </button>
        </div>

    )
}

export default CategoryCard