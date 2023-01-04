import { Burger, Button, Group, Header, MediaQuery, Stack } from "@mantine/core";
import React, { useState } from "react";
import "./QuickTickHeader.css";
import { Link } from "react-router-dom";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { IconChecks, IconChevronRight, IconHandStop, IconLogout, IconSettings } from "@tabler/icons";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { credentialAtom, userInfoAtom } from "../../../../recoil/Atoms";
import { showNotification } from "@mantine/notifications";
import { fallDown as BurgerMenu } from "react-burger-menu";
import { getNavbarLinks } from "../Navbar/QuickTickNavbar";
import NewTaskList from "../../../Tasks/NewTasklist/NewTasklist";
import NewTask from "../../../Tasks/NewTask/NewTask";
import DataLoader from "../../../DataLoader/DataLoader";
interface WindowSize {
    width: number;
    height: number;
}

export const LOGO = (
    <span>
        {" "}
        <span className={"header-logo"}>
            <IconChevronRight />
        </span>
        <span className={"header-text"}>
            <span className={"header-text-first-half"}>Quick</span>
            <span className={"header-text-second-half"}>Tick</span>
            <IconChecks color={"#007180C1"} />
        </span>
    </span>
);

export default function QuickTickHeader(): JSX.Element {
    const resetCredentials = useResetRecoilState(credentialAtom);
    const resetUserState = useResetRecoilState(userInfoAtom);
    const userInfo = useRecoilValue(userInfoAtom);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: window.innerWidth, height: window.innerWidth });
    window.onresize = (): void => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Will also reset the credentials atom
    const logout = (): void => {
        resetCredentials();
        resetUserState();
        showNotification({
            title: "Logged out",
            message: "Successfully logged out, goodbye!",
            icon: <IconHandStop />,
        });
        location.reload();
    };

    return (
        <div className={"quick-tick-header"}>
            <Header height={60} p="xs">
                <Group position={"left"} className={"header-group-1"}>
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                        <Burger opened={burgerOpen} onClick={(): void => setBurgerOpen((o) => !o)} />
                    </MediaQuery>
                    <Link to={QuickTickPage.HOME}>{LOGO}</Link>        
                </Group>
                <Group position={"right"} className={"header-group-2"}>
                    <Group className="header-main-actions">
                        <NewTask/>
                        <NewTaskList/>
                        <DataLoader/>
                    </Group>
                    {userInfo && (
                        <Button leftIcon={<IconLogout size={30} />} variant={"subtle"} onClick={(): void => logout()} />
                    )}
                </Group>
                {windowSize.width < 768 && (
                    <BurgerMenu
                        isOpen={burgerOpen}
                        onOpen={(): void => setBurgerOpen(true)}
                        onClose={(): void => setBurgerOpen(false)}
                        overlayClassName={"burger-overlay"}
                        burgerButtonClassName={"burger-button"}
                    >
                        <span className={"burger-menu"}>
                            {getNavbarLinks(true, ()=>setBurgerOpen(false))}
                        </span>
                    </BurgerMenu>
                )}
            </Header>
        </div>
    );
}
