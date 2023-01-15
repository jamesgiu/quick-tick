import { Badge, Card, Group, Text } from "@mantine/core";
import {
    IconDotsVertical
} from "@tabler/icons";
import { useRecoilValue } from "recoil";
import { Task, TaskListIdTitle } from "../../../api/Types";
import { taskListsMapAtom } from "../../../recoil/Atoms";
import QuickTickTable, { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import NewTask from "../../Tasks/NewTask/NewTask";
import "./TaskListCard.css";
import { TaskUtil } from "./TaskUtil";

export enum TaskListFilter {
    TODAY = "today",
    WEEKLY = "weekly",
}
// have "next week", "next month", "next year" flags
// have "legend" to separate next week, next month, etc. on combined view (e.g. little squares in title)
// completed tasks not shown here

interface TaskListProps {
    taskList: TaskListIdTitle;
    filter?: TaskListFilter;
}

export default function TaskListCard(props: TaskListProps): JSX.Element {
    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const getActiveTasks = (): Task[] =>
        taskListMap.get(JSON.stringify(props.taskList))?.filter((task) => !task.completed) ?? [];
    const getTaskRows = (): QuickTickTableRow[] => TaskUtil.getTasksAsRows(getActiveTasks(), props.filter);

    const taskRows = getTaskRows();

    const usePluralPhrasing = (): boolean => taskRows && (taskRows?.length === 0 || taskRows?.length > 1);

    return (
        <Card shadow="sm" p="lg" radius="md" withBorder className="task-list">
            <div className="draggable-area">
                <Group position="apart" mt="md" mb="xs">
                    <IconDotsVertical color={"#a5d8ff"} />
                    <Text weight={500}>{props.taskList.title}</Text>
                    <Badge color="pink" variant="light">
                        {taskRows?.length ?? 0} task{usePluralPhrasing() ? "s" : ""}
                    </Badge>
                    <NewTask defaultTaskList={props.taskList} />
                </Group>
            </div>
            <div className="task-list-table">
                <QuickTickTable headers={["Title", "Due", "Controls"]} rows={taskRows} />
            </div>
        </Card>
    );
}
