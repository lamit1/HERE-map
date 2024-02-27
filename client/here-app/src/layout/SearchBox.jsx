import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { LocationContext, MapContext, PlaceServiceContext, SearchContext } from './Map';
import Slider from '@mui/material-next/Slider';
import CategorySearchItem from '../components/CategorySearchItem';
import CategoryCard from '../components/CategoryCard';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOn from '@mui/icons-material/LocationOn';
import { BusAlert, Close, Coffee, Directions, Hotel, MoreHoriz, Phone, School, Search, ShoppingCart, Timer } from '@mui/icons-material';
import { TAB } from './SideBar';
import DetailContainer from '../components/detail-container/DetailContainer';
import { useSearch } from '../hooks/useSearch';
import { GET_SEARCH } from '../graphql/query/querySearch';
import { debounce } from 'lodash';


export const CATEGORY_PLACES = ["Coffee", "Shop", "School", "Hotel"]

function SearchBox(props) {
  const { map } = useContext(MapContext);
  const { userLocation } = useContext(LocationContext);
  const { service } = useContext(SearchContext);
  const { handleChangeTab, setOrigin } = props;

  const [detailId, setDetailId] = useState("");

  const [search, setSearch] = useState("")

  const { loading, data, error } = useSearch(userLocation?.lat, userLocation?.lng, search, service);


  const [localSearch, setLocalSearch] = useState([]);

  const [locationDetail, setLocationDetail] = useState(null);


  function toLowerCaseNonAccentVietnamese(str) {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  const removeSpecialCharacters = (str) => {
    return str.replace(/[^\w\s]/gi, ''); // Replace all non-word characters (excluding whitespace) with an empty string
  };

  const highlightSearchQuery = (text, query) => {
    if (query === "") return text;

    // Convert text and query to lowercase without accents
    let nonAccentText = toLowerCaseNonAccentVietnamese(text);
    let nonAccentQuery = toLowerCaseNonAccentVietnamese(query);
    // Split the text into an array of words
    let textWords = text.split(" ").filter(word => word.trim() !== "");

    // Split the query into individual words
    let nonAccentQueryWords = nonAccentQuery.split(" ").filter(word => word.trim() !== "");
    let nonAccentTextWords = nonAccentText.split(" ").filter(word => word.trim() !== "");

    // Iterate through each word in the query
    nonAccentQueryWords.forEach(nonAccentQueryWord => {
      // Find the index of the word in the text
      nonAccentTextWords.forEach((word, index) => {
        if (removeSpecialCharacters(nonAccentTextWords[index]) == nonAccentQueryWord) {
          textWords[index] = '<b>' + textWords[index] + '</b>';
        }
      });
    });
    // Join the array of words back into a single string
    let highlightedText = textWords.join(" ");

    return highlightedText;
  };


  const handleViewDetailBubble = () => {
    // TODO: Set the detail

  }

  const addBubbleInfo = (map, lat, lng, name, address) => {
    console.log(address)
    //  Create & add the info bubble to position
    var group = new H.map.Group();
    const marker = new H.map.Marker(
      { lat, lng },
      { icon: new H.map.Icon("https://cdn-icons-png.flaticon.com/512/8830/8830930.png", { size: { w: 56, h: 56 } }) }
    );
    marker.setData(
      `<div>
        <p>
          <b>Title</b>: ${name}
        </p>
        <p>
          <b>Address</b>: ${address || ""}
        </p>
      </div>`
    );
    group?.addObject(marker);
    map?.addObject(group);
    group.addEventListener('tap', function (evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        // read custom data
        content: evt.target.getData()
      });
      // show info bubble
      map?.UI?.addBubble(bubble);
    }, false);
    // Set center to that position
  }

  const handleOnClickResultItem = (item) => {

    if (!item?.position) {
      alert("Location was unknown")
    } else {
      let newSearch = {
        name: item.name,
        position: { lat: item.position.lat, lng: item.position.lng },
        id: item.id || "",
        prevSearch: true
      }
      map?.removeObjects(map?.getObjects());
      setDetailId(item?.id)
      // Handle add theadiawhdiau to localStorage.
      addBubbleInfo(map, item.position.lat, item.position.lng, item.name, item.address)
      const origin = {
        position: {
          lat: item?.position?.lat, lng: item?.position?.lng
        },
        locationName: item?.name
      };
      setOrigin(origin);
      //Get the localstorage items string.
      let items = localStorage.getItem("history");

      //Check if the items is stored or not
      if (items != null) {
        // Check if the items is stored correct
        let storedItems = JSON.parse(items);
        if (Array.isArray(storedItems)) {
          if (!storedItems.includes(newSearch)) {
            storedItems.push(newSearch)
            localStorage.setItem("history", JSON.stringify(storedItems));
          } else {
            let newLocalSearch = storedItems.filter(item => item?.title != newSearch.name).push(newSearch);
            console.log(newLocalSearch)
            localStorage.setItem("history", JSON.stringify(newLocalSearch));
          }
        }
      } else {
        let newHistory = [];
        newHistory.push(newSearch);
        // If not, save the destination to localStorage.
        localStorage.setItem("history", JSON.stringify(newHistory));
      }
    }
  }

  const debouncedHandleMapViewChange = debounce(async (lat, lng, search) => {
    if (detailId == "" && CATEGORY_PLACES.includes(search)) {
      map?.removeObjects(map?.getObjects());
      const graphqlQuery = {
        query: GET_SEARCH,
        variables: { latitude: lat, longitude: lng, query: search }
      };

      // Make a fetch request to your GraphQL endpoint
      const response = await fetch('https://graphql.aws.mapquest.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      // Parse the response JSON
      const responseData = await response.json();

      // Check for errors in the response
      if (responseData.errors) {
        throw new Error(responseData.errors[0].message);
      }
      responseData?.data.search.edges?.forEach(
        item => {
          addBubbleInfo(map, item.node.coordinates.latitude,
            item.node.coordinates.longitude,
            item.node.name,
            `${item.node.location?.street || ""} ${item.node.location?.county || item.node.location?.locality || ""} ${item.node.location?.country || ""}`);
        }
      )
    } else if (detailId === "") {
      map?.removeObjects(map?.getObjects());
    }
  }, 500);


  const handleChangeMapPosition = (event) => {
    // Extract latitude and longitude from the event
    const lat = event.target.getCenter().lat;
    const lng = event.target.getCenter().lng;
    // Call the handleMapViewChange function with latitude and longitude
    debouncedHandleMapViewChange(lat, lng, search);
  }

  useEffect(() => {

    map?.addEventListener('mapviewchange', handleChangeMapPosition);

    return () => map?.removeEventListener('mapviewchange', handleChangeMapPosition);

  }, [map, detailId, search]);




  useEffect(() => {
    setLocationDetail(null);
    // Process the search flow
    if (search != "") {
      setSearch(search);
    } else {
      // Show the history option
      let storageString = localStorage.getItem("history");
      if (storageString != null) {
        let storageItems = JSON.parse(storageString);
        setLocalSearch(storageItems?.reverse()?.slice(0, 5));
        console.log(storageItems);
      }
    }
  }, []);


  const handleClear = () => {
    setSearch("");
    setDetailId("");
    map?.removeObjects(map?.getObjects());
    setOrigin(null);
  }

  const handleOnClickLocalSearch = (item) => {
    map?.removeObjects(map?.getObjects());
    setDetailId(item.id);
    setSearch(item.name);
    addBubbleInfo(map, item.position.lat, item.position.lng, item.name, item.address);
    const origin = {
      position: {
        lat: item?.position?.lat, lng: item?.position?.lng
      },
      locationName: item?.name
    };
    setOrigin(origin);
  }

  return (
    <div class="flex flex-col relative max-w-96 overflow-auto">
      <div className=" w-full bg-primary">
        <div className="flex flex-row  p-4 bg-transparent rounded-xl focus:border-primary">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Type to search ...' className=" placeholder-bg text-pretty text-lg text-bg flex-auto bg-primary outline-none "></input>
          {search != "" &&
            <div
              onClick={() => handleClear()}
              class="flex text-bg flex-1 px-2 justify-center items-center  hover:cursor-pointer" >
              <Close />
            </div>}
          <div
            onClick={() => {
              handleChangeTab(TAB.DIRECTION);
            }}
            className='flex-1 flex  text-bg  justify-center px-2 items-center hover:cursor-pointer'>
            <div className="">
              <Directions />
            </div>
          </div>
        </div>
      </div>
      {detailId != "" ?
        <DetailContainer id={detailId} />
        : <div className="flex flex-col overflow-auto overflow-x-hidden">
          {/* Category Search */}
          <div className="flex flex-row max-w-96">
            <CategoryCard setSearch={setSearch} title={"Hotel"} Icon={Hotel} />
            <CategoryCard setSearch={setSearch} title={"School"} Icon={School} />
            <CategoryCard setSearch={setSearch} title={"Coffee"} Icon={Coffee} />
            <CategoryCard setSearch={setSearch} title={"Shop"} Icon={ShoppingCart} />
          </div>
          <div className="h-0.5 bg-scaffold"></div>
          <div className=" max-h-fit overflow-y-auto overflow-x-hidden">
            <div className="py-2">
              {/*  If the location detail not null then show the location detail instead */}
              {
                data?.length > 0 ?
                  // Network search
                  data.slice(0, 5).map((item, index) => (
                    <div
                      onClick={() => handleOnClickResultItem(item)}
                      key={index}
                      className="flex flex-row flex-auto"
                    >
                      <div className="p-4  hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
                        <div className={`${item.prevSearch ? 'text-yellow' : 'text-red'} `}>
                          {item.prevSearch ? <Timer /> : <LocationOn />}
                        </div>
                        <div className=" line-clamp-1 ml-4 overflow-clip">
                          <div dangerouslySetInnerHTML={{ __html: highlightSearchQuery(item.name, search) }} />
                        </div>
                      </div>
                    </div>
                  ))
                  :
                  // Local search
                  localSearch.map((item, index) => (
                    <div
                      onClick={() => handleOnClickLocalSearch(item)}
                      key={index}
                      className="flex flex-row"
                    >
                      <div className="p-4  hover:bg-primary hover:text-bg hover:cursor-pointer flex flex-row flex-auto max-w-96 min-w-96">
                        <div className={`${item.prevSearch ? 'text-yellow' : 'text-red'} `}>
                          {item.prevSearch ? <Timer /> : <LocationOn />}
                        </div>
                        <div className=" line-clamp-1 ml-4 overflow-clip">
                          <div dangerouslySetInnerHTML={{ __html: highlightSearchQuery(item.name, search) }} />
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>}
    </div>
  )
}

export default SearchBox
