import { app } from "../..";
import envConfig from "../../envConfig";

const resolvers = {
  Query: {
    locality: async (
      _: any,
      { latitude, longitude }: { latitude: number; longitude: number },
      context: any
    ) => {
      const res = await app.elastic.search({
        index: envConfig.INDEX_NAME,
        body: {
          post_filter: {
            geo_distance: {
              distance: "1000 km",
              coordinates: {
                lat: latitude,
                lon: longitude,
              },
            },
          },
        },
      });
      return res.hits.hits.map((item) => {
        const doc = item._source as any;
        return {
          ...doc,
          id: doc['track_id'],
        };
      });
    },
    place: async (_: any, { id }: { id: string }, context: any) => {
      // Your logic to fetch place details based on id
      console.log(id);
      const res = await app.elastic.search({
        index: envConfig.INDEX_NAME,
        query: {
          match: {
            track_id : id
          },
        },
      });
      const doc = res.hits.hits?.[0]._source as any;
      return {
        ...doc
      };
    },
    search: async (
      _: any,
      {
        latitude,
        longitude,
        query,
        first,
      }: { latitude: number; longitude: number; query: string; first: number },
      context: any
    ) => {
      // Your logic to perform a search based on latitude, longitude, query, and limit
      const res = await app.elastic.search({
        index: envConfig.INDEX_NAME,
        size: first,
        body: {
          query: {
            bool: {
              should: {
                match: {
                  name: query,
                },
              },
            },
          },
          post_filter: {
            geo_distance: {
              distance: "1000 km",
              coordinates: {
                lat: latitude,
                lon: longitude,
              },
            },
          },
        },
      });
      return res.hits.hits.map((item) => {
        const doc = item._source as any;
        return {
          ...doc,
          id: doc['track_id']
        };
      });
    },
  },
};

export default resolvers;
