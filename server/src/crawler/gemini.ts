import {
  GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import envConfig from "../envConfig";
import { configDotenv } from "dotenv";

let genAI = null;
let model: GenerativeModel | null = null;

configDotenv();

export const googleGemini = {
  init: () => {
    genAI = new GoogleGenerativeAI(envConfig.GEMINI_API_KEY || 'AIzaSyCqXL-uK_Q5ATUCSfsYblVwx8uIvqYvnr4');
    model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
  },
  query: async (promtQuery: string) => {
    if (model === null) throw Error("Model AI hasn't been inited!");
    try {
      const result = await model.generateContent(promtQuery);
      return result.response.text();
    } catch (err) {
      console.log(err);
    }
  },
};
