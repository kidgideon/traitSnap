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
      adRef.current.innerHTML = "";
      adRef.current.appendChild(scriptConfig);
      adRef.current.appendChild(scriptAd);
    }

    return () => {
      if (adRef.current) adRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: 300,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default InlineBannerTwo;