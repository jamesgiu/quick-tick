export interface UserInfoResponse {
    email: string,
    family_name: string,
    given_name: string,
    name: string,
    picture: string
}

export enum API_ACTIONS {
    USER_INFO = "https://www.googleapis.com/oauth2/v3/userinfo"
}