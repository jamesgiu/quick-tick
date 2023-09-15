import { ActionIcon, Button, Group, LoadingOverlay, Popover, Text, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck, IconCircleDashed, IconMoodSmileBeam, IconPencil, IconTrash, IconTrashX } from "@tabler/icons";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { Task, TaskListIdTitle } from "../../../api/Types";
import { credentialAtom, forceRefreshAtom, taskListsMapAtom, tasksMapAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";
import TaskForm from "../../Tasks/TaskForm/TaskForm";

// TODO

// flag button (edit notes to store extra detail on a task)
// automatic emoji/icon assignment, can change it too

interface TaskControlsProps {
    targetTask: Task;
}

export default function TaskControls(props: TaskControlsProps): JSX.Element {
    const setForceRefresh = useSetRecoilState<boolean>(forceRefreshAtom);
    const [taskListMap, setTaskListMap] = useRecoilState<Map<string, Task[]>>(taskListsMapAtom);
    const [tasksMap, setTasksMap] = useRecoilState<Map<string, TaskListIdTitle>>(tasksMapAtom);
    const credential = useRecoilValue(credentialAtom);

    const [loading, setLoading] = useState<boolean>(false);

    const [isHoveringOverComplete, setIsHoveringOverComplete] = useState<boolean>(false);
    const [isHoveringOverTrash, setIsHoveringOverTrash] = useState<boolean>(false);

    // Removes this task from the stored lists (e.g. after deletion/completion)
    const removeSelfFromLists = () => {
        const newTaskListMap = new Map<string, Task[]>();

        // Remove this task from the tasklist map
        taskListMap.forEach((tasks, key) => {
            const newTaskList = key;
            const tasksToAdd: Task[] = [];
            tasks.forEach((task) => {
                if (task.id !== props.targetTask.id) {
                    tasksToAdd.push(task);
                }
            });
            newTaskListMap.set(newTaskList, tasksToAdd);
        });

        const newTasksMap = new Map<string, TaskListIdTitle>();

        tasksMap.forEach((taskListId, stringOfTask) => {
            const task: Task = JSON.parse(stringOfTask);

            if (task.id !== props.targetTask.id) {
                newTasksMap.set(stringOfTask, taskListId);
            }
        });

        setTasksMap(newTasksMap);
        setTaskListMap(newTaskListMap);
    };

    const completeTask = (): void => {
        setLoading(true);
        const completedTask = {
            ...props.targetTask,
            completed: new Date(Date.now()).toISOString(),
            hidden: true,
            status: "completed",
        };

        GoogleAPI.updateTask(
            credential,
            tasksMap.get(JSON.stringify(props.targetTask))!.id,
            completedTask,
            (): void => {
                showNotification({
                    title: "Task completed!",
                    message: "Well done!",
                    color: "green",
                    icon: <IconMoodSmileBeam />,
                });

                setLoading(false);
                removeSelfFromLists();
            },
            (): void => {
                showNotification(genErrorNotificationProps("Task completion"));
                setLoading(false);
            }
        );
    };

    const deleteTask = (): void => {
        setLoading(true);
        const deletedTask = { ...props.targetTask, deleted: true };

        GoogleAPI.deleteTask(
            credential,
            tasksMap.get(JSON.stringify(props.targetTask))!,
            deletedTask,
            (): void => {
                setLoading(false);
                removeSelfFromLists();
            },
            (): void => {
                showNotification(genErrorNotificationProps("Task deletion"));
                setLoading(false);
            }
        );
    };

    if (loading) {
        return <LoadingOverlay visible={true} overlayBlur={2} />;
    }

    // The default view, all actions available.
    return (
        <Group className={"task-controls"}>
            <Tooltip label={`Complete task ${props.targetTask.title}`}>
                <ActionIcon
                    color={"#a5d8ff"}
                    onMouseOver={(): void => setIsHoveringOverComplete(true)}
                    onMouseOut={(): void => setIsHoveringOverComplete(false)}
                    onMouseLeave={(): void => setIsHoveringOverComplete(false)}
                    onClick={(): void => completeTask()}
                >
                    {isHoveringOverComplete ? <IconCircleCheck /> : <IconCircleDashed />}
                </ActionIcon>
            </Tooltip>
            <ActionIcon color={"#a5d8ff"}>
                <TaskForm
                    targetTaskIfEditing={props.targetTask}
                    customTarget={<IconPencil />}
                    defaultTaskList={tasksMap.get(JSON.stringify(props.targetTask))}
                />
            </ActionIcon>
            <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <ActionIcon
                        color={"#a5d8ff"}
                        onMouseOver={(): void => setIsHoveringOverTrash(true)}
                        onMouseOut={(): void => setIsHoveringOverTrash(false)}
                        onMouseLeave={(): void => setIsHoveringOverTrash(false)}
                        onClick={(): void => deleteTask()}
                    >
                        {isHoveringOverTrash ? <IconTrashX /> : <IconTrash />}
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                    <Text size="sm">Delete task {props.targetTask.title}? This action cannot be undone.</Text>
                    <Button color={"red"} onClick={deleteTask} leftIcon={<IconTrashX />}>
                        Delete
                    </Button>
                </Popover.Dropdown>
            </Popover>
        </Group>
    );
}
