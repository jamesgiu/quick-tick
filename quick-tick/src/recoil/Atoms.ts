import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";
import { QuickTickCredential, Task, TaskList, UserInfoResponse } from "../api/Types";
import {Layout} from "react-grid-layout";

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
    default: [] as Task[]
});

export const taskListsAtom = atom<TaskList[]>({
    key: "tasklists",
    default: [] as TaskList[]
});

export const taskListsMapAtom = atom({
    key: "tasklistsMap",
    default: new Map<string, Task[]>()
})

export const tasksMapAtom = atom({
    key: "tasksMap",
    default: new Map<string, TaskList>()
})

export const taskListLayoutAtom =  atom<Layout[]>({
    key: "tasklistLayout",
    default: [],
    effects_UNSTABLE: [persistAtom]
})