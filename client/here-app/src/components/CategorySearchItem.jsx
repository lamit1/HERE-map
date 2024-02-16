import React from 'react'

const CategorySearchItem = (props) => {
    const { item } = props;
    return (
        item?.address?.label != null ? <div className="p-2 flex flex-col max-w-96 justify-between border-t-2">
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
        </div> : null
    )
}

export default CategorySearchItem