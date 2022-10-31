import { Button, MediaQuery, Menu, Navbar, Stack } from "@mantine/core";
import React from "react";
import "./QuickTickNavbar.css";
import { Link } from "react-router-dom";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { IconClock, IconHomeExclamation, IconTimeline, IconUserCheck } from "@tabler/icons";
import QuickTickAuth from "../Auth/QuickTickAuth";
import Divider = Menu.Divider;

export const getNavbarLinks = (mobile: boolean): JSX.Element => {
    return (
        <Stack className={"navbar-link-stack"} align={"stretch"} justify={"center"}>
            <Link to={QuickTickPage.DAILY}>
                <Button leftIcon={<IconUserCheck />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    Daily check-in
                </Button>
            </Link>
            <Link to={QuickTickPage.UPCOMING}>
                <Button leftIcon={<IconHomeExclamation />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    Upcoming
                </Button>
            </Link>
            <Link to={QuickTickPage.TIMECHARGING}>
                <Button leftIcon={<IconClock />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    Timecharging
                </Button>
            </Link>
            <Link to={QuickTickPage.STATS}>
                <Button leftIcon={<IconTimeline />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    Stats
                </Button>
            </Link>
            <Divider />
            <QuickTickAuth />
        </Stack>
    );
};

export default function QuickTickNavbar(): JSX.Element {
    return (
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Navbar width={{ sm: 250 }} p="xs">
                <Navbar.Section>{getNavbarLinks(false)}</Navbar.Section>
            </Navbar>
        </MediaQuery>
    );
}
