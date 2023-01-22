import { Badge, Button, Card, Group, Popover, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconDotsVertical, IconTrash, IconTrashX } from "@tabler/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { Task, TaskListIdTitle } from "../../../api/Types";
import { credentialAtom, dataLoadingAtom, taskListsMapAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";
import QuickTickTable, { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import NewTask from "../../Tasks/NewTask/NewTask";
import "./TaskListCard.css";
import { TaskUtil } from "./TaskUtil";

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
    const credential = useRecoilValue(credentialAtom);

    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const getActiveTasks = (): Task[] =>
        taskListMap.get(JSON.stringify(props.taskList))?.filter((task) => !task.completed) ?? [];
    const getTaskRows = (): QuickTickTableRow[] => TaskUtil.getTasksAsRows(getActiveTasks(), props.filter);

    const taskRows = getTaskRows();

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
                    <IconDotsVertical color={"#a5d8ff"} />
                    <Text weight={500}>{props.taskList.title}</Text>
                    <Badge color="pink" variant="light">
                        {taskRows?.length ?? 0} task{usePluralPhrasing() ? "s" : ""}
                    </Badge>
                    <span className="draggable-cancel">
                        <NewTask defaultTaskList={props.taskList} />
                        {deleteListBtn()}
                    </span>
                </Group>
            </div>
            <div className="task-list-table">
                <QuickTickTable headers={["Title", "Due", "Controls"]} rows={taskRows} />
            </div>
        </Card>
    );
}
