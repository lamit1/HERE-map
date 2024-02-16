import React from 'react'

const TabOption = ({ type, handleChooseTab, onSelected }) => {
    return (
        <div onClick={handleChooseTab} className={`${onSelected ? 'bg-slate-500': 'bg-slate-300'  } p-2 rounded-t-xl text-center hover:bg-slate-900 h-10 align-middle`}>
            <p className='text-pretty text-lg text-white'>
                {type}
            </p>
        </div>
    )
}

export default TabOption