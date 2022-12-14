import { Burger, Button, Group, Header, MediaQuery } from "@mantine/core";
import React, { useState } from "react";
import "./QuickTickHeader.css";
import { Link } from "react-router-dom";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { IconChecks, IconChevronRight, IconHandStop, IconLogout, IconSettings } from "@tabler/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { credentialAtom, userInfoAtom } from "../../../../recoil/Atoms";
import { showNotification } from "@mantine/notifications";
import { fallDown as BurgerMenu } from "react-burger-menu";
import { getNavbarLinks } from "../Navbar/QuickTickNavbar";
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
    const setCredentials = useSetRecoilState(credentialAtom);
    const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: window.innerWidth, height: window.innerWidth });
    window.onresize = (): void => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Will also reset the credentials atom
    const logout = (): void => {
        setCredentials(undefined);
        setUserInfo(undefined);
        showNotification({
            title: "Logged out",
            message: "Successfully logged out, goodbye!",
            icon: <IconHandStop />,
        });
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
                    <Button leftIcon={<IconSettings size={30} />} variant={"subtle"} />
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
                        <span className={"burger-menu"} onClick={(): void => setBurgerOpen(false)}>
                            {getNavbarLinks(true)}
                        </span>
                    </BurgerMenu>
                )}
            </Header>
        </div>
    );
}
