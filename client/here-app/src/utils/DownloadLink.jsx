import React from "react";

export const DownloadLink = ({ title, list, children }) => {
  const data = new Blob([list.join("\n")], { type: "text/plain" });
  const downloadLink = window.URL.createObjectURL(data);
  return (
    <>
      <style media="print" type="text/css">
        <a download={title || "mapOneRoute.txt"} href={downloadLink}>
          {children}
        </a>
      </style>
    </>
  );
};

export default DownloadLink;
