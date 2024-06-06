import fs, { readFileSync } from "fs";
import path from "path";

export type DataItem = {
  id: number;
  timestamp: Date | null;
  track_id: number | null
};

export const readFolder = (folderPath: string) => {
  const files = fs.readdirSync(folderPath);
  return files;
};

export const readItemsFromFile = (fileName: string, folderPath: string) => {
  let idTimestamp: DataItem[] = [];
  const filePath = path.join(folderPath, fileName);
  const fileContent = readFileSync(filePath);
  const jsonObject: { data: DataItem[] } = JSON.parse(fileContent.toString());

  // Use an object to keep track of the latest timestamp for each id
  const latestTimestamps: { [id: number]: Date | null } = {};

  // Loop through the data to find the latest timestamp for each id
  jsonObject.data.forEach((item) => {
    const { id, timestamp } = item;
    if (timestamp !== null) {
      if (!latestTimestamps[id]) {
        // console.log("insert");
        latestTimestamps[id] = timestamp;
      } else if (latestTimestamps[id] !== null) {
        latestTimestamps[id] = timestamp;
      }
    }
  });

  // Convert the latest timestamps object back to an array of DataItem objects
  idTimestamp = Object.keys(latestTimestamps).map((id) => ({
    id: parseInt(id),
    timestamp: latestTimestamps[parseInt(id)],
    track_id: null
  }));

  return idTimestamp;
};
