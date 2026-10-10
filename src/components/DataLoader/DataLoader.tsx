import { ActionIcon, Group, Text } from "@mantine/core";
import { NotificationProps, showNotification } from "@mantine/notifications";
import { IconBug, IconRefresh, IconRefreshAlert } from "@tabler/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { GoogleAPI } from "../../api/GoogleAPI";
import { Task, TaskList, TaskListIdTitle } from "../../api/Types";
import {
    TaskNumbers,
    credentialAtom,
    dataLoadingAtom,
    forceRefreshAtom,
    taskListsAtom,
    taskListsMapAtom,
    taskNumbersAtom,
    tasksMapAtom,
} from "../../recoil/Atoms";
import { TaskUtil } from "../MyTasks/components/TaskUtil";

export function genErrorNotificationProps(resource: string): NotificationProps {
    return {
        title: `${resource} process failed`,
        message: `Could not process ${resource}! 😥`,
        color: "red",
        icon: <IconBug />,
    };
}

const DEFAULT_POLL_COUNTDOWN = 300;

const getLiveTaskStats = (lists: Map<string, Task[]>): TaskNumbers => {
    const numbers: TaskNumbers = {
        overdue: 0,
        dueToday: 0,
        dueTomorrow: 0,
        dueThisWeek: 0,
        dueThisWeekend: 0,
    };
    lists.forEach((tasks) =>
        tasks.forEach((task) => {
            if (task.completed || task.deleted) return;
            if (TaskUtil.isTaskOverDue(task)) numbers.overdue++;
            if (TaskUtil.isTaskDueToday(task)) numbers.dueToday++;
            if (TaskUtil.isTaskDueTomorrow(task)) numbers.dueTomorrow++;
            if (TaskUtil.isTaskDueThisWeek(task) || TaskUtil.isTaskDueToday(task) || TaskUtil.isTaskDueTomorrow(task)) {
                numbers.dueThisWeek++;
            }
            if (TaskUtil.isTaskDueThisWeekend(task)) numbers.dueThisWeekend++;
        })
    );
    return numbers;
};

// FIXME QT-37
// Try remove all cached data types from global state? Instead, fetch as required?
// More requests that way but perhaps less buggy? idk
// Will populate atoms containing the logged in user's tasks and tasklist, for instant-access purposes across the app.
function DataLoader(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const setTaskLists = useSetRecoilState<TaskList[]>(taskListsAtom);
    const [taskListMap, setTaskListMap] = useRecoilState<Map<string, Task[]>>(taskListsMapAtom);
    const setTaskMap = useSetRecoilState<Map<string, TaskListIdTitle>>(tasksMapAtom);
    const setTaskNumbers = useSetRecoilState<TaskNumbers>(taskNumbersAtom);
    const setLoading = useSetRecoilState<boolean>(dataLoadingAtom);
    const [forceRefresh, setForceRefresh] = useRecoilState<boolean>(forceRefreshAtom);
    const [pollCountdown, setPollCountdown] = useState<number>(DEFAULT_POLL_COUNTDOWN);
    const requestId = useRef(0);
    const isMounted = useRef(false);
    const cachedTaskLists = useRef(taskListMap);

    useEffect(() => {
        cachedTaskLists.current = taskListMap;
    }, [taskListMap]);

    const getTasks = useCallback(
        async (hideLoading = false): Promise<void> => {
            const currentRequestId = ++requestId.current;
            if (!hideLoading) {
                setLoading(true);
            }
            if (!credential) {
                setLoading(false);
                return;
            }

            const getTaskLists = (): Promise<TaskList[]> =>
                new Promise((resolve, reject) =>
                    GoogleAPI.getTaskLists(credential, (response) => resolve(response.items ?? []), reject)
                );
            const getTasksForList = (id: string): Promise<Task[]> =>
                new Promise((resolve, reject) =>
                    GoogleAPI.getTasks(credential, id, (response) => resolve(response.items ?? []), reject)
                );

            try {
                const taskLists = await getTaskLists();
                const results = await Promise.allSettled(taskLists.map((list) => getTasksForList(list.id)));
                if (currentRequestId !== requestId.current || !isMounted.current) {
                    return;
                }

                const nextTaskListMap = new Map<string, Task[]>();
                const taskListTitles = new Map<string, TaskListIdTitle>();
                taskLists.forEach((taskList, index) => {
                    const taskListIdTitle: TaskListIdTitle = { id: taskList.id, title: taskList.title };
                    const key = JSON.stringify(taskListIdTitle);
                    taskListTitles.set(key, taskListIdTitle);
                    const result = results[index];
                    if (result.status === "fulfilled") {
                        nextTaskListMap.set(
                            key,
                            result.value.filter((task) => !task.deleted)
                        );
                    } else {
                        const cachedKey = Array.from(cachedTaskLists.current.keys()).find(
                            (existingKey) => JSON.parse(existingKey).id === taskList.id
                        );
                        nextTaskListMap.set(key, cachedKey ? cachedTaskLists.current.get(cachedKey) ?? [] : []);
                        showNotification(genErrorNotificationProps(`Tasks for ${taskList.title}`));
                    }
                });

                const nextTasksMap = new Map<string, TaskListIdTitle>();
                nextTaskListMap.forEach((tasks, key) => {
                    const taskList = taskListTitles.get(key) ?? JSON.parse(key);
                    tasks.forEach((task) => nextTasksMap.set(JSON.stringify(task), taskList));
                });

                setTaskLists(taskLists);
                setTaskListMap(nextTaskListMap);
                setTaskMap(nextTasksMap);
            } catch {
                if (currentRequestId === requestId.current && isMounted.current) {
                    showNotification(genErrorNotificationProps("TaskLists"));
                }
            } finally {
                if (currentRequestId === requestId.current && isMounted.current) {
                    setLoading(false);
                }
            }
        },
        [credential, setLoading, setTaskListMap, setTaskLists, setTaskMap]
    );

    useEffect(() => {
        isMounted.current = true;
        if (credential) {
            void getTasks();
        }
        return () => {
            isMounted.current = false;
        };
    }, [credential, getTasks]);

    useEffect(() => {
        if (!credential) {
            return;
        }
        if (pollCountdown <= 0) {
            void getTasks(true);
            setPollCountdown(DEFAULT_POLL_COUNTDOWN);
            return;
        }
        const timeout = window.setTimeout(() => setPollCountdown((countdown) => countdown - 1), 1000);
        return () => window.clearTimeout(timeout);
    }, [credential, getTasks, pollCountdown]);

    useEffect(() => {
        if (forceRefresh) {
            void getTasks(true);
            setForceRefresh(false);
        }
    }, [forceRefresh, getTasks, setForceRefresh]);

    /*
     * Keep stats derived from the exact newly committed cache. Recoil Maps are
     * replaced rather than mutated so subscribers reliably render fresh data.
     */
    useEffect(() => {
        setTaskNumbers(getLiveTaskStats(taskListMap));
    }, [setTaskNumbers, taskListMap]);

    return (
        <Group>
            <ActionIcon
                color="#a5d8ff"
                aria-label="Refresh tasks"
                onClick={(): void => {
                    void getTasks();
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
