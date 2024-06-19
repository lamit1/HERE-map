import { fastifyElasticsearch } from "@fastify/elasticsearch";
import fastify from "fastify";
import { elasticsearchService } from "./elasticsearch";

const server = fastify();

server.register(fastifyElasticsearch, {
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "123456",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

server.listen({ port: 8082 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

server.after((err) => {
  if (err) {
    console.error(err);
  }
  run();
});

const run = async () => {
  await elasticsearchService.createIndex(server, "v2_heremap");
};
