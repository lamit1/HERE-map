import AxiosCustomInstance from "../../crawler/instanceAxios";
import { Coordinates } from "./models";

const searchQuery = `query Search($coord: GeoPointInput!, $query: String!) {
    search(near: $coord, query: $query, first: 50) {
      nodes {
        ... on LocalBusiness {
          name
          photos {
            edges {
              node {
                url
                caption
              }
            }
          }
          reviews {
            totalCount
            nodes {
              body
            }
          }
        }
      }
    }
  }`;

export const MapQuestAPI = {
  search: async (coord: Coordinates, query: String) => {
    try {
      const response = await AxiosCustomInstance.getInstance().post(
        "https://graphql.aws.mapquest.com/",
        {
          query: searchQuery,
          variables: {
            coord,
            query,
          },
        }
      );
      return response.data.data.search;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
