import React from 'react'

const GalleryCard = ({ images }) => {
  return (
    <div className="mt-2">
      <p className='text-pretty text-lg'>Photos: </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {(images?.length == 0 || images == null) &&
          <img className='border-2 rounded-2xl border-text w-40 h-40 object-cover' src="/assets/no-image.jpg" alt="No image available" srcset="" />
        }
        {images?.slice(0, 6)?.map(image => (
          <img src={image.node.url} className=' h-28 w-28 rounded-lg' />
        ))}
      </div>
    </div>
  )
}

export default GalleryCard