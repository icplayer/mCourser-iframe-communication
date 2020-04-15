import { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }


function useElementHeight (element) {
    const [lastHeight, setLastHeight] = useState(-1);

    useEffect(() => {
        const sizes = element.getBoundingClientRect();
        if (Math.abs(lastHeight - sizes.height) > 20 || lastHeight < sizes.height) {
            setLastHeight(sizes.height);
        }
    }, []);

    useInterval(() => {
        const sizes = element.getBoundingClientRect();
        if (Math.abs(lastHeight - sizes.height) > 20 || lastHeight < sizes.height) {
            setLastHeight(sizes.height);
        }
    }, 500);

    return lastHeight;
}

export default useElementHeight;