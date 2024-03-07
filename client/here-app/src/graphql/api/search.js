import { addBubbleInfoCategory } from "../../utils/bubble";
import { GET_SEARCH } from "../query/querySearch";

export const fetchSearchMapQuest = async (
    map,
    lat,
    lng,
    query,
    setDestination,
    setDetailId,
    setSearch,
    handleChangeTab) => {

    if (query == "") {
        return [];
    }

    try {
        // Construct the GraphQL query
        const graphqlQuery = {
            query: GET_SEARCH,
            variables: { latitude: lat, longitude: lng, query: query, first: 40 }
        };

        // Make a fetch request to your GraphQL endpoint
        const response = await fetch('https://graphql.aws.mapquest.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphqlQuery),
        });

        // Parse the response JSON
        const responseData = await response.json();

        // Check for errors in the response
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        // Check if data is received from GraphQL
        if (responseData.data && responseData.data.search.resultCount > 0) {
            const newItems = [];
            map?.removeObjects(map?.getObjects());
            responseData.data.search.nodes?.forEach((item, index) => {
                newItems.push({
                    id: item.id,
                    name: item.name,
                    type: "category",
                    address: `${item.location?.street || ""} ${item.location?.county || item.location?.locality || ""} ${item.location?.country || ""}`,
                    position: {
                        lat: item.coordinates.latitude,
                        lng: item.coordinates.longitude
                    },
                    totalReviews: item?.reviews.totalCount,
                    website: item?.website,
                    price: item?.price,
                    country: item?.location?.country,
                    image: item?.photos?.primary?.url,
                    rating: {
                        provider: item?.rating?.provider,
                        value: item?.rating?.value
                    }
                });

                addBubbleInfoCategory(
                    map,
                    item.coordinates.latitude,
                    item.coordinates.longitude,
                    item.id,
                    item.name,
                    item?.photos?.primary?.url,
                    `${item.location?.street || ""} ${item.location?.county || item.location?.locality || ""} ${item.location?.country || ""}`,
                    item.rating,
                    item?.reviews.totalCount,
                    setDestination,
                    setDetailId,
                    setSearch
                );
            }
            );

            map?.setZoom(14);
            map?.setCenter(newItems[0].position || { lat, lng })
            return newItems;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
    }
};