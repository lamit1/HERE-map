import { OpenInNew, Star } from "@mui/icons-material";
import React from "react";

const ReviewCard = ({ reviews, totalCount }) => {
  if (reviews == null) return null;
  return (
    <div className="mt-2">
      <p className="text-lg text-pretty font-bold">Reviews: </p>
      <div className="flex flex-wrap mt-2 bg-bg gap-3">
        {reviews?.slice(0, 5)?.map((review, index) => (
          <div
            key={index}
            className="p-4  max-w-full border-2 border-scaffold rounded-2xl"
          >
            <div className="flex flex-row">
              <img
                onError={(e) => {
                  e.target.src = "/assets/no-image.jpg"; // Replace the broken image with the placeholder image
                  e.target.onerror = null; // Prevent infinite loop by removing the error handler
                }}
                className="rounded-full w-20 h-20 object-cover border-4 border-primary"
                src={review.author.picture || "/assets/no-image.jpg"}
              />
              <div className="flex flex-row flex-auto">
                <div className="flex flex-col ml-2">
                  <p className="text-pretty font-bold text-lg max-w-24 overflow-clip">
                    {review.author.name}
                  </p>
                  <div className="text-sm">{review.date}</div>
                </div>
                <div className="flex-auto justify-end">
                  <div className="flex flex-row items-center justify-end">
                    {Array.from({ length: 5 }, (_, index) => index + 1).map(
                      (index) => (
                        <div
                          key={index}
                          className={
                            index <= review.rating / 2
                              ? "text-yellow"
                              : "text-text"
                          }
                        >
                          <Star />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-pretty">{review.body}</div>
            <div className="flex justify-end">
              <a href={review.url} className="flex flex-row gap-2 items-center mt-2 text-lg">
                <OpenInNew/>
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
