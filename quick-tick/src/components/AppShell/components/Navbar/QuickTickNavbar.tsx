import { Accordion, Alert, Button, MediaQuery, Menu, Navbar, Stack } from "@mantine/core";
import React from "react";
import "./QuickTickNavbar.css";
import { Link } from "react-router-dom";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { IconClock, IconHomeExclamation, IconTimeline, IconUserCheck, IconTrafficCone } from "@tabler/icons";
import QuickTickAuth from "../Auth/QuickTickAuth";
import Divider = Menu.Divider;
import { AccordionItem } from "@mantine/core/lib/Accordion/AccordionItem/AccordionItem";

export const getNavbarLinks = (mobile: boolean, onClickCallback?: ()=> void): JSX.Element => {
    return (
        <Stack className={"navbar-link-stack"} align={"stretch"} justify={"center"}>
            <Link to={QuickTickPage.UPCOMING} onClick={onClickCallback}>
                <Button leftIcon={<IconHomeExclamation />} variant="subtle" size={mobile ? "xl" : "sm" }>
                    Upcoming tasks
                </Button>
            </Link>
            <Link to={QuickTickPage.STATS} onClick={onClickCallback}>
                    <Button leftIcon={<IconTimeline />} variant="subtle" size={mobile ? "xl" : "sm"}>
                        Stats
                    </Button>
            </Link>
            <Accordion className="nav-accordion">
                <Accordion.Item value="coming-soon">
                <Divider />
                    <Accordion.Control>
                        <Button leftIcon={<IconTrafficCone/>} variant="subtle" size={mobile ? "xl" : "sm"}>Under construction</Button>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Link to={QuickTickPage.DAILY} onClick={onClickCallback}>
                            <Button leftIcon={<IconUserCheck />} variant="subtle" size={mobile ? "xl" : "sm"}>
                                Daily check-in
                            </Button>
                        </Link>
                        <Link to={QuickTickPage.TIMECHARGING} onClick={onClickCallback}>
                            <Button leftIcon={<IconClock />} variant="subtle" size={mobile ? "xl" : "sm"}>
                                Timecharging
                            </Button>
                        </Link>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
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
