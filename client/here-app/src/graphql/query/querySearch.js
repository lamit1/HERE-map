import { gql } from "@apollo/client";

export const GET_SEARCH = `
query Search($latitude : Latitude!, $longitude : Longitude!, $query: String!, $first:Int) {
  search(near:{latitude: $latitude, longitude: $longitude}, query: $query, first:$first) {
      resultCount
      nodes {
        __typename
        ... on LocalBusiness {
          hours {
            isOpenNow
            today {
              start
              end
              dayOfWeek
            }
          }
          id
          name
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
          }
          rating {
            value
            provider
          }
          price
          reviews{
            totalCount
          }
        }
      }
    }    
}
`