import { gql } from "@apollo/client";

export const GET_SEARCH = `
query Search($latitude : Latitude!, $longitude : Longitude!, $query: String!) {
    search(near:{latitude: $latitude, longitude: $longitude}, query: $query) {
        resultCount
        edges{
          node {
            ...on LocalBusiness {
              id
              name
              coordinates {
                latitude
                longitude
              }
              location {
                county
                country
                locality
              }
            }
          }
          distance
          textMatches {
            highlights {
              begin
              end
              text
            }
            fragment
            property
          }
        }
      }    
  }
`