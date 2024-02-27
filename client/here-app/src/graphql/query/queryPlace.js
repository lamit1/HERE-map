import { gql } from "@apollo/client";

export const GET_PLACE_DETAIL = gql`
query Search($id: ID!) {
  place(id: $id) {
    id
    name
    location {
      country
      county
      locality
      street
    }
    description
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
      isClosed
      hours {
        open {
          dayOfWeek
          end
          start
        }
        isOpenNow
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
`