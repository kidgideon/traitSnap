import { useEffect, useRef } from "react";

const InlineBannerOne = () => {
  const adRef = useRef(null);

  useEffect(() => {
    window.atOptions = {
      key: "a9248628b9376af25c552a2a3ea9aa06",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//www.highperformanceformat.com/a9248628b9376af25c552a2a3ea9aa06/invoke.js";
    script.async = true;

    script.onerror = () => {
      console.warn("InlineBanner468x60 failed to load.");
    };

    if (adRef.current) {
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
        width: 468,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default InlineBannerOne;