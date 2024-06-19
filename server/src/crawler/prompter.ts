import { configDotenv } from "dotenv";
import envConfig from "../envConfig";
import AxiosCustomInstance from "./instanceAxios";
import { googleGemini } from "./gemini";
import { elasticsearchService } from "./elasticsearch";
import fastify from "fastify";
import elasticsearch from "@fastify/elasticsearch";

configDotenv();

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

let cities: any[] = [];

const top10LocationsPrompt = (stateName: string) =>
  `List out for me top 10 locations that is famous for in state ${stateName}, and a description statements about 200 to 250 words about
  what is it,
  why it is famous for,
  the rating of that places with provider,
  and with valid images with title,
  home page to location and lattitude, longitude of location.  
  format it like this
    {
        stateName,
        postalAbbreviations
        locations: [{
            title,
            description,
            rating: {
                value,
                provider
            },
            images: [{
              url,
              name
            }],
            link:{
            url
            },
            positions: {
                latitude,
                longitude
            },
        }]
    }
    `;

const run = async () => {
  if (
    !(await elasticsearchService.isIndexExisted(server, envConfig.INDEX_NAME!))
  ) {
    await elasticsearchService.createIndex(server, envConfig.INDEX_NAME!);
  }
  googleGemini.init();

  // await initCities();
  // const cityArr = cities.flat().map((city) => city.name);

  for (const state of states) {
    const promptString = top10LocationsPrompt(state);
    try {
      if (!(await elasticsearchService.isStateArticleExisted(server, state))) {
        const res = await googleGemini.query(promptString);
        if (res) {
          const article = JSON.parse(res);
          await elasticsearchService.insertStateArticle(server, article);
          console.log(JSON.stringify(article));
        } else {
          throw new Error("Response was null");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const server = fastify();

server.listen({ port: 8085 }, (err, address) => {
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
