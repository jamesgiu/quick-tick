import { Layout } from "react-grid-layout";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { QuickTickCredential, Task, TaskList, TaskListIdTitle, UserInfoResponse } from "../api/Types";

const { persistAtom } = recoilPersist();

export const dataLoadingAtom = atom<boolean>({
    key: "dataLoading",
    default: false,
});

export const credentialAtom = atom<QuickTickCredential>({
    key: "credential",
    default: undefined,
    effects_UNSTABLE: [persistAtom],
});

export const userInfoAtom = atom<UserInfoResponse>({
    key: "userInfo",
    default: undefined,
    effects_UNSTABLE: [persistAtom],
});

export const tasksAtom = atom<Task[]>({
    key: "tasks",
    default: [] as Task[],
});

export const taskListsAtom = atom<TaskList[]>({
    key: "tasklists",
    default: [] as TaskList[],
});

export const taskListsMapAtom = atom({
    key: "tasklistsMap",
    default: new Map<string, Task[]>(),
});

export const tasksMapAtom = atom({
    key: "tasksMap",
    default: new Map<string, TaskListIdTitle>(),
});

export const navbarCollapsedAtom = atom({
    key: "navbarCollapsed",
    default: false,
    effects_UNSTABLE: [persistAtom],
});

export const taskListLayoutAtom = atom<Layout[]>({
    key: "tasklistLayout",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const collapsedTaskListIds = atom<string[]>({
    key: "collapsedTaskListIds",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export interface TaskNumbers {
    overdue: number;
    dueToday: number;
    dueTomorrow: number;
    dueThisWeek: number;
    dueThisWeekend: number;
}

export const taskNumbersAtom = atom<TaskNumbers>({
    key: "taskNumbers",
    default: {
        overdue: 0,
        dueToday: 0,
        dueTomorrow: 0,
        dueThisWeek: 0,
        dueThisWeekend: 0,
    },
});

export const forceRefreshAtom = atom<boolean>({
    key: "forceRefresh",
    default: false,
});
