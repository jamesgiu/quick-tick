import axios, { AxiosPromise } from "axios";
import { NewTaskFormFields } from "../components/Tasks/NewTask/NewTask";
import {
    GOOGLE_API_ACTIONS,
    TASK_API_ACTIONS,
    TaskList,
    Task,
    UserInfoResponse,
    TaskListResponse,
    TaskResponse,
    TokenResponse,
    GOOGLE_API_OAUTH,
    QuickTickCredential,
    TaskListIdTitle,
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
        axios(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLISTS, {
            headers: {
                Authorization: `Bearer ${credential.access_token}`,
            },
        })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    // TODO will need to get this to return all tasks, loop through 100 items at a time
    public static getTasks(
        credential: QuickTickCredential,
        taskListId: string,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios(
            TASK_API_ACTIONS.TASK_URL +
                TASK_API_ACTIONS.TASKLIST +
                taskListId +
                "/tasks?showCompleted=true&showHidden=true&maxResults=100",
            {
                headers: {
                    Authorization: `Bearer ${credential.access_token}`,
                },
            }
        )
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
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
        newTaskValues: NewTaskFormFields,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        // TODO refactor
        const buildDateStringRFC3339 = (date: Date): string => {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T23:59:00.000Z`;
        };

        axios
            .post(
                TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + newTaskValues.taskListId + "/tasks",
                { ...newTaskValues, due: buildDateStringRFC3339(new Date(newTaskValues.due)) },
                {
                    headers: {
                        Authorization: `Bearer ${credential.access_token}`,
                    },
                }
            )
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static completeTask(
        credential: QuickTickCredential,
        taskList: TaskListIdTitle,
        task: Task,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios
            .put(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + taskList.id + "/tasks/" + task.id, task, {
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
            .delete(
                TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLISTS + taskList.id,
                {
                    headers: {
                        Authorization: `Bearer ${credential.access_token}`,
                    },
                }
            )
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
