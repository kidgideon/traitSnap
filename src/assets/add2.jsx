import { useEffect, useRef } from "react";

const InlineBannerTwo = () => {
  const adRef = useRef(null);

  useEffect(() => {
    window.atOptions = {
      key: "8a5e2af560aca5053ce2806d6b3bd6e7",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//www.highperformanceformat.com/8a5e2af560aca5053ce2806d6b3bd6e7/invoke.js";
    script.async = true;

    script.onerror = () => {
      console.warn("CompactBanner320x50 failed to load.");
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
        width: 320,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default InlineBannerTwo;