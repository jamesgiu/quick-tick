import React, {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {credentialAtom} from "../../recoil/Atoms";
import {GoogleAPI} from "../../api/GoogleAPI";
import {Task, TaskList} from "../../api/Types";
import QuickTickTable, {QuickTickTableRow} from "../QuickTickTable/QuickTickTable";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX} from "@tabler/icons";


// TODO
// Task tick/untick
// Hide/show completed
// Multiple tables per task list
// New task form  -> Assign a category which will create a task list
// ** Create Task List
// ** Create Task - maybe use "notes" to extend functionality?
// Investigate the other task object types
// Loading spinners
// Automatic emoji assignment??
// For stats page => pie chart of categories of task
const errorNotification = {
    title: "Task retrieval failed",
    message: "Could not retrieve tasks! 😥",
    color: "red",
    icon: <IconBug />,
}
export default function Upcoming(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);

    const getTasksAsRows = () : QuickTickTableRow[] => {
        const rows: QuickTickTableRow[] = [];

        taskLists.forEach(taskList => {
            if (taskList.tasks) {
                taskList.tasks.forEach(task => {
                    rows.push({rowData: [task.title, task.notes, task.status, task.due, task.completed]});
                })
            }
        })

        return rows;
    }

    // On mount, retrieve and store the logged in User's task lists
    useEffect(()=> {
        GoogleAPI.getTaskLists(credential,
            (response)=> {
                const taskLists = response.items;

                // Now get the tasks for each task list
                taskLists.forEach(taskList => {
                    GoogleAPI.getTasks(credential, taskList.id, (response) => {
                        taskList.tasks = response.items;
                        const newTaskLists = [...taskLists, taskList];
                        setTaskLists(newTaskLists);
                    }, () => { showNotification(errorNotification)});
                });
            },
            ()=>{showNotification(errorNotification)})
    }, []);

    return (
    <div className={"upcoming"}>
        <QuickTickTable headers={["Title", "Notes", "Status", "Due", "Completed"]} rows={getTasksAsRows()}/>
    </div>);
}
