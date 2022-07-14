import { useEffect, useRef } from 'react';

const useInterval = (cb, delay) => {
  const cbRef = useRef();
  const isFirstRef = useRef(true);

  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    const callback = () => {
      if (cbRef.current) {
        return cbRef.current();
      }
    }
    if (isFirstRef.current) {
      callback();
      isFirstRef.current = false;
    }
    const timer = setInterval(() => {
      callback();
    }, delay);
    
    return () => clearInterval(timer);
  }, [delay]);
};

export default useInterval;
