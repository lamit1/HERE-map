import { readFileSync } from "fs";
import { convertXML } from "simple-xml-to-json";
import AxiosCustomInstance from "../crawler/instanceAxios";
import fastify from "fastify";
import fs from "fs";
import envConfig from "../envConfig";


interface USAllFileType {
  sitemapindex: {
    xmlns: String;
    children: [
      {
        sitemap: {
          children: [{ loc: { content: String } }];
        };
      }
    ];
  };
}

type DataItem = {
  id: number;
  timestamp: Date | null;
};

const server = fastify();
server.listen({ port: 3031 }, (err, address) => {
  if (err) console.log(err);
});

const fetchUrlWithTimestamp = async (stateUrl: string) => {
  const json: { data: DataItem[] } = { data: [] };
  try {
    const axios = AxiosCustomInstance.getInstance();
    const res = await axios.get(stateUrl, { timeout: 100000 });
    const usFetchXMLObject = convertXML(res.data);
    const urlSet: any[] = usFetchXMLObject.urlset.children;
    for (const children of urlSet) {
      const locURL: string = children.url.children[0].loc.content;
      if (!children.url.children[1]) {
        const id = Number(locURL.split("-").at(-1));
        json.data.push({ id, timestamp: null });
      } else {
        const timestamp = new Date(children.url.children[1].lastmod.content);
        const id = Number(locURL.split("-").at(-1));
        json.data.push({ id, timestamp });
      }
    }
  } catch (err) {
    console.log(err);
  }
  return json;
};

const handleWriteFile = (json: string, filePath: string) => {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.writeFile(filePath, json, { flag: "wx" }, (error) => {
          console.log(error?.message);
        });
      } else {
        console.error("Error occurred while checking file existence:", err);
      }
    } else {
      console.log("File exists");
    }
  });
};

const readUsAllXmlFile = (filePath: string) => {
  const data = readFileSync(filePath);
  const usAllXMLObject: USAllFileType = convertXML(data.toString());
  let _count = 0;
  return usAllXMLObject.sitemapindex.children
    .map((i) =>
      i.sitemap.children
        .map((j) => {
          _count++;
          return j.loc.content;
        })
        .flat()
    )
    .flat();
};

server.after(async (error) => {
  if (error) {
    console.error(error);
  }
  try {
    let usSitemaps: String[] = readUsAllXmlFile("./jsonDownloader/us-all.xml");
    for (const stateUrl of usSitemaps) {
      const json = await fetchUrlWithTimestamp(stateUrl.valueOf());
      const filePath = `${
        envConfig.JSON_STORE_FILE_PATH
      }/${usSitemaps.indexOf(stateUrl)}.json`;
      handleWriteFile(JSON.stringify(json), filePath);
    }
  } catch (err) {
    console.error(err);
  }
});
