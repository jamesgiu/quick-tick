import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {credentialAtom, taskListsAtom, taskListsMapAtom, tasksAtom} from "../../../recoil/Atoms";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX} from "@tabler/icons";
import { Task, TaskList } from "../../../api/Types";


// TODO

// check-box to complete
// edit/delete buttons
// flag button (edit notes to store extra detail on a task)
// automatic emoji/icon assignment, can change it too


export default function Task(): JSX.Element {
    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    return (
    <div className={"task"}>
        <div>Task</div>
        
    </div>);
}
