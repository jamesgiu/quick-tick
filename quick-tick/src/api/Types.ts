export interface UserInfoResponse {
    email: string;
    family_name: string;
    given_name: string;
    name: string;
    picture: string;
}

export interface QuickTickCredential extends TokenResponse {
    // The Datetime the user's token will expire
    accessTokenExpiryEpoch: number
}

export interface TokenResponse {
    access_token: string,
    expires_in: number,
    id_token: string,
    refresh_token: string
}
export interface TaskListResponse {
    kind: string,
    etag: string,
    items: TaskList[]
}

export interface TaskResponse {
    kind: string,
    etag: string,
    items: Task[]
}

export interface TaskList {
    taskList: never[];
    kind: string,
    id: string,
    etag: string,
    title: string,
    updated: string,
    selfLink: string,
    tasks: Task[]
}

export interface Task {
    kind: string,
    id: string,
    etag: string,
    title: string,
    updated: string,
    selfLink: string,
    parent: string,
    position: string,
    notes: string,
    status: string,
    due: string,
    completed: string,
    deleted: boolean,
    hidden: boolean,
    taskListId: string,
    links: [
        {
            type: string,
            description: string,
            link: string
        }
    ]
}

export enum GOOGLE_API_ACTIONS {
    BASE_URL = "https://www.googleapis.com",
    USER_INFO = "/oauth2/v3/userinfo"
}

export enum GOOGLE_API_OAUTH {
    BASE_URL = "https://oauth2.googleapis.com",
    TOKEN = "/token"
}
export enum TASK_API_ACTIONS {
    TASK_URL = "https://tasks.googleapis.com",
    TASKLISTS = "/tasks/v1/users/@me/lists/",
    TASKLIST = "/tasks/v1/lists/"
}

export const REQUIRED_SCOPES =  "https://www.googleapis.com/auth/tasks " +
            "https://www.googleapis.com/auth/tasks.readonly " +
            "https://www.googleapis.com/auth/admin.directory.resource.calendar " +
            "https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly"