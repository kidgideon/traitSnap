import { useEffect, useRef } from "react";

const BannerAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '271a0cfa48bdef5d7255a077d0a98c38',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    const scriptAd = document.createElement("script");
    scriptAd.type = "text/javascript";
    scriptAd.src = "//www.highperformanceformat.com/271a0cfa48bdef5d7255a077d0a98c38/invoke.js";

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear old ad
      adRef.current.appendChild(scriptConfig);
      adRef.current.appendChild(scriptAd);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{ width: "95%", height: "60px", overflow: "hidden" , display: "flex", justifyContent: "center", alignItems: "center"}}
    />
  );
};

export default BannerAd;
