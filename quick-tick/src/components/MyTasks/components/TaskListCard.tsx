import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {credentialAtom, taskListsAtom, taskListsMapAtom, tasksAtom} from "../../../recoil/Atoms";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX, IconHourglassHigh, IconMoodSad, IconAlarm, IconClock, IconCalendar, IconDotsVertical, IconListCheck} from "@tabler/icons";
import { Task, TaskList } from "../../../api/Types";
import QuickTickTable, { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import { ActionIcon, Badge, Card, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import "./TaskListCard.css";
import NewTask from "../../Tasks/NewTask/NewTask";
import TaskControls from "./TaskControls";
import { Action } from "@remix-run/router";


// TODO

// Draggable
// uses card
// colour-coded based on name
// has a list of tasks
// sort by due date automatically
// have "next week", "next month", "next year" flags
// have "legend" to separate next week, next month, etc. on combined view (e.g. little squares in title)
// completed tasks not shown here


interface TaskListProps {
    taskList: TaskList
}

// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
export const getWeek = (date: Date) : number => {
    var date = new Date(date.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  
  
export default function TaskListCard(props: TaskListProps): JSX.Element {
    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const activeTasks = taskListMap.get(JSON.stringify(props.taskList))?.filter((task) => !task.completed);
    const usePluralPhrasing = activeTasks && (activeTasks?.length === 0 || activeTasks?.length > 1);

    const generateShardsForTask = (task: Task): JSX.Element => {
        const now = new Date(Date.now()) ;
        const nowWeek = getWeek(now);
        const nowMonth = now.getMonth();
        const taskDueDate = new Date(task.due);
        const isTaskDueThisWeek = getWeek(taskDueDate) === nowWeek;
        const isTaskDueToday = isTaskDueThisWeek && now.getDay() === taskDueDate.getDay();
        const isTaskDueNextWeek = getWeek(taskDueDate) === nowWeek + 1;
        const isTaskDueThisMonth = taskDueDate.getMonth() === nowMonth && taskDueDate.getFullYear() === now.getFullYear();
        const isTaskOverDue = taskDueDate.getTime() < now.getTime();

        if (isTaskOverDue) {
            return <Tooltip label="Task is overdue">
                <Badge color="red" variant="light">Overdue <IconMoodSad size={13}/></Badge>            
            </Tooltip>
        }

        if (isTaskDueToday) {
            return <Tooltip label="Task is due today!">
                <Badge color="orange" variant="light">Today <IconHourglassHigh size={13}/></Badge>            
            </Tooltip>
        }

        if (isTaskDueThisWeek) {
            return <Tooltip label="Task is due this week!">
  <Badge color="yellow" variant="light">This week <IconAlarm size={13}/></Badge>          
            </Tooltip>
        }

        if (isTaskDueNextWeek) {
            return <Tooltip label="Task is due next week!">
                <Badge color="yellow" variant="light">Next week <IconClock size={13}/></Badge>          
            </Tooltip>
        }


        if (isTaskDueThisMonth) {
            return <Tooltip label="Task is due this month!">
                 <Badge color="green" variant="light">This month <IconCalendar size={13}/></Badge>          
            </Tooltip>
        }

        return <></>;
    }

    const getTasksAsRows = () : QuickTickTableRow[] => {
        const rows: QuickTickTableRow[] = [];
        if (activeTasks?.length ?? 0 > 0) {
            activeTasks!.forEach(task => {
                if (!task.completed) {
                    rows.push({rowData: [<span>{task.title} {generateShardsForTask(task)}</span>, new Date(task.due).toDateString(), <TaskControls targetTask={task}/>]});
                }
            })
        }

        const sortedRows =  rows.sort((row1, row2) => {
            const row1Date = row1.rowData.at(1);
            const row2Date = row2.rowData.at(1);

            if (row1Date === "Invalid Date") {
                return 1;
            }

            if (row2Date === "Invalid Date") {
                return 1;
            }

            return new Date(row1Date as string).getTime() > new Date(row2Date as string).getTime() ? 1 : -1;
        });

        return sortedRows;
    };

    return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="task-list">
        <span className="draggable-area">
        <Group position="apart" mt="md" mb="xs">
            <IconDotsVertical color={"#a5d8ff"}/>
            <Text weight={500}>{props.taskList.title}</Text>
            <Badge color="pink" variant="light">
               {activeTasks?.length ?? 0} task{usePluralPhrasing ? "s" : ""}
            </Badge>
            <NewTask defaultTaskList={props.taskList}/>
         </Group>
      </span>
      <div className="task-list-table">
        <QuickTickTable headers={["Title", "Due", "Controls"]} rows={getTasksAsRows()}/> 
      </div>
    </Card>);
}
