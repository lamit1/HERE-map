import { useContext, useState, useEffect } from "react";
import usePlaceDetail from "../../hooks/usePlace";
import GalleryCard from "./GalleryCard";
import ReviewCard from "./ReviewCard";
import DetailHeader from "./DetailHeader";
import DescriptionCard from "./DescriptionCard";
import InformationCard from "./InformationCard";
import { SearchContext } from "../../layout/Map";
import { LocationOn } from "@mui/icons-material";
import { SearchBoxContext } from "../search/SearchBox";
import { DirectionContext } from "../../layout/SideBar";

const DetailContainer = ({ id, handleChangeTab }) => {
  const [result, setResult] = useState(null);
  const { service } = useContext(SearchContext);
  const { detailLoading, detailError, detailData } = usePlaceDetail(id);
  const { setSearch } = useContext(SearchBoxContext);
  const { setDestination } = useContext(DirectionContext);

  useEffect(() => {
    if (String(id).startsWith("here")) {
      service?.lookup(
        { id: id },
        (res) => {
          setResult(res);
          setSearch(result?.title);
          setDestination({
            name: res?.title,
            position: res?.position,
            id: id,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      setSearch(detailData?.place?.name);
      setDestination({
        name: detailData?.place.name,
        position: {
          lat: detailData?.place?.coordinates.latitude,
          lng: detailData?.place?.coordinates.longitude,
        },
        id: id,
      });
    }
  }, [id, detailData]);

  if (String(id).startsWith("here")) {
    return (
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
    );
  } else {
    if (detailLoading || id === "")
      return <div className="flex">Loading...</div>;
    if (detailError) return <div className="">Error</div>;

    return (
      <div className="flex flex-col gap-2 p-2 overflow-auto">
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
            />
            <GalleryCard images={detailData.place?.photos?.edges} />
            <ReviewCard reviews={detailData.place?.reviews?.nodes} />
          </div>
        )}
      </div>
    );
  }
};

export default DetailContainer;
