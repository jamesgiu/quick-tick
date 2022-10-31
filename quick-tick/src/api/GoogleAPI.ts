import axios from "axios";
import {API_ACTIONS, UserInfoResponse} from "./Types";

export class GoogleAPI {
    public static getUserInfo(credential: string, onSuccess: (info: UserInfoResponse) => void, onFailure: (error: string)=> void)
    {
        axios(
            API_ACTIONS.USER_INFO,
            {
                headers: {
                    Authorization: `Bearer ${credential}`,
                },
            }
        ).then((response) => onSuccess(response.data))
            .catch((error) => onFailure(error.message));
    }
}