import { Accordion, Button, Collapse, MediaQuery, Navbar, Stack } from "@mantine/core";
import {
    IconAlarm,
    IconArrowBarLeft,
    IconArrowBarRight,
    IconCalendar,
    IconChecklist,
    IconCheckupList,
    IconConfetti,
    IconExclamationMark,
    IconExternalLink,
    IconInfoCircle,
    IconPlaylistAdd,
    IconTimeline,
    IconUrgent,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Task, TaskList } from "../../../../api/Types";
import { TaskNumbers, navbarCollapsedAtom, taskListsMapAtom, taskNumbersAtom } from "../../../../recoil/Atoms";
import { QuickTickPage } from "../../../../util/QuickTickPage";
import { TaskListFilter } from "../../../MyTasks/components/TaskListCard";
import NewTaskList from "../../../Tasks/NewTasklist/NewTasklist";
import TaskForm from "../../../Tasks/TaskForm/TaskForm";
import QuickTickAuth from "../Auth/QuickTickAuth";
import "./QuickTickNavbar.css";

export const getTaskListButtons = (
    taskListMap: Map<string, Task[]>,
    mobile: boolean,
    onClickCallback?: () => void
): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    taskListMap.forEach((tasks, taskList) => {
        const taskListObj: TaskList = JSON.parse(taskList);
        elements.push(
            <Link
                to={QuickTickPage.MY_TASKS + `?listFilter=${taskListObj.id}`}
                onClick={onClickCallback}
                key={taskListObj.title}
            >
                <Button variant="subtle" size={mobile ? "xl" : "sm"}>
                    {taskListObj.title} ({tasks.filter((task) => !task.completed).length})
                </Button>
            </Link>
        );
    });

    return elements;
};

export const getNavbarLinks = (
    mobile: boolean,
    taskNumbers: TaskNumbers,
    taskListMap: Map<string, Task[]>,
    onClickCallback?: () => void
): JSX.Element => {
    return (
        <Stack className={"navbar-link-stack"} align={"stretch"}>
            <Accordion className="nav-accordion" value={"my-tasks-filters"} chevron={null}>
                <Accordion.Item value="my-tasks-filters">
                    <Accordion.Control>
                        <Link to={QuickTickPage.MY_TASKS} onClick={onClickCallback}>
                            <Button leftIcon={<IconCheckupList />} variant="subtle" size={mobile ? "xl" : "sm"}>
                                My tasks
                            </Button>
                        </Link>
                    </Accordion.Control>
                    {(taskNumbers.overdue > 0 || taskNumbers.dueToday > 0 || taskNumbers.dueThisWeek > 0) && (
                        <Accordion.Panel>
                            {taskNumbers.overdue > 0 && (
                                <Link
                                    to={QuickTickPage.MY_TASKS + `?when=${TaskListFilter.OVERDUE}`}
                                    onClick={onClickCallback}
                                >
                                    <Button
                                        leftIcon={<IconExclamationMark color="red" className="danger-blob" />}
                                        variant="subtle"
                                        size={mobile ? "xl" : "sm"}
                                    >
                                        Overdue ({taskNumbers.overdue})
                                    </Button>
                                </Link>
                            )}
                            {taskNumbers.dueToday > 0 && (
                                <Link
                                    to={QuickTickPage.MY_TASKS + `?when=${TaskListFilter.TODAY}`}
                                    onClick={onClickCallback}
                                >
                                    <Button
                                        leftIcon={<IconUrgent color="orange" />}
                                        variant="subtle"
                                        size={mobile ? "xl" : "sm"}
                                    >
                                        Today ({taskNumbers.dueToday})
                                    </Button>
                                </Link>
                            )}
                            {taskNumbers.dueThisWeekend > 0 && (
                                <Link
                                    to={QuickTickPage.MY_TASKS + `?when=${TaskListFilter.WEEKEND}`}
                                    onClick={onClickCallback}
                                >
                                    <Button
                                        leftIcon={<IconConfetti color="#a5ff70c1" />}
                                        variant="subtle"
                                        size={mobile ? "xl" : "sm"}
                                    >
                                        This weekend ({taskNumbers.dueThisWeekend})
                                    </Button>
                                </Link>
                            )}
                            {taskNumbers.dueThisWeek > 0 && (
                                <Link
                                    to={QuickTickPage.MY_TASKS + `?when=${TaskListFilter.WEEKLY}`}
                                    onClick={onClickCallback}
                                >
                                    <Button
                                        leftIcon={<IconAlarm color="#f5ff70c1" />}
                                        variant="subtle"
                                        size={mobile ? "xl" : "sm"}
                                    >
                                        This week ({taskNumbers.dueThisWeek})
                                    </Button>
                                </Link>
                            )}
                        </Accordion.Panel>
                    )}
                </Accordion.Item>
            </Accordion>
            <Accordion className="nav-accordion" value="by-list" chevron={null}>
                <Accordion.Item value="by-list">
                    <Accordion.Control>
                        <Button leftIcon={<IconChecklist />} variant="subtle" size={mobile ? "xl" : "sm"}>
                            By list
                        </Button>
                    </Accordion.Control>
                    <Accordion.Panel>{getTaskListButtons(taskListMap, mobile, onClickCallback)}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <Accordion className="nav-accordion" value="create-new" chevron={null}>
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
            <Link to={QuickTickPage.ABOUT} onClick={onClickCallback}>
                <Button leftIcon={<IconInfoCircle />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    About
                </Button>
            </Link>
            <Button
                leftIcon={<IconCalendar />}
                variant="subtle"
                size={mobile ? "xl" : "sm"}
                onClick={(): void => {
                    window.open(
                        "https://calendar.google.com/calendar/",
                        "_blank",
                        "popup=true, width=1200, height=1200"
                    );
                }}
            >
                Calendar <IconExternalLink size={16} />
            </Button>
            <Link to={QuickTickPage.STATS} onClick={onClickCallback}>
                <Button leftIcon={<IconTimeline />} variant="subtle" size={mobile ? "xl" : "sm"}>
                    Stats
                </Button>
            </Link>
            <QuickTickAuth />
        </Stack>
    );
};

export default function QuickTickNavbar(): JSX.Element {
    const [collapsed, setCollapsed] = useRecoilState(navbarCollapsedAtom);
    const taskListsMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);
    const taskNumbers = useRecoilValue<TaskNumbers>(taskNumbersAtom);

    return (
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <div>
                <Button
                    variant="subtle"
                    size="sm"
                    leftIcon={collapsed ? <IconArrowBarRight /> : <IconArrowBarLeft />}
                    onClick={(): void => setCollapsed(!collapsed)}
                    className={!collapsed ? "collapse-button" : "expand-button"}
                />
                <Collapse in={!collapsed}>
                    <Navbar width={{ sm: !collapsed ? 260 : 0 }} p="xs">
                        <Navbar.Section>{getNavbarLinks(false, taskNumbers, taskListsMap)}</Navbar.Section>
                    </Navbar>
                </Collapse>
            </div>
        </MediaQuery>
    );
}
