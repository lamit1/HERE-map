import { Star } from '@mui/icons-material'
import React from 'react'

const RatingCard = ({ provider, value, totalCount }) => {
    if(provider == null) return null;
    return (
        <div className="text-pretty text-lg">
            <div className="flex">
                <div className='flex flex-1  mt-2'>
                    {provider == "YELP" && <img src="/assets/Yelp_Logo.png" className='flex-1 h-auto' />}
                    {provider == "TRIPADVISOR" && <img src="/assets/Tripadvisor-Logo.png" className='flex-1 h-auto' />}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className='flex flex-row items-center justify-center'>
                        {Array.from({ length: 5 }, (_, index) => index + 1).map(index => (
                            <div className={(index <= value) ? 'text-yellow' : 'text-text'}>
                                <Star />
                            </div>
                        ))}
                    </div>
                    <div className="text-center">{totalCount} reviews</div>
                </div>
            </div>
        </div>
    )
}

export default RatingCard