import { ActionIcon, Button, Group, LoadingOverlay, Popover, Progress, Stack, Text, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
    IconAward,
    IconCircleCheck,
    IconCircleDashed,
    IconFlag,
    IconFlagOff,
    IconPencil,
    IconTrash,
    IconTrashX,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { Task, TaskListIdTitle } from "../../../api/Types";
import { credentialAtom, taskCelebrationAtom, taskListsMapAtom, tasksMapAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";
import TaskForm from "../../Tasks/TaskForm/TaskForm";
import { getRpgProgress, XP_PER_COMPLETED_TASK } from "../../../util/TaskProgression";

// TODO

// automatic emoji/icon assignment, can change it too

interface TaskControlsProps {
    targetTask: Task;
}

// Will appear in the 'notes' section of a task, to extend functionality.
const QT_FLAGGED_STR = "QT_Flagged";

export default function TaskControls(props: TaskControlsProps): JSX.Element {
    const [isFlagged, setIsFlagged] = useState<boolean>(props.targetTask.notes?.includes(QT_FLAGGED_STR) ?? false);
    const [taskListMap, setTaskListMap] = useRecoilState<Map<string, Task[]>>(taskListsMapAtom);
    const [tasksMap, setTasksMap] = useRecoilState<Map<string, TaskListIdTitle>>(tasksMapAtom);
    const setTaskCelebration = useSetRecoilState(taskCelebrationAtom);
    const credential = useRecoilValue(credentialAtom);

    const [loading, setLoading] = useState<boolean>(false);

    const [isHoveringOverComplete, setIsHoveringOverComplete] = useState<boolean>(false);
    const [isHoveringOverTrash, setIsHoveringOverTrash] = useState<boolean>(false);

    useEffect(() => {
        setIsFlagged(props.targetTask.notes?.includes(QT_FLAGGED_STR) ?? false);
    }, [props.targetTask.notes]);

    const getTaskListForTask = (): TaskListIdTitle | undefined => {
        const mappedTaskList = tasksMap.get(JSON.stringify(props.targetTask));
        if (mappedTaskList) return mappedTaskList;
        const cachedEntry = Array.from(taskListMap.entries()).find(([, tasks]) =>
            tasks.some((task) => task.id === props.targetTask.id)
        );
        return cachedEntry ? JSON.parse(cachedEntry[0]) : undefined;
    };

    const updateTaskInLists = (taskList: TaskListIdTitle, updatedTask?: Task): void => {
        setTaskListMap((current) => {
            const next = new Map(current);
            next.forEach((tasks, key) => {
                const containsTask = tasks.some((task) => task.id === props.targetTask.id);
                if (containsTask) {
                    const remainingTasks = tasks.filter((task) => task.id !== props.targetTask.id);
                    next.set(key, updatedTask ? [...remainingTasks, updatedTask] : remainingTasks);
                }
            });
            return next;
        });
        setTasksMap((current) => {
            const next = new Map(current);
            next.forEach((list, taskKey) => {
                if ((JSON.parse(taskKey) as Task).id === props.targetTask.id) next.delete(taskKey);
            });
            if (updatedTask && taskList) next.set(JSON.stringify(updatedTask), taskList);
            return next;
        });
    };

    const completeTask = (): void => {
        const taskList = getTaskListForTask();
        if (!taskList) {
            showNotification(genErrorNotificationProps("Task completion"));
            return;
        }
        setLoading(true);
        const completedTask = {
            ...props.targetTask,
            completed: new Date(Date.now()).toISOString(),
            hidden: true,
            status: "completed",
        };

        GoogleAPI.updateTask(
            credential,
            taskList.id,
            completedTask,
            (): void => {
                let completedTaskCount = 0;
                taskListMap.forEach((tasks) =>
                    tasks.forEach((task) => {
                        if (task.completed && !task.deleted) completedTaskCount++;
                    })
                );
                const previousXp = completedTaskCount * XP_PER_COMPLETED_TASK;
                const nextXp = previousXp + XP_PER_COMPLETED_TASK;
                const previousProgress = getRpgProgress(previousXp);
                const nextProgress = getRpgProgress(nextXp);
                const levelledUp = nextProgress.level > previousProgress.level;

                showNotification({
                    title: levelledUp
                        ? `Level up! Level ${nextProgress.level}: ${nextProgress.title}`
                        : `+${XP_PER_COMPLETED_TASK} XP earned`,
                    message: (
                        <Stack spacing={6}>
                            <Text size="sm">
                                {levelledUp ? "A new rank for completing" : "Earned XP for completing"} “
                                {props.targetTask.title}”
                            </Text>
                            <Progress value={nextProgress.progress} size="sm" radius="xl" color="teal" />
                            <Text size="xs" color="dimmed">
                                {nextProgress.nextXp !== undefined
                                    ? `${nextXp.toLocaleString()} / ${nextProgress.nextXp.toLocaleString()} XP · ${
                                          nextProgress.nextXp - nextXp
                                      } XP to next level`
                                    : `${nextXp.toLocaleString()} XP · highest level reached`}
                            </Text>
                        </Stack>
                    ),
                    color: "teal",
                    icon: <IconAward />,
                    autoClose: 5500,
                });

                setLoading(false);
                updateTaskInLists(taskList, completedTask);
                setTaskCelebration((count) => count + 1);
            },
            (): void => {
                showNotification(genErrorNotificationProps("Task completion"));
                setLoading(false);
            }
        );
    };

    const flagTask = (): void => {
        const taskList = getTaskListForTask();
        if (!taskList) {
            showNotification(genErrorNotificationProps("Task flag"));
            return;
        }
        setLoading(true);
        const flaggedTask = { ...props.targetTask };
        const existingNotes = flaggedTask.notes ?? "";
        flaggedTask.notes = isFlagged
            ? existingNotes.replace(new RegExp(`(^|\\n)${QT_FLAGGED_STR}(?=\\n|$)`), "").replace(/^\n|\n$/g, "")
            : [existingNotes, QT_FLAGGED_STR].filter(Boolean).join("\n");

        GoogleAPI.updateTask(
            credential,
            taskList.id,
            flaggedTask,
            (): void => {
                updateTaskInLists(taskList, flaggedTask);
                if (!isFlagged) {
                    showNotification({
                        title: "Task flagged.",
                        message: "It's in their court now",
                        color: "orange",
                        icon: <IconFlag />,
                    });
                    setIsFlagged(true);
                } else {
                    showNotification({
                        title: "Task unflagged.",
                        message: "You're unblocked! Go and get 'em",
                        color: "yellow",
                        icon: <IconFlagOff />,
                    });
                    setIsFlagged(false);
                }
                setLoading(false);
            },
            (): void => {
                showNotification(genErrorNotificationProps("Task flag"));
                setLoading(false);
            }
        );
    };

    const deleteTask = (): void => {
        const taskList = getTaskListForTask();
        if (!taskList) {
            showNotification(genErrorNotificationProps("Task deletion"));
            return;
        }
        setLoading(true);

        GoogleAPI.deleteTask(
            credential,
            taskList,
            props.targetTask,
            (): void => {
                setLoading(false);
                updateTaskInLists(taskList);
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
        <Group className={isFlagged ? "task-controls flagged" : "task-controls"}>
            <Tooltip label={`Complete task ${props.targetTask.title}`}>
                <ActionIcon
                    color={"green"}
                    onMouseOver={(): void => setIsHoveringOverComplete(true)}
                    onMouseOut={(): void => setIsHoveringOverComplete(false)}
                    onMouseLeave={(): void => setIsHoveringOverComplete(false)}
                    onClick={(): void => completeTask()}
                >
                    {isHoveringOverComplete ? <IconCircleCheck /> : <IconCircleDashed />}
                </ActionIcon>
            </Tooltip>
            <Tooltip label={`Flag task ${props.targetTask.title}`}>
                <ActionIcon color={"orange"} onClick={(): void => flagTask()}>
                    {!isFlagged ? <IconFlag /> : <IconFlagOff />}
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
                        color={"gray"}
                        onMouseOver={(): void => setIsHoveringOverTrash(true)}
                        onMouseOut={(): void => setIsHoveringOverTrash(false)}
                        onMouseLeave={(): void => setIsHoveringOverTrash(false)}
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
