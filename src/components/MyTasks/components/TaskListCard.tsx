import { Badge, Button, Card, Collapse, Group, Popover, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconChevronDown, IconChevronRight, IconTrash, IconTrashX } from "@tabler/icons";
import { Layout } from "react-grid-layout";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { Task, TaskListIdTitle } from "../../../api/Types";
import {
    collapsedTaskListIds,
    credentialAtom,
    dataLoadingAtom,
    taskListLayoutAtom,
    taskListsMapAtom,
} from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";
import QuickTickTable, { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import TaskForm from "../../Tasks/TaskForm/TaskForm";
import "./TaskListCard.css";
import { TaskUtil } from "./TaskUtil";

export enum TaskListFilter {
    TODAY = "today",
    WEEKLY = "weekly",
    OVERDUE = "overdue",
}

interface TaskListProps {
    taskList: TaskListIdTitle;
    filter?: TaskListFilter;
}

export default function TaskListCard(props: TaskListProps): JSX.Element {
    const setLoading = useSetRecoilState(dataLoadingAtom);
    const [layout, setLayout] = useRecoilState<Layout[]>(taskListLayoutAtom);
    const [collapsedTasklists, setCollapsedTasklists] = useRecoilState(collapsedTaskListIds);
    const credential = useRecoilValue(credentialAtom);

    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const getActiveTasks = (): Task[] =>
        taskListMap.get(JSON.stringify(props.taskList))?.filter((task) => !task.completed) ?? [];
    const getTaskRows = (): QuickTickTableRow[] => TaskUtil.getTasksAsRows(getActiveTasks(), props.filter);

    const taskRows = getTaskRows();

    const isCollapsed = collapsedTasklists.includes(props.taskList.id);

    const usePluralPhrasing = (): boolean => taskRows && (taskRows?.length === 0 || taskRows?.length > 1);

    const deleteList = (): void => {
        setLoading(true);

        GoogleAPI.deleteTaskList(
            credential,
            props.taskList,
            (): void => {
                setLoading(false);
                showNotification({
                    title: "Tasklist deleted!",
                    message: `${props.taskList.title} was deleted`,
                    color: "green",
                    icon: <IconTrash />,
                });
            },
            (): void => {
                showNotification(genErrorNotificationProps("Tasklist deletion"));
                setLoading(false);
            }
        );
    };

    const deleteListBtn = (): JSX.Element => {
        return (
            <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <Button variant="subtle" leftIcon={<IconTrash />} size="sm">
                        {" "}
                        Delete{" "}
                    </Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <Text size="sm">Delete your list? This action cannot be undone.</Text>
                    <Button color={"red"} onClick={deleteList} leftIcon={<IconTrashX />}>
                        Delete
                    </Button>
                </Popover.Dropdown>
            </Popover>
        );
    };

    return (
        <Card shadow="sm" p="lg" radius="md" withBorder className="task-list">
            <div className="draggable-area">
                <Group position="apart" mt="md" mb="xs">
                    <Button
                        variant="subtle"
                        size="sm"
                        className="draggable-cancel"
                        color={"#a5d8ff"}
                        leftIcon={isCollapsed ? <IconChevronRight /> : <IconChevronDown />}
                        onClick={(): void => {
                            // Find and toggle collapse on the internal tracking...
                            let newCollapsedTaskListIds = [];
                            if (isCollapsed) {
                                newCollapsedTaskListIds = collapsedTasklists.filter(
                                    (listId) => listId != props.taskList.id
                                );
                            } else {
                                newCollapsedTaskListIds = [...collapsedTasklists, props.taskList.id];
                            }

                            // If we are collapsing, then set the height to 5 for this task list, otherwise expand with 15.
                            const newLayout: Layout[] = [];

                            layout.forEach((layoutItem) => {
                                if (layoutItem.i === props.taskList.id) {
                                    const newLayoutItem = { ...layoutItem, h: !isCollapsed ? 5 : 30, w: layoutItem.w };
                                    newLayout.push(newLayoutItem);
                                } else {
                                    newLayout.push(layoutItem);
                                }
                            });

                            setLayout(newLayout);

                            setCollapsedTasklists(newCollapsedTaskListIds);
                        }}
                    />
                    <Text weight={500}>{props.taskList.title}</Text>
                    <Badge color="pink" variant="light">
                        {taskRows?.length ?? 0} task{usePluralPhrasing() ? "s" : ""}
                    </Badge>
                    <span className="draggable-cancel">
                        <TaskForm defaultTaskList={props.taskList} />
                        {deleteListBtn()}
                    </span>
                </Group>
            </div>
            <Collapse in={!isCollapsed}>
                <div className="task-list-table">
                    <QuickTickTable headers={["Title", "Due", "Controls"]} rows={taskRows} />
                </div>
            </Collapse>
        </Card>
    );
}
