import {AppShell, Header, Navbar} from "@mantine/core";
import React from "react";
import "./QuickTickAppShell.css";
import QuickTickNavbar from "./components/Navbar/QuickTickNavbar";
import QuickTickHeader from "./components/Header/QuickTickHeader";
import {Outlet} from "react-router";

interface QuickTickAppShellProps {
    children: JSX.Element
}
export default function QuickTickAppShell(props: QuickTickAppShellProps): JSX.Element {
    return (
        <AppShell
            padding="md"
            navbar={<QuickTickNavbar/>}
            header={<QuickTickHeader/>}
            styles={(theme) => {
                return ({
                    main: {backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]},
                });
            }}
        >
            {props.children}
            <Outlet />
        </AppShell>
    )
}