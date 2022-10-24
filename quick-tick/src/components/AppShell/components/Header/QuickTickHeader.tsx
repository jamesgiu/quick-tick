import {ActionIcon, Button, Center, Group, Header, ThemeIcon} from "@mantine/core";
import React from "react";
import "./QuickTickHeader.css";
import {Link} from "react-router-dom";
import {QuickTickPage} from "../../util/QuickTickPage";
import {IconChecks, IconChevronRight, IconUser} from '@tabler/icons';

export const LOGO =     <span> <span className={"header-logo"}>
                        <IconChevronRight/>
                </span>
<span className={"header-text"}>
                        <span className={"header-text-first-half"}>Quick</span>
                        <span className={"header-text-second-half"}>Tick</span>
                        <IconChecks color={"#007180C1"}/>
                </span>
    </span>;

export default function QuickTickHeader(): JSX.Element {
    return (
        <div className={"quick-tick-header"}>
            <Header height={60} p="xs">
                <Group position={"left"} className={"header-group-1"}>
                    <Link to={QuickTickPage.HOME}>
                        {LOGO}
                    </Link>
                </Group>
                <Group position={"right"} className={"header-group-2"}>
                    <Button leftIcon={<IconUser/>} variant={"subtle"}/>
                </Group>
            </Header>
        </div>
    )
}