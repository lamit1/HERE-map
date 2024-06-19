import React from 'react'

const Container = ({children}) => {
  return (
    <div className='flex justify-center items-center w-full h-full'>
        {children}
    </div>
  )
}

export default Container