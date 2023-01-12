import { AppShell, LoadingOverlay } from "@mantine/core";
import React from "react";
import "./QuickTickAppShell.css";
import QuickTickNavbar from "./components/Navbar/QuickTickNavbar";
import QuickTickHeader from "./components/Header/QuickTickHeader";
import { Outlet } from "react-router";
import QuickTickFooter from "./components/Footer/QuickTickFooter";
import { useRecoilValue } from "recoil";
import { dataLoadingAtom } from "../../recoil/Atoms";

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
            {dataLoading ? <LoadingOverlay overlayBlur={2} visible={true}/> :
            <Outlet />}
        </AppShell>
    );
}
