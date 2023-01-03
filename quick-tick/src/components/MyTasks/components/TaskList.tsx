import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {credentialAtom, taskListsAtom, taskListsMapAtom, tasksAtom} from "../../../recoil/Atoms";
import {showNotification} from "@mantine/notifications";
import {IconBug, IconUserX, IconDotsVertical, IconListCheck} from "@tabler/icons";
import { Task, TaskList } from "../../../api/Types";
import QuickTickTable, { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import { Badge, Card, Group, Text } from "@mantine/core";
import "./TaskList.css";
import NewTask from "../../Tasks/NewTask/NewTask";


// TODO

// Draggable
// uses card
// colour-coded based on name
// has a list of tasks
// sort by due date automatically
// have "next week", "next month", "next year" flags
// completed tasks not shown here


interface TaskListProps {
    taskList: TaskList
}

export default function TaskListCard(props: TaskListProps): JSX.Element {
    const taskListMap = useRecoilValue<Map<string, Task[]>>(taskListsMapAtom);

    const activeTasks = taskListMap.get(props.taskList.title)?.filter((task) => !task.completed);
    const usePluralPhrasing = activeTasks && (activeTasks?.length === 0 || activeTasks?.length > 1);

    const getTasksAsRows = () : QuickTickTableRow[] => {
        const rows: QuickTickTableRow[] = [];
        if (activeTasks?.length ?? 0 > 0) {
            activeTasks!.forEach(task => {
                if (!task.completed) {
                    rows.push({rowData: [task.title, task.notes, task.status, task.due, task.completed]});
                }
            })
        }

        return rows;
    };

    return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="task-list">
        <span className="draggable-area">
        <Group position="apart" mt="md" mb="xs">
            <IconDotsVertical/>
            <Text weight={500}>{props.taskList.title}</Text>
            <Badge color="pink" variant="light">
               {activeTasks?.length ?? 0} task{usePluralPhrasing ? "s" : ""}
            </Badge>
            <NewTask defaultTaskList={props.taskList}/>
         </Group>
      </span>

      <QuickTickTable headers={["Title", "Notes", "Status", "Due", "Completed"]} rows={getTasksAsRows()}/> 
    </Card>);
}
