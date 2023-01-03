import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { QuickTickPage } from "../util/QuickTickPage";
import Daily from "../components/Daily/Daily";
import MyTasks from "../components/MyTasks/MyTasks";
import Timecharging from "../components/Timecharging/Timecharging";
import Stats from "../components/Stats/Stats";
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
