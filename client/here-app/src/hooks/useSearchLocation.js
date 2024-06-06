import { useEffect, useState } from 'react';
import { GET_SEARCH } from '../graphql/query/querySearch';

export function useSearchLocation(map,lat, lng, query, service) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        if (!lat || !lng || query == "") {
            setData([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                // Construct the GraphQL query
                const graphqlQuery = {
                    query: GET_SEARCH,
                    variables: { latitude: lat, longitude: lng, query: query, first: 5 }
                };
                // Make a fetch request to your GraphQL endpoint
                const response = await fetch('http://localhost:8080/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(graphqlQuery),
                });

                // Parse the response JSON
                const responseData = await response.json();
                console.log(responseData);

                // Check for errors in the response
                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }

                // Check if data is received from GraphQL
                if (responseData.data?.search != null && responseData.data?.search?.length > 0 ) {
                    const newItems = [];
                    responseData.data.search?.forEach(item => {
                        newItems.push({
                            id: item.id,
                            type: "category",
                            name: item.name,
                            address: `${item.location?.street || ""} ${item.location?.county || item.location?.locality || ""} ${item.location?.country || ""}`,
                            position: {
                                lat: item.coordinates.lat,
                                lng: item.coordinates.lon
                            },
                            country: item.location?.country,
                            totalReviews: item?.reviews.totalCount,
                            website: item?.website,
                            price: item?.price,
                            image: item?.photos?.primary?.url,
                            rating: {
                                provider: item?.rating?.provider,
                                value: item?.rating?.value
                            }
                        })
                    }
                    );

                    setData(newItems);
                    setLoading(false);
                } else {
                    // If no data is received, fetch data from HERE Maps API
                    const params = {
                        q: query,
                        at: `${lat},${lng}`,
                        limit: 5,
                    };
                    service?.autosuggest(params,
                        (result) => {
                            const newItems = [];
                            result.items?.forEach(item => {
                                newItems.push({
                                    id: item.id,
                                    type: "location",
                                    name: item.title,
                                    address: item.address?.label,
                                    position: item.position,
                                    highlights: item.highlights,
                                    country: item.address.country
                                });
                            });
                            setData(newItems);
                            setLoading(false);
                        },
                        (error) => {
                            setError(error);
                            setLoading(false);
                        }
                    );
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();

    }, [lat, lng, query]);

    return { loading, data, error };
}
