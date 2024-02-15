import React, { useContext, useRef, useState } from 'react'
import { MapContext, SearchContext } from '../layout/Map';

const SearchInput = ({ IconComponent, handleOnChoose }) => {
    const { service } = useContext(SearchContext);
    const { map } = useContext(MapContext);

    const [locations, setLocations] = useState([]);
    const [title, setTitle] = useState("")
    const [hidden, setHidden] = useState(false);

    const searchResultRef = useRef(null);


    const handleOnChangeSearch = (query) => {
        setTitle(query)
        if (query !== "") {
            service.geocode({
                'q': query
            }, onSuccess, onError);
        }
    }


    const handleOnClick = (item) => {
        let newTitle = item.title
        let position = {
            lat: item.position.lat,
            lng: item.position.lng
        }
        setTitle(newTitle);
        setHidden(true);
        handleOnChoose(`${position.lat},${position.lng}`, newTitle);
    }

    function onSuccess(data) {
        // Handle successful suggestions
        let items = data?.items;
        if (items !== null) {
            // Use the ref to access the DOM element
            setLocations(items);
        }
    }

    const handleOnFocus = () => {
        setHidden(false);
    }

    function onError(error) {
        // Handle errors
        console.error(error);
    }

    const handleOnBlur = () => {
        setHidden(true);
    }


    return (
        <div className="flex flex-row items-center relative"
            onBlur={() => handleOnBlur()}
        >
            {IconComponent ? <IconComponent /> : null}
            <input
                placeholder='Type to search'
                onChange={(e) => handleOnChangeSearch(e.target.value)}
                type='text'
                className="w-full h-12 rounded-md ml-1 p-2 z-10 relative"
                value={title}
                onFocus={() => handleOnFocus()}
            />
            {!hidden ? <ul
                ref={searchResultRef}
                className='flex flex-col w-full absolute top-12 right-0 max-h-40 overflow-auto z-20'
            >
                {locations?.map(item =>
                    <li key={item.title} className="p-1 bg-white border-2 z-4 hover:bg-blue-500 hover:cursor-pointer" onMouseDown={() => handleOnClick(item)}>
                        <div className="text-black max-w-32">{item.title}</div>
                    </li>
                )}
            </ul > : null}
        </div >

    )
}

export default SearchInput