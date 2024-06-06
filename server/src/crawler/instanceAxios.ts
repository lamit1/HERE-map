import axios, { AxiosInstance } from "axios";
import http, { Agent } from "node:http";
import https from "node:https";

export default class AxiosCustomInstance {
  private static instance: AxiosInstance;

  public static getInstance(): AxiosInstance {
    if (!AxiosCustomInstance.instance) {
      const httpAgent = new http.Agent({
        keepAlive: true,
      });
      const httpsAgent = new https.Agent({
        keepAlive: true,
      });
      AxiosCustomInstance.instance = axios.create({
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/41.0.2228.0 Safari/537.36",
        },
        httpAgent,
        httpsAgent,
      });
    }

    

    return AxiosCustomInstance.instance;
  }
}
