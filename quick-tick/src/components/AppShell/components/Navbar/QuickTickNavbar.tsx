import { Accordion, Alert, Button, MediaQuery, Menu, Navbar, Stack } from "@mantine/core";
import React from "react";
import "./QuickTickNavbar.css";
import { Link } from "react-router-dom";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { IconClock, IconCheckupList, IconTimeline, IconCalendar, IconTrafficCone, IconExternalLink } from "@tabler/icons";
import QuickTickAuth from "../Auth/QuickTickAuth";
import Divider = Menu.Divider;
import { AccordionItem } from "@mantine/core/lib/Accordion/AccordionItem/AccordionItem";

export const getNavbarLinks = (mobile: boolean, onClickCallback?: ()=> void): JSX.Element => {
    return (
        <Stack className={"navbar-link-stack"} align={"stretch"}>
            <Link to={QuickTickPage.MY_TASKS} onClick={onClickCallback}>
                <Button leftIcon={<IconCheckupList />} variant="subtle" size={mobile ? "xl" : "sm" }>
                    My tasks
                </Button>
            </Link>
            <Link to={QuickTickPage.STATS} onClick={onClickCallback}>
                    <Button leftIcon={<IconTimeline />} variant="subtle" size={mobile ? "xl" : "sm"}>
                        Stats
                    </Button>
            </Link>        
            <Button leftIcon={<IconCalendar />} variant="subtle" size={mobile ? "xl" : "sm"} onClick={() => { window.open("https://calendar.google.com/calendar/", "_blank", "popup=true, width=500, height=800"); }}>
                Calendar <IconExternalLink size={16}/>
            </Button>
            <Accordion className="nav-accordion">
                <Accordion.Item value="coming-soon">
                <Divider />
                    <Accordion.Control>
                        <Button leftIcon={<IconTrafficCone/>} variant="subtle" size={mobile ? "xl" : "sm"}>Under construction</Button>
                    </Accordion.Control>
                    <Accordion.Panel>
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
