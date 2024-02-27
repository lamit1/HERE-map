import { gql } from "@apollo/client";

export const GET_PLACE_ID = gql`
query Search($latitude : Latitude!, $longitude : Longitude!) {
    locality(at: {latitude: $latitude, longitude: $longitude}) {
      id
    }
  }
`