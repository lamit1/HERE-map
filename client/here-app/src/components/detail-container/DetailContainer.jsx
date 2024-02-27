import React, { useContext, useState, useEffect } from 'react';
import usePlaceDetail from '../../hooks/usePlace';
import CategoryContainer from './CategoryContainer';
import GalleryCard from './GalleryCard';
import ReviewCard from './ReviewCard';
import NearbyCard from './NearbyCard';
import DetailHeader from './DetailHeader';
import DescriptionCard from './DescriptionCard';
import InformationCard from './InformationCard';
import { SearchContext } from '../../layout/Map';
import { LocationOn } from '@mui/icons-material';

const DetailContainer = ({ id }) => {
    console.log(id);
    const [result, setResult] = useState(null);
    const { service } = useContext(SearchContext);
    const { detailLoading, detailError, detailData } = usePlaceDetail(id);

    useEffect(() => {
        if (String(id).startsWith("here")) {
            service?.lookup(
                { 'id': id },
                (res) => {
                    console.log(res);
                    setResult(res);
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }, [id]);

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
            </div>
        );
    } else {
        if (detailLoading || id === "") return <div className="">Loading</div>;
        if (detailError) return <div className="">Error</div>;

        return (
            <div className='flex flex-col gap-2 p-2'>
                <DetailHeader name={detailData?.place?.name} address={detailData?.place?.location} />
                <DescriptionCard description={detailData?.place?.description} />
                {detailData?.place?.__typename === "LocalBusiness" && (
                    <div className="">
                        <InformationCard website={detailData?.place?.website} phone={detailData.place?.phone} rating={detailData.place?.rating} totalCount={detailData.place?.reviews?.totalCount} />
                        <GalleryCard images={detailData.place?.photos?.edges} />
                        <ReviewCard reviews={detailData.place?.reviews?.nodes} />
                    </div>
                )}
            </div>
        );
    }
};

export default DetailContainer;
