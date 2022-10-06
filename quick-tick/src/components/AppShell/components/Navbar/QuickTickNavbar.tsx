import {Button, Header, Navbar, Stack} from "@mantine/core";
import React from "react";
import "./QuickTickNavbar.css";
import {Link} from "react-router-dom";
import {QuickTickPage} from "../../util/QuickTickPage";

export default function QuickTickNavbar(): JSX.Element {
    return (
        <Navbar width={{ base: 300 }} height={500} p="xs">
            <Stack>
                <Link to={QuickTickPage.DAILY}>
                    <Button variant="outline" compact>
                        Daily check-in
                    </Button>
                </Link>
                <Link to={QuickTickPage.UPCOMING}>
                    <Button variant="outline" compact>
                        Upcoming
                    </Button>
                </Link>
                <Link to={QuickTickPage.TIMECHARGING}>
                    <Button variant="outline" compact>
                        Timecharging
                    </Button>
                </Link>
                <Link to={QuickTickPage.STATS}>
                    <Button variant="outline" compact>
                        Stats
                    </Button>
                </Link>
            </Stack>
        </Navbar>
    )
}