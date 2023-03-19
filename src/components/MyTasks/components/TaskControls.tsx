import { ActionIcon, Button, Group, LoadingOverlay, Popover, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
    IconCircleCheck,
    IconCircleDashed,
    IconGhost,
    IconMoodSmileBeam,
    IconTrash,
    IconTrashX,
    IconPencil,
} from "@tabler/icons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { Task, TaskListIdTitle } from "../../../api/Types";
import { credentialAtom, tasksMapAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";
import TaskForm from "../../Tasks/TaskForm/TaskForm";

// TODO

// flag button (edit notes to store extra detail on a task)
// automatic emoji/icon assignment, can change it too

interface TaskControlsProps {
    targetTask: Task;
}

export default function TaskControls(props: TaskControlsProps): JSX.Element {
    const tasksMap = useRecoilValue<Map<string, TaskListIdTitle>>(tasksMapAtom);
    const credential = useRecoilValue(credentialAtom);

    const [loading, setLoading] = useState<boolean>(false);

    const [isHoveringOverComplete, setIsHoveringOverComplete] = useState<boolean>(false);
    const [isHoveringOverTrash, setIsHoveringOverTrash] = useState<boolean>(false);

    // Local copy of task obj
    const [localTask, setLocalTask] = useState<Task>(props.targetTask);

    const completeTask = () => {
        setLoading(true);
        const completedTask = {
            ...localTask,
            completed: new Date(Date.now()).toISOString(),
            hidden: true,
            status: "completed",
        };

        GoogleAPI.updateTask(
            credential,
            tasksMap.get(JSON.stringify(props.targetTask))!.id,
            completedTask,
            () => {
                showNotification({
                    title: "Task completed!",
                    message: "Well done!",
                    color: "green",
                    icon: <IconMoodSmileBeam />,
                });
                setLoading(false);
                setLocalTask(completedTask);
            },
            () => {
                showNotification(genErrorNotificationProps("Task completion"));
                setLoading(false);
            }
        );
    };

    const deleteTask = () => {
        setLoading(true);
        const deletedTask = { ...localTask, deleted: true };

        GoogleAPI.deleteTask(
            credential,
            tasksMap.get(JSON.stringify(props.targetTask))!,
            deletedTask,
            () => {
                setLocalTask(deletedTask);
                setLoading(false);
            },
            () => {
                showNotification(genErrorNotificationProps("Task deletion"));
                setLoading(false);
            }
        );
    };

    if (loading) {
        return <LoadingOverlay visible={true} overlayBlur={2} />;
    }

    // The default view, all actions available.
    if (!localTask.completed && !localTask.deleted) {
        return (
            <Group className={"task-controls"}>
                <ActionIcon
                    color={"#a5d8ff"}
                    onMouseOver={() => setIsHoveringOverComplete(true)}
                    onMouseOut={() => setIsHoveringOverComplete(false)}
                    onMouseLeave={() => setIsHoveringOverComplete(false)}
                    onClick={() => completeTask()}
                >
                    {isHoveringOverComplete ? <IconCircleCheck /> : <IconCircleDashed />}
                </ActionIcon>
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
                            onMouseOver={() => setIsHoveringOverTrash(true)}
                            onMouseOut={() => setIsHoveringOverTrash(false)}
                            onMouseLeave={() => setIsHoveringOverTrash(false)}
                            onClick={() => deleteTask()}
                        >
                            {isHoveringOverTrash ? <IconTrashX /> : <IconTrash />}
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Text size="sm">Delete your task? This action cannot be undone.</Text>
                        <Button color={"red"} onClick={deleteTask} leftIcon={<IconTrashX />}>
                            Delete
                        </Button>
                    </Popover.Dropdown>
                </Popover>
            </Group>
        );
    }

    // If the task was deleted.
    if (localTask.deleted) {
        return (
            <Group className={"task-controls"}>
                <IconGhost />
            </Group>
        );
    }

    // If the task was completed.
    if (localTask.completed) {
        return (
            <Group className={"task-controls"}>
                <IconMoodSmileBeam color={"lightgreen"} />
            </Group>
        );
    }

    return <></>;
}
