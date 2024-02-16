import React, { useContext } from 'react'
import { MapContext, SearchContext } from '../layout/Map';

function CategoryCard(props) {
    const { icon, title, query, setResult, setSelected, selected } = props;
    const { service } = useContext(SearchContext);
    const { map } = useContext(MapContext);


    const onSuccess = (result) => {
        map?.removeObjects(map?.getObjects()?.filter(mapObject=> mapObject instanceof H.map.Marker));
        setResult(result.items);
        setSelected(title);
        result.items.forEach((location) => {
            console.log(location)
            let point = location?.access;
            if (point)
                map?.addObject(new H.map.Marker(
                    point[0],
                    {icon: new H.map.Icon("https://cdn-icons-png.flaticon.com/512/8830/8830930.png",{size: {w: 56, h: 56}}) }
                    ))});
        console.log(result)
    }

    const onError = (error) => {
        console.log(error);
    }

    const handleQuery = () => {
        if (title !== "") {
            const suggestQuery = {
                'q': title,
                // 'at': query.at,
                'limit': query.limit,
                'in': `circle:${query.at};r=${query.r}`
            }
            console.log(suggestQuery)
            service.autosuggest(suggestQuery, onSuccess, onError);
        }
    }
    return (
        <div className={`p-2 flex flex-wrap max-w-96 justify-between`}>
            <button className={`${selected ==  title ? 'bg-slate-300' : 'black' } m-1`} type='supermarket' onClick={() => {
                handleQuery();
            }}>
                {title}
            </button>
        </div>

    )
}

export default CategoryCard