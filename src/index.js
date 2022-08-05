import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import ReactGA from "react-ga4";

const root = ReactDOM.createRoot(document.getElementById("root"));

/* Google Analytics with React-ga 
-----------------------------------------------------*/
const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || null;
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
  ReactGA.send("pageview");
}
/*--------------------------------------------------*/

root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
