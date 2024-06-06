import { gql } from "@apollo/client";

export const GET_PLACE_ID = gql`
query Search($latitude : Float!, $longitude : Float!) {
    locality(at: {latitude: $latitude, longitude: $longitude}) {
      id
    }
  }
`