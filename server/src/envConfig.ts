import { configDotenv } from "dotenv";

configDotenv();

const envConfig = {
  US_ALL_XML_FILE_PATH: process.env.US_ALL_XML_FILE_PATH,
  JSON_STORE_FILE_PATH: process.env.JSON_STORE_FILE_PATH,
  GRAPHQL_URI: process.env.GRAPHQL_URI,
  INDEX_NAME: process.env.INDEX_NAME,
  FETCH_DELAY: process.env.FETCH_DELAY,
  BATCH_SIZE: process.env.BATCH_SIZE,
  FILE_INDEX_START: process.env.FILE_INDEX_START,
  FAIL_DELAY: process.env.FAIL_DELAY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

export default envConfig;
