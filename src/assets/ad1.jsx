import { useEffect, useRef } from "react";

const InlineBannerOne = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Inject ad configuration as an inline script
    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : 'a9248628b9376af25c552a2a3ea9aa06',
        'format' : 'iframe',
        'height' : 60,
        'width' : 250,
        'params' : {}
      };
    `;

    // Inject ad script
    const scriptAd = document.createElement("script");
    scriptAd.type = "text/javascript";
    scriptAd.src = "//www.highperformanceformat.com/a9248628b9376af25c552a2a3ea9aa06/invoke.js";
    scriptAd.async = true;
    scriptAd.onerror = () => {
      console.warn("InlineBannerOne failed to load.");
    };

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear any previous ad
      adRef.current.appendChild(scriptConfig);
      adRef.current.appendChild(scriptAd);
    }

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, []);

  // Retain your exact div style as you had it
  return (
    <div
      ref={adRef}
      style={{
        width: 300,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default InlineBannerOne;