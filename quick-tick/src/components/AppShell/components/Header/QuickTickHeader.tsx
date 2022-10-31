import {ActionIcon, Button, Center, Group, Header, ThemeIcon} from "@mantine/core";
import React from "react";
import "./QuickTickHeader.css";
import {Link} from "react-router-dom";
import {QuickTickPage} from "../../../../util/QuickTickPage";
import {IconChecks, IconChevronRight, IconLogout, IconSettings, IconHandStop} from '@tabler/icons';
import {useRecoilState, useResetRecoilState, useSetRecoilState} from "recoil";
import {credentialAtom, userInfoAtom} from "../../../../recoil/Atoms";
import {showNotification} from "@mantine/notifications";


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
    const setCredentials = useSetRecoilState(credentialAtom);
    const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

    // Will also reset the credentials atom
    const logout = () => {
        setCredentials(undefined);
        setUserInfo(undefined);
        showNotification({
            title: "Logged out",
            message: "Successfully logged out, goodbye!",
            icon: <IconHandStop/>
        })
    }

    return (
        <div className={"quick-tick-header"}>
            <Header height={60} p="xs">
                <Group position={"left"} className={"header-group-1"}>
                    <Link to={QuickTickPage.HOME}>
                        {LOGO}
                    </Link>
                </Group>
                <Group position={"right"} className={"header-group-2"}>
                    <Button leftIcon={<IconSettings/>} variant={"subtle"}/>
                    {userInfo &&
                        <Button leftIcon={<IconLogout/>} variant={"subtle"} onClick={() => logout()}/>
                    }
                </Group>
            </Header>
        </div>
    )
}