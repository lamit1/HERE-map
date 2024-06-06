import { configDotenv } from "dotenv";
import envConfig from "../envConfig";
import AxiosCustomInstance from "./instanceAxios";
import { googleGemini } from "./gemini";
import { elasticsearchService } from "./elasticsearch";
import fastify from "fastify";
import elasticsearch from "@fastify/elasticsearch";

configDotenv();

const getCities = async (startIndex: number, batchSize: number) => {
  return await AxiosCustomInstance.getInstance().get(
    `${envConfig.BACK4APP_URL}?skip=${startIndex}&limit=${batchSize}&keys=name`,
    {
      headers: {
        "X-Parse-Application-Id": envConfig.BACK4APP_APP_ID,
        "X-Parse-REST-API-Key": envConfig.BACK4APP_API_KEY,
      },
    }
  );
};

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

let cities = [];

const top10LocationsPrompt = (stateName: string) =>
  `List out for me top 10 locations that is famous for in state ${stateName}, and a description statements about 200 to 250 words about what is it, why it is famous for, the rating of that places with provider, related link to location and lattitude, longitude of location.  
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
            link:{
            url
            },
            postions: {
                latitude,
                longitude
            },
        }]
    }
    `;

const initCities = async () => {
  for (let i = 0; i <= 17; i++) {
    const res = await getCities(i * 1000, 1000);
    cities.push(res.data.results);
  }
};

const run = async () => {
  googleGemini.init();
  for (const state of states) {
    const promptString = top10LocationsPrompt(state);
    try {
      const res = await googleGemini.query(promptString);
      if (res) {
        console.log(JSON.parse(res));
      } else {
        throw new Error("Response was null");
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
