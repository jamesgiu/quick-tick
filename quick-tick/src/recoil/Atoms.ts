import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";
import { Task, TaskList } from "../api/Types";

const { persistAtom } = recoilPersist();

export const credentialAtom = atom({
    key: "credential",
    default: "",
    effects_UNSTABLE: [persistAtom],
});

export const userInfoAtom = atom({
    key: "userInfo",
    default: "",
    effects_UNSTABLE: [persistAtom],
});

export const tasksAtom = atom({
    key: "tasks",
    default: [] as Task[]
});

export const taskListsAtom = atom({
    key: "tasklists",
    default: [] as TaskList[]
});

export const taskListsMapAtom = atom({
    key: "tasklistsMap",
    default: new Map()
})