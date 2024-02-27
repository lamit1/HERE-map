import { useQuery } from '@apollo/client';
import { GET_PLACE_DETAIL } from '../graphql/query/queryPlace';


function usePlaceDetail(id) {
    console.log(id);
    const { loading: detailLoading, error: detailError, data: detailData } = useQuery(GET_PLACE_DETAIL, {
        variables: { id: id }, // Ensure id is not null
        skip: !id // Skip query execution if id is null or empty
    });
    console.log(detailError);

    console.log(detailData);

    return {detailLoading, detailError, detailData };   
}

export default usePlaceDetail;
