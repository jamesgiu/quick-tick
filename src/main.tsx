import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import router from "./router/Router";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <link href="https://fonts.googleapis.com/css?family=Satisfy" rel="stylesheet"></link>
        <RecoilRoot>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GC_CLIENT_ID}>
                <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
                    <NotificationsProvider limit={3}>
                        <RouterProvider router={router} />
                    </NotificationsProvider>
                </MantineProvider>
            </GoogleOAuthProvider>
        </RecoilRoot>
    </React.StrictMode>
);
