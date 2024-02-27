import React from 'react'

const DescriptionCard = ({ description }) => {
  console.log(description)
  return (
    <div className="max-h-52 overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  )
}

export default DescriptionCard