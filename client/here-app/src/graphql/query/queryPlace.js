import { gql } from "@apollo/client";

export const GET_PLACE_DETAIL = gql`
  query Search($id: ID!) {
    place(id: $id) {
      id
      name
      description
      location {
        country
        county
        locality
        street
      }
      coordinates {
        lat
        lon
      }
      ... on LocalBusiness {
        name
        photos {
          edges {
            node {
              url
            }
          }
          totalCount
        }
        rating {
          value
          provider
        }
        reviews {
          totalCount
          nodes {
            author {
              name
              picture
            }
            body
            date
            url
            rating
          }
        }
        website
      }
    }
  }
`;
