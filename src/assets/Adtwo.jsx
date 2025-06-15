import { useEffect, useRef } from "react";

const InlineBannerTwo = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '8a5e2af560aca5053ce2806d6b3bd6e7',
        'format' : 'iframe',
        'height' : 50,
        'width' : 300,
        'params' : {}
      };
    `;

    const scriptAd = document.createElement("script");
    scriptAd.type = "text/javascript";
    scriptAd.src = "//www.highperformanceformat.com/8a5e2af560aca5053ce2806d6b3bd6e7/invoke.js";

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear old ad
      adRef.current.appendChild(scriptConfig);
      adRef.current.appendChild(scriptAd);
    }
  }, []);

  return (
    <div
  ref={adRef}
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "50px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // or rgba(255,255,255,0.95) if you want some transparency
    zIndex: 9999
  }}
/>
  );
};

export default InlineBannerTwo;