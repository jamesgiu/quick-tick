import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {MantineProvider} from "@mantine/core";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {BASE_PATH, QuickTickPage} from "./components/AppShell/util/QuickTickPage";
import Daily from "./components/Daily/Daily";
import Upcoming from "./components/Upcoming/Upcoming";
import Timecharging from "./components/Timecharging/Timecharging";
import Stats from "./components/Metrics/Stats";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";

const router = createBrowserRouter([
    {
        path: `${QuickTickPage.HOME}`,
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
            {
                path: `${BASE_PATH()}${QuickTickPage.DAILY}`,
                element: <Daily/>,
            },
            {
                path: `${BASE_PATH()}${QuickTickPage.UPCOMING}`,
                element: <Upcoming/>,
            },
            {
                path: `${BASE_PATH()}${QuickTickPage.TIMECHARGING}`,
                element: <Timecharging/>,
            },
            {
                path: `${BASE_PATH()}${QuickTickPage.STATS}`,
                element: <Stats/>,
            },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <MantineProvider withGlobalStyles withNormalizeCSS>
          <RouterProvider router={router} />
      </MantineProvider>
  </React.StrictMode>
)
