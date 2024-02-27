import React, { useContext } from 'react'
import { MapContext } from '../layout/Map';

const CategorySearchItem = (props) => {
    const { item } = props;
    const {map} = useContext(MapContext);

    const handleViewDetail = (position)=> {
        if(!position?.lat || !position?.lng) {
            console.error("Error in position of map!");
        } else {
            map?.setCenter(position);
        }
    }

    return (
        item?.address?.label != null ? <div className="p-2 flex bg-bg flex-col max-w-96 justify-between border-t-2">
            <p className='text-pretty text-lg'>
                {item?.title}
            </p>
            <p className='text-pretty text-xs'>
                Address: {item?.address?.label}
            </p>
            <p className="">
                Categories:
            </p>
            <div className="flex flex-row ">
                {item?.categories?.map((category, index) => (
                    <div key={index} className='text-sm p-2 text-justify'>
                        {category?.name}
                    </div>
                ))}
            </div>
            <button onClick={()=>handleViewDetail(item?.access[0])}>View detail</button>
        </div> : null
    )
}

export default CategorySearchItem