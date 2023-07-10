import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home/Home";
import Landing from "../components/Landing/Landing";
import MyTasks from "../components/MyTasks/MyTasks";
import NotFound from "../components/NotFound/NotFound";
import Stats from "../components/Stats/Stats";
import Timecharging from "../components/Timecharging/Timecharging";
import { QuickTickPage } from "../util/QuickTickPage";

const router = createBrowserRouter([
    {
        path: QuickTickPage.LANDING,
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: QuickTickPage.ABOUT,
                element: <Home />,
            },
            {
                path: QuickTickPage.MY_TASKS,
                element: <MyTasks />,
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
