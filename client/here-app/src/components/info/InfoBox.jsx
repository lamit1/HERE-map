import React from 'react';

export function InfoBox({ name, imageUrl, address, rating, totalReviews, handleViewDetailClick }) {
    return (
        <div className="flex flex-col p-4 bg-white">
            <div className="flex items-center">
                <img src={imageUrl || "/assets/no-image.jpg"} className="w-12 h-12 mr-2 rounded-full border border-gray-300 object-cover" alt="Place" />
                <div className="flex flex-col flex-1">
                    <div className="font-bold text-lg truncate">{name}</div>
                    <div className="text-sm text-gray-600 truncate">{address}</div>
                </div>
            </div>
            <div className="flex items-center justify-center mt-4">
                {rating?.provider && (
                    <>
                        <img src={(rating.provider === "YELP" && "/assets/Yelp_Logo.png") || (rating.provider === "TRIPADVISOR" && "/assets/TripAdvisor_Logo.svg") || ""} alt="Rating provider" className="h-auto w-20" />
                        <div className="flex items-center justify-center">
                            <div>{rating.value}</div>
                            <img src="/assets/star.png" alt="Star" className="h-4 ml-1" />
                        </div>
                    </>
                )}
                <div className="flex-1 text-center text-sm text-gray-600">{totalReviews} Reviews</div>
            </div>
            <div className="flex justify-between mt-4">
                <button className="flex-1 px-2 py-1 bg-green-500 text-white rounded cursor-pointer" onClick={handleViewDetailClick}>View Detail</button>
                <button className="flex items-center justify-center flex-1 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer">
                    <img src="/assets/share.svg" alt="Share" className="w-4 h-auto" />
                </button>
            </div>
            <button className="flex-1 mt-2 px-2 py-1 bg-red-500 text-white rounded cursor-pointer">Direction</button>
        </div>
    );
}

export default InfoBox;
