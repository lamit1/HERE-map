import { configDotenv } from "dotenv";
import { googleGemini } from "./gemini";

googleGemini.init();
configDotenv();

const promp = 'List out for me top 10 locations that is famous for in state California, and a description statements about 200 to 250 words about what is it, why it is famous for, the rating of that places with provider, and a valid image url with related link to location and lattitude, longitude of location if has';

const run = async () => {
    const result = await googleGemini.query(promp);
    const json = result ? JSON.parse(result) : ''
    console.log(json);
}


run();