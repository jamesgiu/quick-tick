import {recoilPersist} from "recoil-persist";
import {atom} from "recoil";

const { persistAtom } = recoilPersist();

export const credentialAtom = atom({
    key: "credential",
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const userInfoAtom = atom({
    key: "userInfo",
    default: '',
    effects_UNSTABLE: [persistAtom]
})