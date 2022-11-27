import axios from "axios";
import {
    GOOGLE_API_ACTIONS,
    TASK_API_ACTIONS,
    TaskList,
    Task,
    UserInfoResponse,
    TaskListResponse,
    TaskResponse
} from "./Types";

export class GoogleAPI {
    public static getUserInfo(
        credential: string,
        onSuccess: (info: UserInfoResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios(GOOGLE_API_ACTIONS.BASE_URL + GOOGLE_API_ACTIONS.USER_INFO, {
            headers: {
                Authorization: `Bearer ${credential}`,
            },
        })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static getTaskLists(
        credential: string,
        onSuccess: (response: TaskListResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLISTS, {
            headers: {
                Authorization: `Bearer ${credential}`,
            },
        })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }

    public static getTasks(
        credential: string,
        taskListId: string,
        onSuccess: (response: TaskResponse) => void,
        onFailure: (error: string) => void
    ): void {
        axios(TASK_API_ACTIONS.TASK_URL + TASK_API_ACTIONS.TASKLIST + taskListId + "/tasks", {
            headers: {
                Authorization: `Bearer ${credential}`,
            },
        })
            .then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }
}
