import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {credentialAtom, taskListsAtom, taskListsMapAtom, tasksAtom, tasksMapAtom} from "../../../recoil/Atoms";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX, IconCircleDashed, IconMoodSmileBeam, IconGhost, IconCheckbox, IconCircleCheck, IconTrash, IconTrashX} from "@tabler/icons";
import { Task, TaskList } from "../../../api/Types";
import { ActionIcon, Button, Group, Loader, LoadingOverlay } from "@mantine/core";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";


// TODO

// check-box to complete
// edit/delete buttons
// flag button (edit notes to store extra detail on a task)
// automatic emoji/icon assignment, can change it too

interface TaskControlsProps {
    targetTask: Task
}

export default function TaskControls(props: TaskControlsProps): JSX.Element {
    const tasksMap = useRecoilValue<Map<string, TaskList>>(tasksMapAtom);
    const credential = useRecoilValue(credentialAtom);

    const [loading, setLoading] = useState<boolean>(false);

    const [isHoveringOverComplete, setIsHoveringOverComplete] = useState<Boolean>(false);
    const [isHoveringOverTrash, setIsHoveringOverTrash] = useState<Boolean>(false);

    // Local copy of task obj
    const [localTask, setLocalTask] = useState<Task>(props.targetTask);

    const completeTask = () => {
        setLoading(true);
        const completedTask = {...localTask, completed: new Date(Date.now()).toISOString(), hidden: true, status: "completed"};

        GoogleAPI.completeTask(credential, tasksMap.get(JSON.stringify(props.targetTask))!, completedTask, () => { 
            showNotification({
            title: "Task completed!",
            message: "Well done!",
            color: "green",
            icon: <IconMoodSmileBeam/>
            });
            setLoading(false);
            setLocalTask(completedTask);
          }, () => { showNotification(genErrorNotificationProps("Task completion")); setLoading(false);})
    }   

    
    const deleteTask = () => {
        setLoading(true);
        const deletedTask = {...localTask, deleted: true};

        GoogleAPI.deleteTask(credential, tasksMap.get(JSON.stringify(props.targetTask))!, deletedTask, () => { 
            setLocalTask(deletedTask);
            setLoading(false);
          }, () => { showNotification(genErrorNotificationProps("Task deletion")); setLoading(false); })
    }  

    if (loading) {
        return (
            <LoadingOverlay visible={true} overlayBlur={2}/>
        )
    }

    // The default view, all actions available.
    if (!localTask.completed && !localTask.deleted) {
        return (
                <Group className={"task-controls"}>
                    <ActionIcon 
                        color={"#a5d8ff"}
                        onMouseOver={()=> setIsHoveringOverComplete(true)} 
                        onMouseOut={() => setIsHoveringOverComplete(false)}
                        onClick={() => completeTask()}
                    >
                        {isHoveringOverComplete ? <IconCircleCheck/> : <IconCircleDashed/>}
                    </ActionIcon>
                    <ActionIcon 
                        color={"#a5d8ff"}
                        onMouseOver={()=> setIsHoveringOverTrash(true)} 
                        onMouseOut={() => setIsHoveringOverTrash(false)}
                        onClick={() => deleteTask()}
                    >
                        {isHoveringOverTrash ? <IconTrashX/> : <IconTrash/>}
                    </ActionIcon>
                </Group>);
    }

    // If the task was deleted.
    if (localTask.deleted) {
        return (
            <Group className={"task-controls"}>
                 <IconGhost/>
            </Group>
        )
    
    }
    
    // If the task was completed.
    if (localTask.completed) {
        return (
            <Group className={"task-controls"}>
                <IconMoodSmileBeam color={"lightgreen"}/>
            </Group>
        )
    }

    return <></>;
}
