
import envConfig from "../envConfig";
import { delay } from "./crawler";
import AxiosCustomInstance from "./instanceAxios";
const placeQuery = `query InfosheetDetails($id: ID!) {
  place(id: $id) {
    ... on LocalBusiness {
      id
      name
      description
      location {
        street
        locality
        county
        country
      }
      coordinates {
        latitude
        longitude
      }
      website
      photos {
        primary {
          url
          caption
        }
        edges {
          node {
            url
            caption
          }
        }
      }
      rating {
        value
        provider
      }
      price
      reviews {
        totalCount
        nodes {
          author {
            name
            picture
          }
          body
          date
          language
          rating
          url
          title
        }
      }
    }
  }
}`;

export async function searchById(id: number) {
  try {
    const response = await AxiosCustomInstance.getInstance().post(
      "https://graphql.aws.mapquest.com/",
      {
        query: placeQuery,
        variables: {
          id: id,
        },
      }
    );
    return response.data.data.place;
  } catch (error) {
    console.log(`Refetch the id: ${id}`);
    await delay(3000);
    return await searchById(id);
  }
}




export const queryInBatch = (
  notExistIds: number[]
) => {
  return notExistIds.map((j) => searchById(j));
};
