import { useContext, useState, useEffect } from "react";
import usePlaceDetail from "../../hooks/usePlace";
import GalleryCard from "./GalleryCard";
import ReviewCard from "./ReviewCard";
import DetailHeader from "./DetailHeader";
import DescriptionCard from "./DescriptionCard";
import InformationCard from "./InformationCard";
import { MapContext, SearchContext } from "../../layout/Map";
import { ArrowBack, LocationOn } from "@mui/icons-material";
import { SearchBoxContext } from "../search/SearchBox";
import { DirectionContext } from "../../layout/SideBar";
import { useDetailLocation } from "../search/context/DetailLocationContext";
import { CircularProgress } from "@mui/material";
import { useDirectionSearch } from "../../layout/contexts/DirectionSearchContext";
import { addBubbleInfoCategory, addBubbleLabel } from "../../utils/bubble";
import { useSearchResult } from "../search/context/ResultSearchContext";
import { LinkGenarator } from "./linkGenerator";

const DetailContainer = ({ id, handleChangeTab }) => {
  const [result, setResult] = useState(null);
  const { service } = useContext(SearchContext);
  const { detailLoading, detailError, detailData } = usePlaceDetail(id);
  const { setDetailId } = useContext(SearchBoxContext);
  const { setDirectionSearch } = useDirectionSearch();
  const { setInfo } = useDetailLocation();
  const { map } = useContext(MapContext);
  const { setDestination } = useContext(DirectionContext);
  const { setSearchResults } = useSearchResult();
  const handleBack = () => {
    if (!document.referrer.startsWith(window.location.origin)) {
      console.log(document.referrer);
      history.replaceState(null, "", "/");
    } else {
      window.history.back();
    }
    map?.removeObjects(map?.getObjects());
    setDetailId("");
    setInfo(null);
    setDirectionSearch((prevSearch) => ({
      ...prevSearch,
      origin: "",
      originId: "",
      originName: "",
      destinationId: "",
      destinationName: "",
      destination: "",
    }));
  };

  useEffect(() => {
    console.log(id);
    if (String(id).startsWith("here")) {
      service?.lookup(
        { id: id },
        (res) => {
          setResult(res);
          setDirectionSearch((prevSearch) => ({
            ...prevSearch,
            destinationName: res?.title,
            destination: res?.position,
            destinationId: id,
          }));
          addBubbleLabel(
            map,
            res?.title,
            res?.address?.label,
            res?.position,
            id,
            res?.title,
            res?.address?.conuntry
          );
          console.log(res);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.log(detailData?.place?.coordinates.lat, detailData?.place?.coordinates.lon, detailData?.place?.name);
      if (
        detailData?.place?.coordinates.lat &&
        detailData?.place?.coordinates.lon &&
        detailData?.place?.name
      ) {
        history.replaceState(
          null,
          null,
          LinkGenarator.convertLocationToUrl(
            id,
            detailData.place.location.country,
            detailData.place.name
          )
        );
        setDirectionSearch((prevSearch) => ({
          ...prevSearch,
          destinationName: detailData?.place.name,
          destination:  `${detailData?.place?.coordinates.lat},${detailData?.place?.coordinates.lon}`,
          destinationId: id,
        }));
        map?.removeObjects(map?.getObjects());
        addBubbleInfoCategory(
          map,
          detailData?.place?.coordinates.lat,
          detailData?.place?.coordinates.lon,
          detailData?.place?.id,
          detailData?.place?.name,
          detailData?.place?.photos?.edges?.[0]?.node?.url,
          `${detailData?.place?.location?.street + "," || ""} ${
            `${detailData?.place?.location?.locality},` || ""
          } ${detailData?.place?.location?.country}`,
          detailData.place?.rating,
          detailData?.place?.reviews?.totalCount,
          setDestination,
          setDetailId,
          setSearchResults,
          detailData?.place?.location?.country || "unknown"
        );
      }
    }
  }, [id, detailData]);

  useEffect(() => {
    const handlePopstate = () => {
      map?.removeObjects(map?.getObjects());
      setDetailId("");
      setInfo(null);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  

  if (String(id).startsWith("here")) {
    return (
      <>
        <div className=" mobile:hidden laptop:flex w-full bg-primary text-bg flex flex-row justify-start items-center p-2 ">
          <div onClick={handleBack} className="hover:cursor-pointer p-2">
            <ArrowBack />
          </div>
          <div className=" text-pretty ml-4 text-lg">Back</div>
        </div>
        <div className="p-4">
          <div className="text-pretty text-lg font-bold">{result?.title}</div>
          <div className="flex flex-row ">
            <div className="text-red">
              <LocationOn />
            </div>
            <div className=" text-sm font-bold text-red flex items-center">
              {result?.address?.label}
            </div>
          </div>
          <InformationCard
            id={id}
            location={result?.address}
            title={result?.title}
            rating={0}
            totalCount={0}
            handleChangeTab={handleChangeTab}
          />
          <GalleryCard images={[]} />
        </div>
      </>
    );
  } else {
    if (detailLoading || id === "")
      return (
        <div className=" flex-auto flex justify-center items-center">
          <div className="flex flex-row gap-4">
            <div className="flex items-center">
              <CircularProgress sx={{ fontSize: 18 }} />
            </div>
            <div className="text-pretty text-xl font-bold text-primary">
              Loading...
            </div>
          </div>
        </div>
      );

    return (
      <>
        <div
          className="
         w-full bg-primary text-bg flex flex-row justify-start items-center p-2 
          mobile:hidden laptop:flex
         "
        >
          <div
            onClick={() => {
              if (!document.referrer.startsWith(window.location.origin)) {
                history.replaceState(null, "", "/");
              } else {
                window.history.back();
              }
              map?.removeObjects(map?.getObjects());
              setDetailId("");
              setInfo(null);
              setDirectionSearch((prevSearch) => ({
                ...prevSearch,
                origin: "",
                originId: "",
                originName: "",
                destinationId: "",
                destinationName: "",
                destination: "",
              }));
            }}
            className="hover:cursor-pointer p-2"
          >
            <ArrowBack />
          </div>
          <div className=" text-pretty  ml-4 text-lg">Back</div>
        </div>
        {detailError ? (
          <div className="flex items-center justify-center h-full text-red">
            ❌ Location not found!
          </div>
        ) : (
          <div className="h-auto flex flex-col gap-2 mobile:p-2 overflow-auto ">
            <div className=" tablet:hidden " onClick={handleBack}>
              <ArrowBack />
            </div>
            <DetailHeader
              name={detailData?.place?.name}
              address={detailData?.place?.location}
              value={detailData.place?.rating?.value}
              totalCount={detailData.place?.reviews?.totalCount}
              website={detailData?.place?.website}
            />
            <DescriptionCard description={detailData?.place?.description} />
            {detailData?.place?.__typename === "LocalBusiness" && (
              <div className="">
                <InformationCard
                  id={id}
                  location={detailData?.place.location}
                  title={detailData?.place?.name}
                  website={detailData?.place?.website}
                  phone={detailData.place?.phone}
                  handleChangeTab={handleChangeTab}
                  position={`${detailData?.place?.coordinates?.lat},${detailData?.place?.coordinates?.lon}`}
                />
                <GalleryCard images={detailData.place?.photos?.edges} />
                <ReviewCard reviews={detailData.place?.reviews?.nodes} />
              </div>
            )}
          </div>
        )}
      </>
    );
  }
};

export default DetailContainer;
