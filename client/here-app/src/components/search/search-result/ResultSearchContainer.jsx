import React from 'react'
import CategorySearchItem from './CategorySearchItem'
import ResultSearchItem from './ResultSearchItem'

const ResultSearchContainer = ({ items, handleChangeTab }) => {
    return (
        <div className='flex-1 min-h-24'>
            {items?.slice(0, 20).map((item, index) => {
                if (item.type === "location")
                    return < ResultSearchItem key={index} item={item} handleChangeTab={handleChangeTab} />
                if (item.type === "category")
                    return < CategorySearchItem key={index} item={item} handleChangeTab={handleChangeTab} />
            }
            )}
        </div>
    )
}

export default ResultSearchContainer