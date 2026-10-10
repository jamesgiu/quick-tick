import axios from "axios";
import { TaskFormFields } from "../components/Tasks/TaskForm/TaskForm";
import {
    GOOGLE_API_ACTIONS,
    GOOGLE_API_OAUTH,
    QuickTickCredential,
    TASK_API_ACTIONS,
    Task,
    TaskListIdTitle,
    TaskListResponse,
    TaskResponse,
    TokenResponse,
    UserInfoResponse,
    buildDateStringRFC3339,
} from "./Types";

export class GoogleAPI {
    public static getUserInfo(
        credential: QuickTickCredential,
        onSuccess: (info: UserInfoResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios(GOOGLE_API_ACTIONS.BASE_URL + GOOGLE_API_ACTIONS.USER_INFO, {
            headers: {
                Authorization: `Bearer ${credential.access_token}`,
            },
        })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static getTaskLists(
        credential: QuickTickCredential,
        onSuccess: (response: TaskListResponse) => void,
        onFailure: (error: string) => void
    ): void {
        const taskLists: TaskListResponse["items"] = [];
        const fetchPage = (pageToken?: string): void => {
            axios(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLISTS, {
                headers: {
                    Authorization: `Bearer ${credential.access_token}`,
                },
                params: { maxResults: 1000, pageToken },
            })
                .then((response) => {
                    const page: TaskListResponse = response.data;
                    taskLists.push(...(page.items ?? []));
                    if (page.nextPageToken) {
                        fetchPage(page.nextPageToken);
                    } else {
                        onSuccess({ ...page, items: taskLists, nextPageToken: undefined });
                    }
                })
                .catch((error) => onFailure(error.message));
        };

        fetchPage();
    }

    public static getTasks(
        credential: QuickTickCredential,
        taskListId: string,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        const tasks: Task[] = [];
        const fetchPage = (pageToken?: string): void => {
            axios(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + taskListId + "/tasks", {
                headers: {
                    Authorization: `Bearer ${credential.access_token}`,
                },
                params: {
                    showCompleted: true,
                    showHidden: true,
                    maxResults: 100,
                    pageToken,
                },
            })
                .then((response) => {
                    const page: TaskResponse = response.data;
                    tasks.push(...(page.items ?? []));
                    if (page.nextPageToken) {
                        fetchPage(page.nextPageToken);
                    } else {
                        onSuccess({ ...page, items: tasks, nextPageToken: undefined });
                    }
                })
                .catch((error) => onFailure(error.message));
        };

        fetchPage();
    }

    public static createNewTaskList(
        credential: QuickTickCredential,
        taskListTitle: string,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .post(
                TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLISTS,
                { title: taskListTitle },
                {
                    headers: {
                        Authorization: `Bearer ${credential.access_token}`,
                    },
                }
            )
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static createNewTask(
        credential: QuickTickCredential,
        newTaskValues: TaskFormFields,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .post(
                TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + newTaskValues.taskListId + "/tasks",
                { ...newTaskValues, due: buildDateStringRFC3339(newTaskValues.due ?? new Date()) },
                {
                    headers: {
                        Authorization: `Bearer ${credential.access_token}`,
                    },
                }
            )
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static updateTask(
        credential: QuickTickCredential,
        taskListId: string,
        task: Task,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .put(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + taskListId + "/tasks/" + task.id, task, {
                headers: {
                    Authorization: `Bearer ${credential.access_token}`,
                },
            })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static deleteTask(
        credential: QuickTickCredential,
        taskList: TaskListIdTitle,
        task: Task,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .delete(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + taskList.id + "/tasks/" + task.id, {
                headers: {
                    Authorization: `Bearer ${credential.access_token}`,
                },
            })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static deleteTaskList(
        credential: QuickTickCredential,
        taskList: TaskListIdTitle,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .delete(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLISTS + taskList.id, {
                headers: {
                    Authorization: `Bearer ${credential.access_token}`,
                },
            })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static getTokens(
        oauthCode: string,
        onSuccess: (response: TokenResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .post(GOOGLE_API_OAUTH.BASE_URL + GOOGLE_API_OAUTH.TOKEN, {
                client_id: import.meta.env.VITE_GC_CLIENT_ID,
                client_secret: import.meta.env.VITE_GC_CLIENT_SECRET,
                code: oauthCode,
                grant_type: "authorization_code",
                redirect_uri: window.location.protocol + "//" + window.location.host,
            })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static refreshToken(
        credentials: QuickTickCredential,
        onSuccess: (response: TokenResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .post(GOOGLE_API_OAUTH.BASE_URL + GOOGLE_API_OAUTH.TOKEN, {
                client_id: import.meta.env.VITE_GC_CLIENT_ID,
                client_secret: import.meta.env.VITE_GC_CLIENT_SECRET,
                refresh_token: credentials.refresh_token,
                grant_type: "refresh_token",
            })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }
}
