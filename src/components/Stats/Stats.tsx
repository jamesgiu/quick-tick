import { Box, Grid, Group } from "@mantine/core";
import React from "react";
import { useRecoilValue } from "recoil";
import { taskListsMapAtom } from "../../recoil/Atoms";
import {VictoryPie, VictoryChart, VictoryBar, VictoryTheme} from "victory";
import "./Stats.css";
import { clampUseMovePosition } from "@mantine/hooks";
import { Task } from "../../api/Types";

interface ChartValueItem {
    x: string | Date,
    y: number
}


export const generatePieValuesForBreakdownLastXDays = (taskListMap: Map<string, Task[]>, days: number) : ChartValueItem[] => {
    const taskListNamesAndCount : ChartValueItem[] = [];
     taskListMap.forEach((tasks, tasklist) => {
        const lastXDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
        // Compare the epoch of the completion date vs last 30 days epoch.
        const completedTasks = tasks.filter(task => task.completed !== undefined && new Date(task.completed).getTime() >= lastXDays.getTime());

        if (completedTasks.length > 0) {
            const newItem = {
                x: JSON.parse(tasklist).title + `(${completedTasks.length})`,
                y: completedTasks.length
            }
            
            taskListNamesAndCount.push(newItem);
        }

     });
     return taskListNamesAndCount.sort();
}


export const generateChartValuesLastXDays = (taskListMap: Map<string, Task[]>, days: number) : ChartValueItem[] => {
    const taskCompletionAndDate : ChartValueItem[] = [];
     taskListMap.forEach((tasks) => {
        const last7Days = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
        // Compare the epoch of the completion date vs last 30 days epoch.
        const completedTasks = tasks.filter(task => task.completed !== undefined && new Date(task.completed).getTime() >= last7Days.getTime());

        for(let day=1; day < days; day++) {
            const xVal = new Date(Date.now() - 1000 * 60 * 60 * 24 * day);
            const newItem = {
                x: xVal,
                y: completedTasks.filter(task => new Date(task.completed).getDate() === xVal.getDate()).length,
            }

            if (newItem.y > 0) {
                taskCompletionAndDate.push(newItem);
            }
        }
     });

     return taskCompletionAndDate
}

export default function Stats(): JSX.Element {
    const taskListMap = useRecoilValue(taskListsMapAtom);
    
    return <div className={"stats"}>
        Stats
        <h4>
            Breakdown of completed tasks by task list
        </h4> 
        <Grid className="pie-grid" columns={10}>
            <Grid.Col span={5}>
        <Box>
        <h5>
            Last 30 days
        </h5> 
            <span className="tasks-breakdown-pie">
                    <VictoryPie
        data={generatePieValuesForBreakdownLastXDays(taskListMap, 30)}
            theme={VictoryTheme.material}
        />
        </span>
        </Box>
        </Grid.Col>
        <Grid.Col span={5}>
        <Box>
           <h5>
            Last 7 days
            </h5> 
            
            <span className="tasks-breakdown-pie">
                    <VictoryPie
        data={generatePieValuesForBreakdownLastXDays(taskListMap, 7)}
            theme={VictoryTheme.material}
        />
        </span>
        </Box>
        </Grid.Col>
        </Grid>
        <Box>
           <h4>
            Task completion over time, last 7 days
            </h4> 
            <span className="tasks-breakdown-chart">
            <VictoryChart>
        <VictoryBar
          data={generateChartValuesLastXDays(taskListMap, 7)}
          style={{
            data: {
              fill: "#c43a31",
            },
          }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
          scale={{x: "time"}}
        />
      </VictoryChart>
</span>
        </Box>
        </div>;
}
