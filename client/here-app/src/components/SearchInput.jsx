import React, { useContext, useRef, useState } from 'react'
import { LocationContext, MapContext, SearchContext } from '../layout/Map';
import MyLocation from '@mui/icons-material/MyLocation';
import LocationOn from '@mui/icons-material/LocationOn';

const SearchInput = ({ IconComponent, handleOnChoose, value, setValue }) => {
    const { service } = useContext(SearchContext);
    const { map } = useContext(MapContext);
    const { userLocation } = useContext(LocationContext);

    const [locations, setLocations] = useState([]);
    const [title, setTitle] = useState("")
    const [hidden, setHidden] = useState(true);

    const searchResultRef = useRef(null);


    const handleOnChangeSearch = (query) => {
        if (query !== "") {
            service?.autosuggest({
                'q': query,
                'in': `circle:${userLocation.lat},${userLocation.lng};r=${100000}`,
                'limit': 10,
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

    const handleReverseGeocode = () => {
        service?.reverseGeocode({
            'at': `${userLocation?.lat},${userLocation?.lng}`
        }, (response) => {
            let title = response.items[0].address.label; 
            setTitle(title);
            handleOnChoose(`${userLocation?.lat},${userLocation?.lng}`, title);
        }, console.error);
    }

    return (
        <div className="flex flex-row items-center relative"
            onBlur={() => handleOnBlur()}
        >
            {IconComponent ? <IconComponent /> : null}
            <div className="relative w-full">
                <input
                    placeholder='Type to search'
                    onChange={(e) => {
                        handleOnChangeSearch(e.target.value);
                        setValue(e.target.value);
                    }}
                    type='text'
                    className="w-full h-12 rounded-md ml-1 p-2 z-10"
                    value={value}
                    onFocus={() => handleOnFocus()}
                />
                {!hidden ?
                    <ul
                        ref={searchResultRef}
                        className='flex flex-col w-full absolute top-12 right-0 max-h-40 overflow-auto z-20'
                    >
                        <li className='flex flex-row p-1 bg-white text-black border-2 z-4 hover:bg-blue-500 hover:cursor-pointer' onMouseDown={() => { handleReverseGeocode() }}>
                            <MyLocation />
                            <p className='pl-2'>
                                Current Location
                            </p>
                        </li>
                        {locations?.map(item =>
                            <li key={item.title} className="flex flex-row text-black p-1 bg-white border-2 z-4 hover:bg-blue-500 hover:cursor-pointer" onMouseDown={() => handleOnClick(item)}>
                                <LocationOn />
                                <div className="text-black max-w-32">{item.title}</div>
                            </li>
                        )}
                    </ul >
                    :
                    null}
            </div>
        </div >

    )
}

export default SearchInput