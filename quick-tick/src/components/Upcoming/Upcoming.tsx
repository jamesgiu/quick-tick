import React, {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {credentialAtom} from "../../recoil/Atoms";
import {GoogleAPI} from "../../api/GoogleAPI";

export default function Upcoming(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    useEffect(()=> {
        GoogleAPI.getTaskLists(credential.access_token, (r)=> {console.log(r)}, (e)=>{console.log(e)})
    }, []);

    return <div className={"upcoming"}>Upcoming</div>;
}
