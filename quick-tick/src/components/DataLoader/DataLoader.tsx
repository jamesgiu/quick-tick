import { NotificationProps, showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { GoogleAPI } from "../../api/GoogleAPI";
import { Task, TaskList } from "../../api/Types";
import { credentialAtom, taskListsAtom, tasksAtom, taskListsMapAtom } from "../../recoil/Atoms";
import {IconBug} from "@tabler/icons";
import { LoadingOverlay } from "@mantine/core";
import { ListItem } from "@mantine/core/lib/List/ListItem/ListItem";
import NewTask from "../Tasks/NewTask/NewTask";

function errorNotification(resource: string) : NotificationProps {
    return {
        title: `${resource} retrieval failed`,
        message: `Could not retrieve ${resource}! 😥`,
        color: "red",
        icon: <IconBug />,
    }
}

// Will populate atoms containing the logged in user's tasks and tasklist, for instant-access purposes across the app.
function DataLoader(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const [taskLists, setTaskLists] = useRecoilState<TaskList[]>(taskListsAtom);
    const [taskListMap, setTaskListMap] = useRecoilState<Map<string, Task[]>>(taskListsMapAtom);
    const [loading, setLoading] = useState<Boolean>(false);

    const getTasks = () : void => {
        setLoading(true);
        GoogleAPI.getTaskLists(credential,
            (response)=> {
                const taskLists = response.items;
                setTaskLists(taskLists);
        
                // Now get the tasks for each task list
                taskLists.forEach(taskList => {  
                    setLoading(true);
                    GoogleAPI.getTasks(credential, taskList.id, (response) => {
                        setLoading(false);
                        setTaskListMap(taskListMap.set(taskList.id, response.items));
                    }, () => { showNotification(errorNotification("Tasks"))});
                });
            },
            ()=>{showNotification(errorNotification("TaskLists"))})
    }

    // When the credentail atom is set, then retrieve and set tasks + tasklists.
    useEffect(()=> {
        if (credential !== "") {
            getTasks();
        }

    }, [credential])

    if (loading) {
        return <LoadingOverlay visible={true} overlayBlur={2} />
    }

    return <></>;

}

export default DataLoader;