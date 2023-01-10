import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {credentialAtom, taskListsAtom, taskListsMapAtom, tasksAtom} from "../../../recoil/Atoms";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX, IconHourglassLow, IconHourglassHigh, IconMoodSad, IconAlarm, IconClock, IconCalendar, IconDotsVertical, IconListCheck} from "@tabler/icons";
import { Task, TaskList } from "../../../api/Types";
import QuickTickTable, { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import { ActionIcon, Badge, Card, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import "./TaskListCard.css";
import NewTask from "../../Tasks/NewTask/NewTask";
import TaskControls from "./TaskControls";
import { Action } from "@remix-run/router";
import { TaskUtil } from "./TaskUtil";


export enum TaskListFilter {
    TODAY = "today",
    WEEKLY = "weekly"
}
// have "next week", "next month", "next year" flags
// have "legend" to separate next week, next month, etc. on combined view (e.g. little squares in title)
// completed tasks not shown here

interface TaskListProps {
    taskList: TaskList,
    filter?: TaskListFilter
}

export default function TaskListCard(props: TaskListProps): JSX.Element {
    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const activeTasks = taskListMap.get(JSON.stringify(props.taskList))?.filter((task) => !task.completed);
    const usePluralPhrasing = activeTasks && (activeTasks?.length === 0 || activeTasks?.length > 1);

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
        {activeTasks && 
        <QuickTickTable headers={["Title", "Due", "Controls"]} rows={TaskUtil.getTasksAsRows(activeTasks, props.filter)}/> }
      </div>
    </Card>);
}
