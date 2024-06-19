import { addBubbleInfoCategory } from "../../utils/bubble";
import { GET_ARTICLES } from "../query/queryArticle";
import { GET_SEARCH } from "../query/querySearch";

export const fetchSearchMapQuest = async (
  map,
  lat,
  lng,
  query,
  setDestination,
  setDetailId,
  setSearchResults,
  handleChangeTab
) => {
  if (query == "") {
    return [];
  }

  try {
    // Construct the GraphQL query
    const graphqlQuery = {
      query: GET_SEARCH,
      variables: { latitude: lat, longitude: lng, query: query, first: 40 },
    };

    // Make a fetch request to your GraphQL endpoint
    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    if (responseData.data && responseData.data.search?.length > 0) {
      const newItems = [];
      map?.removeObjects(map?.getObjects());
      responseData.data.search?.forEach((item, index) => {
        newItems.push({
          id: item.id,
          name: item.name,
          type: "category",
          address: `${item.location?.street || ""} ${
            item.location?.county || item.location?.locality || ""
          } ${item.location?.country || ""}`,
          position: {
            lat: item.coordinates.lat,
            lng: item.coordinates.lon,
          },
          totalReviews: item?.reviews.totalCount,
          website: item?.website,
          price: item?.price,
          country: item?.location?.country,
          image: item?.photos?.primary?.url,
          rating: {
            provider: item?.rating?.provider,
            value: item?.rating?.value,
          },
        });

        addBubbleInfoCategory(
          map,
          item.coordinates.lat,
          item.coordinates.lon,
          item.id,
          item.name,
          item?.photos?.primary?.url,
          `${item.location?.street || ""} ${
            item.location?.county || item.location?.locality || ""
          } ${item.location?.country || ""}`,
          item.rating,
          item?.reviews.totalCount,
          setDestination,
          setDetailId,
          setSearchResults
        );
      });

      map?.setZoom(14);
      map?.setCenter(newItems[0].position || { lat, lng });
      return newItems;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchArticles = async (stateName = " ") => {
  const graphqlQuery = {
    query: GET_ARTICLES,
    variables: { stateName: stateName },
  };
  const res = await fetch("http://localhost:8080/graphql",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphqlQuery),
  });

  const data = await res.json(); 

  console.log(data);

  return data;
};
