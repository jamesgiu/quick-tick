import { ActionIcon, Group, Text } from "@mantine/core";
import { NotificationProps, showNotification } from "@mantine/notifications";
import { IconBug, IconRefresh, IconRefreshAlert } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { GoogleAPI } from "../../api/GoogleAPI";
import { Task, TaskList, TaskListIdTitle } from "../../api/Types";
import { credentialAtom, dataLoadingAtom, taskListsAtom, taskListsMapAtom, tasksMapAtom } from "../../recoil/Atoms";

export function genErrorNotificationProps(resource: string): NotificationProps {
    return {
        title: `${resource} process failed`,
        message: `Could not process ${resource}! 😥`,
        color: "red",
        icon: <IconBug />,
    };
}

const DEFAULT_POLL_COUNTDOWN = 3;

// Will populate atoms containing the logged in user's tasks and tasklist, for instant-access purposes across the app.
function DataLoader(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const setTaskLists = useSetRecoilState<TaskList[]>(taskListsAtom);
    const [taskListMap, setTaskListMap] = useRecoilState<Map<string, Task[]>>(taskListsMapAtom);
    const [taskMap, setTaskMap] = useRecoilState<Map<string, TaskListIdTitle>>(tasksMapAtom);
    const setLoading = useSetRecoilState<boolean>(dataLoadingAtom);
    const [pollCountdown, setPollCountdown] = useState<number>(DEFAULT_POLL_COUNTDOWN);

    const getTasks = (fromPoller?: boolean): void => {
        if (!fromPoller) {
            setLoading(true);
        }
        GoogleAPI.getTaskLists(
            credential,
            (response) => {
                const taskLists = response.items;
                setTaskLists(taskLists);

                // Now get the tasks for each task list
                taskLists.forEach((taskList) => {
                    if (!fromPoller) {
                        setLoading(true);
                    }
                    GoogleAPI.getTasks(
                        credential,
                        taskList.id,
                        (response) => {
                            setLoading(false);
                            const taskListIdTitle: TaskListIdTitle = {
                                id: taskList.id,
                                title: taskList.title,
                            };
                            setTaskListMap(taskListMap.set(JSON.stringify(taskListIdTitle), response.items));
                            response.items.forEach((task) =>
                                setTaskMap(taskMap.set(JSON.stringify(task), taskListIdTitle))
                            );
                        },
                        () => {
                            showNotification(genErrorNotificationProps("Tasks"));
                            setLoading(false);
                        }
                    );
                });
            },
            () => {
                showNotification(genErrorNotificationProps("TaskLists"));
                setLoading(false);
            }
        );
    };

    // When the credentail atom is set, then retrieve and set tasks + tasklists.
    useEffect(() => {
        if (credential) {
            getTasks();
            setTimeout(() => setPollCountdown(pollCountdown - 1), 1000);
        }
    }, [credential]);

    useEffect(() => {
        if (credential) {
            if (pollCountdown > 0) {
                setTimeout(() => setPollCountdown(pollCountdown - 1), 1000);
            } else {
                getTasks(true);
                setPollCountdown(DEFAULT_POLL_COUNTDOWN);
            }
        }
    }, [pollCountdown]);

    return (
        <Group>
            <ActionIcon
                color="#a5d8ff"
                onClick={(): void => {
                    getTasks();
                    setPollCountdown(DEFAULT_POLL_COUNTDOWN);
                }}
            >
                <Text size="xs" color="#a5d8ff">
                    {pollCountdown}
                </Text>
                {pollCountdown > 1 ? <IconRefresh size={18} /> : <IconRefreshAlert size={18} />}
            </ActionIcon>
        </Group>
    );
}

export default DataLoader;
