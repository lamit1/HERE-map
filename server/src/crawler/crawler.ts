import fastify, { FastifyInstance } from "fastify";
import elasticsearch from "@fastify/elasticsearch";
import cluster from "cluster";
import process, { env } from "process";
import os from "os";
const numCPUs = os.availableParallelism();
import { DataItem, readFolder, readItemsFromFile } from "./json";
import { elasticsearchService } from "./elasticsearch";
import { queryInBatch } from "./search";
import envConfig from "../envConfig";
import { configDotenv } from "dotenv";

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
const server = fastify();

configDotenv();


export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

server.listen({ port: 8082 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

server.register(elasticsearch, {
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "123456",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

server.after((err) => {
  if (err) {
    console.error(err);
  }
  run();
});

let start = Date.now();
let sumReqPerSec = 0;
let _count = 0;
let idArray = [];

const run = async () => {
  if (
    !(await elasticsearchService.isIndexExisted(server, envConfig.INDEX_NAME!))
  ) {
    await elasticsearchService.createIndex(server, envConfig.INDEX_NAME!);
  }
  console.log(envConfig.JSON_STORE_FILE_PATH)
  // Batch size for fetching docs
  const batchSize = Number(envConfig.BATCH_SIZE);
  const basePath = envConfig.JSON_STORE_FILE_PATH!;
  const fileNames = readFolder(basePath);

  for (
    let i = Number(envConfig.FILE_INDEX_START);
    i <= fileNames.length - 1;
    i++
  ) {
    const fileName = fileNames[i];

    // if (cluster.worker?.id === undefined) continue;
    // if (fileNames.indexOf(fileName) % numCPUs === cluster.worker?.id - 1) {
    const fileDataItems = readItemsFromFile(fileName, basePath);
    await recursiveQuery(server, fileDataItems, 0, batchSize);
    // }
  }
};

const recursiveQuery = async (
  server: FastifyInstance,
  fileDataItems: DataItem[],
  index: number,
  batchSize: number
) => {
  if (index >= fileDataItems.length) {
    console.log("Terminating recursion");
    return;
  }
  try {
    console.log(index);
    // Get existed id in batch items
    const notExistedAndUpdateItems =
      await elasticsearchService.checkExistedLocations(
        server,
        fileDataItems.slice(index, index + batchSize)
      );
    // console.log(
    //   "Existed + update items: " + JSON.stringify(notExistedAndUpdateItems)
    // );

    // Fetch docs in batch
    const fetchedDocs = await Promise.allSettled(
      queryInBatch(
        notExistedAndUpdateItems.map((idTimeStamp) => idTimeStamp.id)
      )
    );
    const reqPerSec = (fetchedDocs.length * 1000) / (Date.now() - start);
    if (fetchedDocs.length > 25) {
      sumReqPerSec = sumReqPerSec + reqPerSec;
      _count++;
    }
    console.log(`Average reqs/s : ${(sumReqPerSec / _count).toFixed(1)}`);
    console.log(`Time between batch call: ${Date.now() - start} ms`);
    start = Date.now();

    // Filter doc which is fulfilled
    const fulfilledDocs = fetchedDocs
      .filter(
        (x): x is PromiseFulfilledResult<any> =>
          x.status === "fulfilled" && x.value
      )
      .map((x) => x.value);
    console.log("Number of fetched docs: " + fulfilledDocs.length);

    if (fulfilledDocs.length > 25) {
      await delay(Number(envConfig.FETCH_DELAY));
    }

    // Format doc with timestamp
    const timestampDocs = fulfilledDocs
      .filter(
        (doc) => Object.keys(doc).length !== 0 && doc.constructor === Object
      )
      .map((doc) => {
        return {
          ...doc,
          track_id:
            notExistedAndUpdateItems.find(
              (dataItem) => Number(dataItem.id) === Number(doc?.id)
            )?.track_id || null,
          timestamp:
            notExistedAndUpdateItems.find(
              (dataItem) => Number(dataItem.id) === Number(doc?.id)
            )?.timestamp || null,
        };
      });

    // Insert doc
    await elasticsearchService.insertLocations(server, timestampDocs);

    // Call the next query
    await recursiveQuery(server, fileDataItems, index + batchSize, batchSize);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// console.log(`Worker ${process.pid} started`);
// }
