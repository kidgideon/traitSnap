import { useEffect, useRef } from "react";

const AdBanner = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Set global ad options before loading script
    window.atOptions = {
      key: "5f16fc3e53ad681fcd61eca847c83244",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    };

    // Create script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//www.highperformanceformat.com/5f16fc3e53ad681fcd61eca847c83244/invoke.js";
    script.async = true;

    // Error handler for script load failure
    script.onerror = () => {
      console.warn("Ad script failed to load.");
    };

    // Append script only if ref exists
    if (adRef.current) {
      adRef.current.appendChild(script);
    }

    return () => {
      // Cleanup safely: check ref existence before clearing innerHTML
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={adRef} style={{ width: "100%", height: 50 , display: "flex", justifyContent: "center", alignItems: "center"}} />;
};

export default AdBanner;
