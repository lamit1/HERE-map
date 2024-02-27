import { Star } from '@mui/icons-material'
import React from 'react'

const ReviewCard = ({ reviews, totalCount }) => {
  if(reviews == null) return null;
  console.log(reviews)
  return (
    <div className="mt-2">
      <p className='text-lg text-pretty'>Reviews: </p>
      <div className='flex flex-wrap mt-2 bg-bg gap-1'>
        {reviews?.slice(0, 5)?.map(review => (
          <div className="p-2 max-w-full border-2 border-scaffold rounded-xl">
            <div className="flex flex-row">
              <img className='rounded-full w-20 h-20 object-cover border-4 border-text' src={review.author.picture} alt="" />
              <div className="flex flex-row flex-auto">
                <div className="flex flex-col ml-2">
                  <p className='text-pretty font-bold text-lg max-w-24 overflow-clip'>{review.author.name}</p>
                  <div className="text-sm">
                    {review.date}
                  </div>
                </div>
                <div className="flex-auto justify-end">
                  <div className='flex flex-row items-center justify-end'>
                    {Array.from({ length: 5 }, (_, index) => index + 1).map(index => (
                      <div className={(index <= review.rating / 2) ? 'text-yellow' : 'text-text'}>
                        <Star />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-pretty">
              {review.body}
            </div>
            <div className="flex justify-end">
              <a href={review.url} className="">
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewCard