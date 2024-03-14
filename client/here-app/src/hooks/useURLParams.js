import { useEffect, useState } from 'react';

function useURLParams() {
  const [path, setPath] = useState('');
  const [params, setParams] = useState({});

  useEffect(() => {
    // Function to update path and params
    const updateURLParams = () => {
      // Extracting path and search string from the URL
      const { pathname, search } = window.location;
      setPath(pathname);

      // Parsing search string to get URL parameters
      const paramsString = search.substring(1); // Remove leading '?'
      const paramsArray = paramsString.split('&');
      const paramsObj = {};
      paramsArray.forEach(param => {
        if(param !== '') {
          const [key, value] = param.split('=');
          paramsObj[key] = decodeURIComponent(value);
        }
      });
      console.log(paramsObj)
      setParams(paramsObj);
    };

    // Call the updateURLParams function when the component mounts
    updateURLParams();

    // Listen for changes in the URL and call updateURLParams when it changes
    window.addEventListener('popstate', updateURLParams);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', updateURLParams);
    };
  }, []);

  return { path, params };
}

export default useURLParams;
