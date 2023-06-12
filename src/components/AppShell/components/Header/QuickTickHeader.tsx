import { Burger, Button, Group, Header, MediaQuery } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconChecks, IconChevronRight, IconHandStop, IconLogout } from "@tabler/icons";
import { useState } from "react";
import { fallDown as BurgerMenu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { TaskNumbers, credentialAtom, taskNumbersAtom, userInfoAtom } from "../../../../recoil/Atoms";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import DataLoader from "../../../DataLoader/DataLoader";
import { getNavbarLinks } from "../Navbar/QuickTickNavbar";
import "./QuickTickHeader.css";
interface WindowSize {
    width: number;
    height: number;
}

export const LOGO = (
    <span>
        {" "}
        <span className={"header-logo"}>
            <img src={import.meta.env.VITE_BASE_PATH + "/qtlogo.png"} width={40} />
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
    const taskNumbers = useRecoilValue<TaskNumbers>(taskNumbersAtom);
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
                    <Link to={QuickTickPage.LANDING}>{LOGO}</Link>
                </Group>
                <Group position={"right"} className={"header-group-2"}>
                    <Group className="header-main-actions">
                        <DataLoader />
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
                            {getNavbarLinks(true, taskNumbers, () => setBurgerOpen(false))}
                        </span>
                    </BurgerMenu>
                )}
            </Header>
        </div>
    );
}
