import fastify, { FastifyBaseLogger, FastifyInstance } from "fastify";
import elasticsearch from "@fastify/elasticsearch";
import process from "process";
import os from "os";
import fs from "fs";
import { mercurius } from "mercurius";
import resolvers from "./search/graphql/resolvers";
const numCPUs = os.availableParallelism();
import cors from "@fastify/cors";

export const app = fastify();

app.register(cors, {
  origin: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Length"],
});

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

app.register(elasticsearch, {
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "123456",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.register(mercurius, {
  schema: fs.readFileSync("./search/graphql/schema.graphql", {
    encoding: "utf-8",
  }),
  resolvers: resolvers,
});
