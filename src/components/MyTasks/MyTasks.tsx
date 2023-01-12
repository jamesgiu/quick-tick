import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilStateLoadable, useRecoilValue} from "recoil";
import {credentialAtom, taskListLayoutAtom, taskListsAtom, taskListsMapAtom, tasksAtom} from "../../recoil/Atoms";
import {GoogleAPI} from "../../api/GoogleAPI";
import {Task, TaskList} from "../../api/Types";
import QuickTickTable, {QuickTickTableRow} from "../QuickTickTable/QuickTickTable";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX} from "@tabler/icons";
import {Layout} from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import TaskListCard, { TaskListFilter } from "./components/TaskListCard";
import "./MyTasks.css";
import { LoadingOverlay } from "@mantine/core";
import NewTaskList from "../Tasks/NewTasklist/NewTasklist";
import NewTask from "../Tasks/NewTask/NewTask";
import { useSearchParams } from "react-router-dom";


// TODO
// ** Create Task - maybe use "notes" to extend functionality?
// dropdown for Filtered by 

export default function MyTasks(): JSX.Element {
    let [searchParams, setSearchParams] = useSearchParams();
    const taskLists = useRecoilValue<TaskList[]>(taskListsAtom);

    const whenParam: TaskListFilter | null = searchParams.get("when") as unknown as TaskListFilter; 

    const [layout, setLayout] = useRecoilState<Layout[]>(taskListLayoutAtom);

    const getTaskListPanels = () : JSX.Element[] => {
        const taskListPanels: JSX.Element[] = [];
        const layoutIds = layout.map(layoutItem => layoutItem.i).sort();
        const taskListIds = taskLists.map(taskList => taskList.id).sort();
        let newLayout : Layout[] = [...layout];
    
        for(let i = 0; i < taskLists.length; i++) {
            const taskList = taskLists.at(i)!;
            const taskListIdTitle = {
                id: taskList.id,
                title: taskList.title
            }

            taskListPanels.push(
                <div key={taskList.id} className="panel">
                    <TaskListCard taskList={taskListIdTitle} filter={whenParam ? whenParam as TaskListFilter : undefined}/>
                </div>
            )

            if (JSON.stringify(layoutIds) !== JSON.stringify(taskListIds)) {                
                // If we haven't seen this tasklist id before, add it to our layouts array.
                if (!layoutIds.includes(taskList.id)) {
                    const layoutItem = {i: taskList.id, x: 0, y: i, h: 15, w: 5};
                    newLayout.push(layoutItem);
                }

                if (i === taskLists.length - 1 && JSON.stringify(layout) !== JSON.stringify(newLayout)) {
                    setLayout(newLayout);
                }
            }   
        };
    
        return taskListPanels;
    }

    return (
    <div className={"my-tasks"}>
        <div>My Tasks</div>
        {searchParams.get("when") && <div>Filtered by: {whenParam}</div>}
        <NewTaskList/>
        <NewTask/>
        <ResponsiveGridLayout
            className="layout"
            layouts={{'lg': layout, 'md': layout, 'sm': layout, 'xs': layout, 'xxs': layout}}
            onDragStop={(layout) => setLayout(layout)}
            onResizeStop={(layout) => setLayout(layout)}
            rowHeight={5}
            cols={{'lg': 12, 'md': 12, 'sm': 12, 'xs': 12, 'xxs': 12}}
        >
            {getTaskListPanels()}
       </ResponsiveGridLayout>
    </div>);
}
