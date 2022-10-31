import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {MantineProvider} from "@mantine/core";
import {RouterProvider} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {NotificationsProvider} from "@mantine/notifications";
import {RecoilRoot} from "recoil";
import router from "./router/Router";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <RecoilRoot>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GC_CLIENT_ID}>
      <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{colorScheme: "dark"}}
      >
          <NotificationsProvider limit={3}>
            <RouterProvider router={router} />
          </NotificationsProvider>
      </MantineProvider>
      </GoogleOAuthProvider>
      </RecoilRoot>
  </React.StrictMode>
)
