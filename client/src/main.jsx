import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from './routes/router.jsx';
import Provider from '../provider/Provider.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-vx4fgd6jh5ud3z7w.us.auth0.com"
      clientId="5R16rlGQlQxaiXLp2SN1ueFPDGChcguk"
      authorizationParams={{ 
        redirect_uri: window.location.origin 
      }}
      cacheLocation="localstorage" // Optional: for better session persistence
    >
    {/* <Auth0Provider
  domain="dev-vx4fgd6jh5ud3z7w.us.auth0.com"
   clientId="5R16rlGQlQxaiXLp2SN1ueFPDGChcguk"
  authorizationParams={{
    redirect_uri: window.location.origin,
    // audience: "https://smartpost-api",
    // scope: "openid profile email"
  }}
> */}

      <Provider>
        <RouterProvider router={router} />
        <SpeedInsights />
      </Provider>
    </Auth0Provider>
  </StrictMode>
);