import { Badge, Button, Card, Collapse, Group, Popover, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconDotsVertical, IconTrash, IconTrashX, IconChevronRight, IconChevronDown } from "@tabler/icons";
import { useRecoilState, useRecoilValue } from "recoil";
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
import { Layout } from "react-grid-layout";

export enum TaskListFilter {
    TODAY = "today",
    WEEKLY = "weekly",
}

interface TaskListProps {
    taskList: TaskListIdTitle;
    filter?: TaskListFilter;
}

export default function TaskListCard(props: TaskListProps): JSX.Element {
    const [loading, setLoading] = useRecoilState(dataLoadingAtom);
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

    const deleteList = () => {
        setLoading(true);

        GoogleAPI.deleteTaskList(
            credential,
            props.taskList,
            () => {
                setLoading(false);
                showNotification({
                    title: "Tasklist deleted!",
                    message: `${props.taskList.title} was deleted`,
                    color: "green",
                    icon: <IconTrash />,
                });
            },
            () => {
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
                        color={"#a5d8ff"}
                        leftIcon={isCollapsed ? <IconChevronRight /> : <IconChevronDown />}
                        onClick={() => {
                            // Find and toggle collapse on the internal tracking...
                            let newCollapsedTaskListIds = [];
                            if (isCollapsed) {
                                newCollapsedTaskListIds = collapsedTasklists.filter(
                                    (listId) => listId != props.taskList.id
                                );
                            } else {
                                newCollapsedTaskListIds = [...collapsedTasklists, props.taskList.id];
                            }

                            // If it wasn't collapsed before, then we are collapsing, so set the height to 0.
                            if (!isCollapsed) {
                                // If we are collapsing, then set the height to 0 for this task list.
                                const newLayout: Layout[] = [];

                                layout.forEach((layoutItem) => {
                                    if (layoutItem.i === props.taskList.id) {
                                        const newLayoutItem = { ...layoutItem, h: 5, w: 5 };
                                        newLayout.push(newLayoutItem);
                                    } else {
                                        newLayout.push(layoutItem);
                                    }
                                });

                                setLayout(newLayout);
                            }

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
