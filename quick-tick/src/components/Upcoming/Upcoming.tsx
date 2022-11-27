import React, {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {credentialAtom} from "../../recoil/Atoms";
import {GoogleAPI} from "../../api/GoogleAPI";
import {Task, TaskList} from "../../api/Types";
import QuickTickTable, {QuickTickTableRow} from "../QuickTickTable/QuickTickTable";

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
        GoogleAPI.getTaskLists(credential.access_token,
            (response)=> {
                const taskLists = response.items;

                // Now get the tasks for each task list
                taskLists.forEach(taskList => {
                    GoogleAPI.getTasks(credential.access_token, taskList.id, (response) => {
                        taskList.tasks = response.items;
                        const newTaskLists = [...taskLists, taskList];
                        setTaskLists(newTaskLists);
                    }, (e) => { console.log(e)});
                });
            },
            (e)=>{console.log(e)})
    }, []);

    return (
    <div className={"upcoming"}>
        <QuickTickTable headers={["Title", "Notes", "Status", "Due", "Completed"]} rows={getTasksAsRows()}/>
    </div>);
}
