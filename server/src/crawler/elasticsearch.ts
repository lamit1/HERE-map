import { FastifyInstance } from "fastify";
import { DataItem } from "./json";
import envConfig from "../envConfig";
import { generator } from "./utils";
import { configDotenv } from "dotenv";

configDotenv();

interface HitSource {
  id: number;
  timestamp: Date | null;
  track_id: number | null;
}


const esQuery = {
  checkIdsQuery: (ids: Number[]) => ({
    index: envConfig.INDEX_NAME,
    body: {
      query: {
        terms: {
          id: ids,
        },
      },
    },
    size: ids.length,
  }),
  deleteByIdQuery: (id: Number) => ({
    index: process.env.INDEX_NAME!,
    query: {
      match: {
        id: id,
      },
    },
  }),
  checkStateQuery: (stateName: string) => ({
    index: envConfig.INDEX_NAME,
    body: {
      query: {
        bool: {
          must: [
            {
              exists: {
                field: "stateName",
              },
            },
            {
              term: {
                "stateName.keyword": stateName,
              },
            },
          ],
        },
      },
    },
  }),
};

export const elasticsearchService = {
  /** 
  @param: server|FasitfyInstance, id:number
  @return return the if of documents that arent not in ES or havent been updated by timestamp
  */
  checkExistedItems: async (
    server: FastifyInstance,
    batchItems: DataItem[]
  ) => {
    const batchIds: number[] = batchItems.map((idTimestamp) => idTimestamp.id);

    if (batchIds.length > 0) {
      try {
        // Fetch all the ids existed of batch ids in es
        const res = await server.elastic.search<HitSource>(
          esQuery.checkIdsQuery(batchIds)
        );

        // Map to existedIds
        const existedIds = res.hits.hits.map((loc) => Number(loc._source?.id));

        // Format to { id + timestamp } existedItems
        const existedItems = res.hits.hits.map(
          (loc) =>
            ({
              track_id: Number(loc._id),
              id: Number(loc._source?.id),
              timestamp: loc._source?.timestamp || null,
            } as DataItem)
        );

        // Filter Ids in batchIds that are not in the existing IDs
        const notExistedItems = batchItems.filter(
          (fileDataItem) => !existedIds.includes(fileDataItem.id)
        );

        // Get the update items
        const updateItems: DataItem[] = [];

        for (const existedItem of existedItems) {
          for (const batchItem of batchItems) {
            if (
              existedItem.timestamp &&
              batchItem.timestamp &&
              existedItem.id === batchItem.id &&
              existedItem.timestamp < batchItem.timestamp
            ) {
              console.log(
                `Delete item with id = ${existedItem.id}, old-timestamp = ${existedItem.timestamp}, new-timestamp = ${batchItem.timestamp}`
              );
              updateItems.push({
                ...batchItem,
                track_id: existedItem.track_id,
              });
            }
          }
        }

        // Delete old timestamp items
        for (const updateItem of updateItems) {
          await server.elastic.deleteByQuery(
            esQuery.deleteByIdQuery(updateItem.id)
          );
        }

        return Array.from(notExistedItems.concat(updateItems));
      } catch (error) {
        console.error(batchIds, " Error checking document existence:", error);
        return [];
      }
    }
    return [];
  },

  insertDocs: async (server: FastifyInstance, documents: any[]) => {
    try {
      // console.log("Before insert docs: " + JSON.stringify(documents));
      if (documents.length > 0) {
        const body = documents
          .filter(
            (document) => document?.id !== null && document?.error === undefined
          )
          .flatMap((document) => {
            const randomId = generator.getRandomId();
            try {
              return [
                {
                  index: {
                    _index: envConfig.INDEX_NAME,
                    _id: randomId,
                  },
                },
                {
                  ...document,
                  coordinates: {
                    lat: document.coordinates.latitude,
                    lon: document.coordinates.longitude,
                  },
                  track_id: document.track_id || randomId,
                },
              ];
            } catch (err) {
              console.log("error while convert doc: " + err);
              console.log("DOC ERROR: " + JSON.stringify(document));
              return;
            }
          });
        const response = await server.elastic.bulk({ body });
        if (response.errors) {
          console.error(response.items);
        }
      }
    } catch (error) {
      console.error("Error inserting documents into Elasticsearch:", error);
      console.log("ERROR INSERT DOC: " + JSON.stringify(documents));
    }
  },

  insertStateArticle: async (server: FastifyInstance, overview: any) => {
    try {
      const id = generator.getRandomId();
      const response = await server.elastic.index({
        index: envConfig.INDEX_NAME!,
        id: id.toString(),
        document: overview,
      });
    } catch (error) {
      console.error("Error inserting overviews into Elasticsearch:", error);
    }
  },

  isStateArticleExisted: async (server: FastifyInstance, stateName: string) => {
    const res = await server.elastic.search<HitSource>(
      esQuery.checkStateQuery(stateName)
    );
    return res.hits.hits.length > 0;
  },

  isIndexExisted: async (server: FastifyInstance, indexName: string) => {
    return await server.elastic.indices.exists({ index: indexName });
  },
  createIndex: async (
    server: FastifyInstance,
    indexName: string
  ) => {
    try {
      await server.elastic.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              coordinates: {
                type: "geo_point",
              },
              description: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              id: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              location: {
                properties: {
                  country: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  county: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  locality: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  street: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                },
              },
              name: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              photos: {
                properties: {
                  edges: {
                    properties: {
                      node: {
                        properties: {
                          caption: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                          url: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  primary: {
                    properties: {
                      caption: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      url: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                    },
                  },
                },
              },
              price: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              rating: {
                properties: {
                  provider: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  value: {
                    type: "float",
                  },
                },
              },
              reviews: {
                properties: {
                  nodes: {
                    properties: {
                      author: {
                        properties: {
                          name: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                          picture: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                        },
                      },
                      body: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      date: {
                        type: "date",
                      },
                      language: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      rating: {
                        type: "long",
                      },
                      title: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      url: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                    },
                  },
                  totalCount: {
                    type: "long",
                  },
                },
              },
              timestamp: {
                type: "date",
              },
              track_id: {
                type: "long",
              },
              website: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
