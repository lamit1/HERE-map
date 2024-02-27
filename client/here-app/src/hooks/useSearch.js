import { useEffect, useState } from 'react';
import { GET_SEARCH } from '../graphql/query/querySearch';

export function useSearch(lat, lng, query, service) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lat || !lng || !query) {
            setData([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                // Construct the GraphQL query
                const graphqlQuery = {
                    query: GET_SEARCH,
                    variables: { latitude: lat, longitude: lng, query: query }
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
                    console.log(responseData.data.search.edges[0].node.location)
                    responseData.data.search.edges?.forEach(item => newItems.push({
                        id: item.node.id,
                        name: item.node.name,
                        address: `${item.node.location?.street || ""} ${item.node.location?.county  || item.node.location?.locality || ""} ${item.node.location?.country || ""}`,
                        position: {
                            lat: item.node.coordinates.latitude,
                            lng: item.node.coordinates.longitude
                        },
                    }));
                    setData(newItems);
                    setLoading(false);
                } else {
                    console.log("Called here service!");
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
                                    name: item.title,
                                    address: item.address.label,
                                    position: item.position
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

    }, [lat, lng, query, service]);

    useEffect(() => {
        console.log(data);
    }, [data])

    return { loading, data, error };
}
