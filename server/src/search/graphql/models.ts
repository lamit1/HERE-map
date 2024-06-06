export interface LocalBussiness {
  id: string;
  name: string;
  website: string;
  rating: PlaceRating;
  price: PlacePriceLevel;
  location: Location;
  coordinates: Coordinates;
  photos: Photos;
  reviews: PlaceReviewConnection;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  street: string;
  locality: string;
  county: string;
  country: string;
}

export interface Photos {
  primary: Photo;
  edges: PhotoEdge[];
  totalCount: number;
}

export interface Review {
  author: string;
  body: string;
  date: string;
  language: string;
  rating: number;
  url: string;
  title: string;
}

export interface PhotoEdge {
  node: Photo;
}

export interface Photo {
  url: string;
  caption: string;
}

export interface PlaceRating {
  value: number;
  provider: PlaceRatingProvider;
}

export interface PlaceReviewConnection {
  totalCount: number;
  nodes: Review[];
}

enum PlaceRatingProvider {
  "PRICELINE",
  "TRIPADVISOR",
  "YELP",
}

enum PlacePriceLevel {
  "FREE",
  "INEXPENSIVE",
  "MODERATE",
  "EXPENSIVE",
  "VERY_EXPENSIVE",
}
