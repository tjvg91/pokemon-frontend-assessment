import { useEffect, useState } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

function getWindowSize(): WindowSize {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(getWindowSize);

  useEffect(() => {
    const handleResize = () => setSize(getWindowSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
