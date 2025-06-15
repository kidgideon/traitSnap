import { useEffect, useRef } from "react";

const InlineBannerOne = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Set window.atOptions BEFORE loading the script
    window.atOptions = {
      key: 'a9248628b9376af25c552a2a3ea9aa06',
      format: 'iframe',
      height: 60,
      width: 250,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "//www.highperformanceformat.com/a9248628b9376af25c552a2a3ea9aa06/invoke.js";

    if (adRef.current) {
      adRef.current.innerHTML = "";
      adRef.current.appendChild(script);
    }

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: "95%",
        height: "60px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default InlineBannerOne;