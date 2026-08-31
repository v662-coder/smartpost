// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";

// import { Auth0Provider } from "@auth0/auth0-react";
// import "./index.css";
// import { RouterProvider } from "react-router-dom";
// import router from "./routes/router.jsx";
// import Provider from "./provider/Provider.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Auth0Provider
//       domain={import.meta.env.VITE_AUTH0_DOMAIN}
//       clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
//       authorizationParams={{
//         redirect_uri: window.location.origin,
//       }}
//       cacheLocation="localstorage" // for better session persistence across reloads
//     >
//       <Provider>
//         <RouterProvider router={router} />
//       </Provider>
//     </Auth0Provider>
//   </StrictMode>
// );


import { createRoot } from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import Provider from "./provider/Provider.jsx";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage" 
  >
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </Auth0Provider>
);