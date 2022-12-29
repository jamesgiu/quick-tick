import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {credentialAtom, taskListsAtom, taskListsMapAtom, tasksAtom} from "../../recoil/Atoms";
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

export default function Upcoming(): JSX.Element {
    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const getTasksAsRows = () : QuickTickTableRow[] => {
        const rows: QuickTickTableRow[] = [];

        console.log(taskListMap);
        
        taskListMap.forEach(taskListTasks => {
            taskListTasks.forEach(task => {
                    rows.push({rowData: [task.title, task.notes, task.status, task.due, task.completed]});
        })
    });

        return rows;
    }

    return (
    <div className={"upcoming"}>
        <QuickTickTable headers={["Title", "Notes", "Status", "Due", "Completed"]} rows={getTasksAsRows()}/>
    </div>);
}
