import { AppShell, LoadingOverlay } from "@mantine/core";
import { Outlet } from "react-router";
import { useRecoilValue } from "recoil";
import { dataLoadingAtom } from "../../recoil/Atoms";
import QuickTickFooter from "./components/Footer/QuickTickFooter";
import QuickTickHeader from "./components/Header/QuickTickHeader";
import QuickTickNavbar from "./components/Navbar/QuickTickNavbar";
import "./QuickTickAppShell.css";

export default function QuickTickAppShell(): JSX.Element {
    const dataLoading = useRecoilValue(dataLoadingAtom);

    return (
        <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<QuickTickNavbar />}
            header={<QuickTickHeader />}
            footer={<QuickTickFooter />}
        >
            {dataLoading ? <LoadingOverlay overlayBlur={2} visible={true} /> : <Outlet />}
        </AppShell>
    );
}
