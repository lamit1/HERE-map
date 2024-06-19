import { app } from "../..";
import envConfig from "../../envConfig";
import { Coordinates } from "./models";
import { MapQuestAPI } from "./search";

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
          id: doc["track_id"],
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
            track_id: id,
          },
        },
      });
      const doc = res.hits.hits?.[0]._source as any;

      return {
        ...doc,
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
      return res.hits.hits.slice(0).map((item) => {
        const doc = item._source as any;
        return {
          ...doc,
          id: doc["track_id"],
        };
      });
    },
    article: async (
      _: any,
      { stateName }: { stateName: string },
      context: any
    ) => {
      const res = await app.elastic.search({
        index: envConfig.INDEX_NAME,
        body: {
          query: {
            match: {
              ["postalAbbreviations"]:
                decodeURIComponent(stateName).toUpperCase(),
            },
          },
        },
      });
      let docs = res.hits.hits.map((item) => item._source) as any[];
      try {
        const queries = docs?.[0]?.locations?.map(
          (location: { positions: Coordinates; title: String }) => ({
            latitude: location?.positions?.latitude,
            longitude: location?.positions?.longitude,
            query: location.title,
          })
        );
        let images: any[] = [];
        for (const query of queries) {
          images = [];
          if (!(query.latitude || query.longitude)) continue;
          const coord = {
            latitude: query.latitude,
            longitude: query.longitude,
          } as Coordinates;
          const mapQuestResponse = await MapQuestAPI.search(
            coord,
            query.query as String
          );
          const orderRatedLocations = mapQuestResponse.nodes.sort(
            (nodeA: any, nodeB: any) =>
              nodeB?.reviews?.totalCount - nodeA?.reviews?.totalCount
          ).filter((e: any) => e !== null);
          
          console.log(orderRatedLocations.length);
          images.push(
            orderRatedLocations  
              .slice(0, 5)
              .map((node: { photos: any }) => node.photos.edges)
              .flat()
              .map((edge: { node: { url: any } }) => edge.node.url)
          );
          const index = queries.indexOf(query);
          docs[0].locations[index].images = images
            .filter((image) => image.length > 0)
            .flat();
        }
        return {
          ...docs[0],
        };
      } catch (err) {
        console.log(err);
      }
    },
  },
};

export default resolvers;
