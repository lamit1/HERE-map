declare global {
    namespace NodeJS {
      interface ProcessEnv {
        US_ALL_XML_FILE_PATH : string | "./",
        JSON_STORE_FILE_PATH : string | "D:/",
        GRAPHQL_URI : string,
        INDEX_NAME: string,
        PRIVATE_ENCRYPT_KEY: string
        FETCH_DELAY: string,
        BATCH_SIZE: string,
        FILE_INDEX_START: string,
        FAIL_DELAY: string,
        GEMINI_API_KEY: string,
        BACK4APP_APP_ID: string,
        BACK4APP_API_KEY: string,
        BACK4APP_URL: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}