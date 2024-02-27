import LocationOn from '@mui/icons-material/LocationOn'
import React from 'react'

const DetailHeader = ({ name, address }) => {
  console.log(address)
  return (
    <div>
      <div className="text-pretty text-4xl font-bold line-clamp-1">{name}</div>
      <div className="flex flex-row items-center">
        <div className="text-red flex">
          <LocationOn />
        </div>
        <div className='ml-2 text-red'>
            {`${address?.street || ""} ${address?.locality || ""} ${address?.country}`}
        </div>
      </div>
    </div>
  )
}

export default DetailHeader