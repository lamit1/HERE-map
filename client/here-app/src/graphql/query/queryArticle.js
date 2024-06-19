import { gql } from "@apollo/client";

export const GET_ARTICLES = `
query Search($stateName: String) {
    article(stateName: $stateName) {
        stateName,
        postalAbbreviations
        locations {
            images
            title
            description
            rating {
                value
                provider
            }
            link {
                url
            }
            positions {
                latitude
                longitude
            }
        }
    }
}
`