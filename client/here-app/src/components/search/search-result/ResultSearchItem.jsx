import { LocationOn } from "@mui/icons-material";
import React, { useContext, useEffect } from "react";
import { SearchBoxContext } from "../SearchBox";
import { DirectionContext } from "../../../layout/SideBar";
import { MapContext } from "../../../layout/Map";
import {
  removeSpecialCharacters,
  toLowerCaseNonAccentVietnamese,
} from "../../../utils/accent";
import { LinkGenarator } from "../../detail/linkGenerator";

const ResultSearchItem = ({ item }) => {
  const { map } = useContext(MapContext);
  console.log(item)
  const { setDetailId, setSearch, search } = useContext(SearchBoxContext);
  const { setDestination } = useContext(DirectionContext);
  const handleOnClickResultSearch = (item) => {
    setDetailId(item.id);

    //Get the localstorage items string.
    let items = localStorage.getItem("history");

    if (String(item.id).startsWith("here")) {
      setDestination((prevDes) => ({
        ...prevDes,
        position: item?.position,
        name: item?.name,
        id: item.id,
      }));

      // Check if the items are stored or not
      if (items != null) {
        // Parse the stored items
        let storedItems = JSON.parse(items);

        // Check if the stored items is an array
        if (Array.isArray(storedItems)) {
          let foundIndex = -1;

          // Find the index of the item with the same name if it exists
          for (let i = 0; i < storedItems.length; i++) {
            if (storedItems[i]?.name === item?.name) {
              foundIndex = i;
              break;
            }
          }

          // If the item with the same name was found, remove all occurrences of that item
          if (foundIndex !== -1) {
            storedItems = storedItems.filter(
              (item, index) => index !== foundIndex
            );
          }

          // Push the new item into the stored items array
          storedItems.push(item);

          // Store the updated items in local storage
          localStorage.setItem("history", JSON.stringify(storedItems));
        }
      } else {
        let storedItems = [];
        storedItems.push(item);
        localStorage.setItem("history", JSON.stringify(storedItems));
      }
    } else {
      setDestination({
        position: item?.position,
        name: item?.name,
        id: item.id,
      });
      //Add to local storage
      if (items != null) {
        // Parse the stored items
        let storedItems = JSON.parse(items);

        // Check if the stored items is an array
        if (Array.isArray(storedItems)) {
          let foundIndex = -1;

          // Find the index of the item with the same name if it exists
          for (let i = 0; i < storedItems.length; i++) {
            if (storedItems[i]?.name === item?.name) {
              foundIndex = i;
              break;
            }
          }

          // If the item with the same name was found, remove all occurrences of that item
          if (foundIndex !== -1) {
            storedItems = storedItems.filter(
              (item, index) => index !== foundIndex
            );
          }

          // Push the new item into the stored items array
          storedItems.push(item);

          // Store the updated items in local storage
          localStorage.setItem("history", JSON.stringify(storedItems));
        }
      } else {
        let storedItems = [];
        storedItems.push(item);
        localStorage.setItem("history", JSON.stringify(storedItems));
      }
    }
    console.log(item)
    window.history.pushState(
      null,
      "",
      LinkGenarator.convertLocationToUrl(item?.id, item?.country || "unknown", item?.name)
    );
  };

  const highlightMapQuestQuery = (text, query) => {
    if (query === "") return text;

    // Convert text and query to lowercase without accents
    let nonAccentText = toLowerCaseNonAccentVietnamese(text);
    let nonAccentQuery = toLowerCaseNonAccentVietnamese(query);
    // Split the text into an array of words
    let textWords = text.split(" ").filter((word) => word.trim() !== "");

    // Split the query into individual words
    let nonAccentQueryWords = nonAccentQuery
      .split(" ")
      .filter((word) => word.trim() !== "");
    let nonAccentTextWords = nonAccentText
      .split(" ")
      .filter((word) => word.trim() !== "");

    // Iterate through each word in the query
    nonAccentQueryWords.forEach((nonAccentQueryWord) => {
      // Find the index of the word in the text
      nonAccentTextWords.forEach((word, index) => {
        if (
          removeSpecialCharacters(nonAccentTextWords[index]) ==
          nonAccentQueryWord
        ) {
          textWords[index] = "<b>" + textWords[index] + "</b>";
        }
      });
    });
    // Join the array of words back into a single string
    let highlightedText = textWords.join(" ");

    return highlightedText;
  };

  const highlightHereMapQuery = (text = "", highlights = []) => {
    let highlightedText = text;
    // Sort highlights by start index in descending order
    highlights.sort((a, b) => b.start - a.start);
    for (const highlight of highlights) {
      const start = highlight.start;
      const end = highlight.end;
      highlightedText =
        highlightedText.slice(0, start) +
        "<b>" +
        highlightedText.slice(start, end + 1) +
        "</b>" +
        highlightedText.slice(end + 1);
    }
    return highlightedText;
  };

  const highlightQuery = (text, highlights, search) => {
    if (Array.isArray(highlights?.title)) {
      return highlightHereMapQuery(text, highlights?.title);
    }
    return highlightMapQuestQuery(text, search);
  };

  return (
    <div
      onMouseDown={() => handleOnClickResultSearch(item)}
      className="flex flex-row border-b-2  border-scaffold"
    >
      <div className="p-4  hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
        <div className="text-red">
          <LocationOn />
        </div>
        <div className=" line-clamp-1 ml-4 overflow-clip flex flex-col">
          <div
            dangerouslySetInnerHTML={{
              __html: highlightQuery(item?.name, item?.highlights, search),
            }}
          />
          <div className="text-xs text-pretty ">{item?.address}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultSearchItem;
