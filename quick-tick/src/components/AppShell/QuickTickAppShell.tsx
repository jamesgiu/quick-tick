import {AppShell, Aside, Center, Header, MediaQuery, Navbar} from "@mantine/core";
import React from "react";
import "./QuickTickAppShell.css";
import QuickTickNavbar from "./components/Navbar/QuickTickNavbar";
import QuickTickHeader from "./components/Header/QuickTickHeader";
import {Outlet} from "react-router";
import QuickTickFooter from "./components/Footer/QuickTickFooter";

export default function QuickTickAppShell(): JSX.Element {
    return (
        <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<QuickTickNavbar/>}
            header={<QuickTickHeader/>}
            footer={<QuickTickFooter/>}
        >
          <Outlet/>
        </AppShell>
    )
}