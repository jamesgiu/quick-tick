import { Accordion, Button, Collapse, MediaQuery, Menu, Navbar, Stack } from "@mantine/core";
import {
    IconAlarm,
    IconCalendar,
    IconCheckupList,
    IconClock,
    IconExternalLink,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconPlaylistAdd,
    IconTimeline,
    IconTrafficCone,
    IconUrgent,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { TaskListFilter } from "../../../MyTasks/components/TaskListCard";
import TaskForm from "../../../Tasks/TaskForm/TaskForm";
import NewTaskList from "../../../Tasks/NewTasklist/NewTasklist";
import QuickTickAuth from "../Auth/QuickTickAuth";
import "./QuickTickNavbar.css";
import Divider = Menu.Divider;
import { navbarCollapsedAtom } from "../../../../recoil/Atoms";
import { useRecoilState } from "recoil";

export const getNavbarLinks = (mobile: boolean, onClickCallback?: () => void): JSX.Element => {
    return (
        <Stack className={"navbar-link-stack"} align={"stretch"}>
            <Accordion className="nav-accordion">
                <Accordion.Item value="my-tasks-filters">
                    <Accordion.Control>
                        <Link to={QuickTickPage.MY_TASKS} onClick={onClickCallback}>
                            <Button leftIcon={<IconCheckupList />} variant="subtle" size={mobile ? "xl" : "sm"}>
                                My tasks
                            </Button>
                        </Link>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Link to={QuickTickPage.MY_TASKS + `?when=${TaskListFilter.TODAY}`} onClick={onClickCallback}>
                            <Button leftIcon={<IconUrgent />} variant="subtle" size={mobile ? "xl" : "sm"}>
                                Today
                            </Button>
                        </Link>
                        <Link to={QuickTickPage.MY_TASKS + `?when=${TaskListFilter.WEEKLY}`} onClick={onClickCallback}>
                            <Button leftIcon={<IconAlarm />} variant="subtle" size={mobile ? "xl" : "sm"}>
                                This week
                            </Button>
                        </Link>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <Accordion className="nav-accordion">
                <Accordion.Item value="create-new">
                    <Accordion.Control>
                        <Button leftIcon={<IconPlaylistAdd />} variant="subtle" size={mobile ? "xl" : "sm"}>
                            New
                        </Button>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <TaskForm />
                        <NewTaskList />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <Link to={QuickTickPage.STATS} onClick={onClickCallback}>
                <Button leftIcon={<IconTimeline />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    Stats
                </Button>
            </Link>
            <Button
                leftIcon={<IconCalendar />}
                variant="subtle"
                size={mobile ? "xl" : "sm"}
                onClick={() => {
                    window.open(
                        "https://calendar.google.com/calendar/",
                        "_blank",
                        "popup=true, width=1200, height=1200"
                    );
                }}
            >
                Calendar <IconExternalLink size={16} />
            </Button>
            <Accordion className="nav-accordion">
                <Accordion.Item value="coming-soon">
                    <Divider />
                    <Accordion.Control>
                        <Button leftIcon={<IconTrafficCone />} variant="subtle" size={mobile ? "xl" : "sm"}>
                            Under construction
                        </Button>
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
    const [collapsed, setCollapsed] = useRecoilState(navbarCollapsedAtom);

    return (
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <div>
                <Button
                    variant="subtle"
                    size="sm"
                    leftIcon={collapsed ? <IconLayoutSidebarLeftExpand /> : <IconLayoutSidebarLeftCollapse />}
                    onClick={() => setCollapsed(!collapsed)}
                    className={!collapsed ? "collapse-button" : "expand-button"}
                />
                <Collapse in={!collapsed}>
                    <Navbar width={{ sm: !collapsed ? 250 : 0 }} p="xs">
                        <Navbar.Section>{getNavbarLinks(false)}</Navbar.Section>
                    </Navbar>
                </Collapse>
            </div>
        </MediaQuery>
    );
}
