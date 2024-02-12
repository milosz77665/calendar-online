import { useEffect, useRef, useState } from "react";

export default function useComponentHeight() {
  const [height, setHeight] = useState(0);
  const componentRef = useRef();

  useEffect(() => {
    function updateHeight() {
      if (componentRef.current) {
        setHeight(componentRef.current.clientHeight);
      }
    }

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);
  return [height, componentRef];
}
