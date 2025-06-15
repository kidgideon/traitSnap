import { useEffect, useRef } from "react";

const InlineBannerOne = () => {
  const adRef = useRef(null);

  useEffect(() => {
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

    const scriptAd = document.createElement("script");
    scriptAd.type = "text/javascript";
    scriptAd.src = "//www.highperformanceformat.com/a9248628b9376af25c552a2a3ea9aa06/invoke.js";

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear previous ad if any
      adRef.current.appendChild(scriptConfig);
      adRef.current.appendChild(scriptAd);
    }
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