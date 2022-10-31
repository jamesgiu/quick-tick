import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { QuickTickPage } from "../util/QuickTickPage";
import Daily from "../components/Daily/Daily";
import Upcoming from "../components/Upcoming/Upcoming";
import Timecharging from "../components/Timecharging/Timecharging";
import Stats from "../components/Metrics/Stats";
import Home from "../components/Home/Home";
import NotFound from "../components/NotFound/NotFound";

const router = createBrowserRouter([
    {
        path: QuickTickPage.HOME,
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: QuickTickPage.DAILY,
                element: <Daily />,
            },
            {
                path: QuickTickPage.UPCOMING,
                element: <Upcoming />,
            },
            {
                path: QuickTickPage.TIMECHARGING,
                element: <Timecharging />,
            },
            {
                path: QuickTickPage.STATS,
                element: <Stats />,
            },
        ],
    },
]);

export default router;
