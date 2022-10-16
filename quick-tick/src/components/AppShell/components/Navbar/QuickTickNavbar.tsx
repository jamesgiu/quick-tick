import {Button, Header, Menu, Navbar, Stack} from "@mantine/core";
import React from "react";
import "./QuickTickNavbar.css";
import {Link} from "react-router-dom";
import {QuickTickPage} from "../../util/QuickTickPage";
import {IconUserCheck, IconHomeExclamation, IconClock, IconTimeline} from "@tabler/icons";
import QuickTickAuth from "../Auth/QuickTickAuth";
import Divider = Menu.Divider;

export default function QuickTickNavbar(): JSX.Element {
    return (
        <Navbar width={{ base: 250 }} p="xs">
            <Navbar.Section>
                <Stack className={"navbar-link-stack"}>
                    <Link to={QuickTickPage.DAILY}>
                        <Button leftIcon={<IconUserCheck/>} variant="subtle" compact>
                            Daily check-in
                        </Button>
                    </Link>
                    <Link to={QuickTickPage.UPCOMING}>
                        <Button leftIcon={<IconHomeExclamation/>} variant="subtle" compact>
                            Upcoming
                        </Button>
                    </Link>
                    <Link to={QuickTickPage.TIMECHARGING}>
                        <Button leftIcon={<IconClock/>} variant="subtle" compact>
                            Timecharging
                        </Button>
                    </Link>
                    <Link to={QuickTickPage.STATS}>
                        <Button leftIcon={<IconTimeline/>} variant="subtle" compact>
                            Stats
                        </Button>
                    </Link>
                </Stack>
            </Navbar.Section>
            <Divider/>
            <Navbar.Section>
                <QuickTickAuth/>
            </Navbar.Section>
        </Navbar>
    )
}