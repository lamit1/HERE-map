import React from 'react'
import { Language } from '@mui/icons-material';
import RatingCard from './RatingCard';
const InformationCard = ({ website, phone, rating, totalCount }) => {
    console.log(rating)
    return (
        <div className='flex flex-col'>
            {
                website &&
                <div className="flex flex-1 flex-row text-primary">
                    <Language />
                    <a className="line-clamp-1 ml-2" href={website}>
                        Website
                    </a>
                </div>
            }
            <RatingCard provider={rating?.provider} value={rating?.value} totalCount={totalCount} />
        </div>
    )
}

export default InformationCard