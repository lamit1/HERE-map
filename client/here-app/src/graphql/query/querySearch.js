import { gql } from "@apollo/client";

export const GET_SEARCH = `
query Search($latitude : Float!, $longitude : Float!, $query: String!, $first:Int) {
  search(latitude: $latitude, longitude: $longitude, query: $query, first:$first) {
      id
      name
      location {
        street
        locality
        county
        country
      }
      coordinates {
        lat
        lon
      }
      website
      photos {
        primary {
          url
          caption
        }
        edges{
          node{
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
      reviews{
        totalCount
        nodes {
          title
          author {
            name
            picture
          }
          date
          rating
          language
          body
          url
        } 
      }
    }    
}
`;
