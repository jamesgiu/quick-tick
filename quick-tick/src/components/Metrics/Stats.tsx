import { Box, Grid, Group } from "@mantine/core";
import React from "react";
import { useRecoilValue } from "recoil";
import { taskListsMapAtom } from "../../recoil/Atoms";
import {VictoryPie, VictoryChart, VictoryBar, VictoryTheme} from "victory";
import "./Stats.css";
import { clampUseMovePosition } from "@mantine/hooks";

interface ChartValueItem {
    x: string,
    y: number
}

export default function Stats(): JSX.Element {
    const taskListMap = useRecoilValue(taskListsMapAtom);

    const generatePieValuesForBreakdownLastXDays = (days: number) : ChartValueItem[] => {
        const taskListNamesAndCount : ChartValueItem[] = [];
         taskListMap.forEach((tasks, tasklist) => {
            const lastXDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
            // Compare the epoch of the completion date vs last 30 days epoch.
            const completedTasks = tasks.filter(task => task.completed !== undefined && new Date(task.completed).getTime() >= lastXDays.getTime());

            if (completedTasks.length > 0) {
                const newItem = {
                    x: tasklist + `(${completedTasks.length})`,
                    y: completedTasks.length
                }
                
                taskListNamesAndCount.push(newItem);
            }
    
         });
         return taskListNamesAndCount;
    }

    
    const generateChartValuesLast7Days = () : ChartValueItem[] => {
        const taskCompletionAndDate : ChartValueItem[] = [];
         taskListMap.forEach((tasks) => {
            const last7Days = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
            // Compare the epoch of the completion date vs last 30 days epoch.
            const completedTasks = tasks.filter(task => task.completed !== undefined && new Date(task.completed).getTime() >= last7Days.getTime());

            for(let day=1; day < 7; day++) {
                const xVal = new Date(Date.now() - 1000 * 60 * 60 * 24 * day);
                const newItem = {
                    x: xVal.toLocaleDateString(),
                    y: completedTasks.filter(task => new Date(task.completed).toLocaleDateString() === xVal.toLocaleDateString()).length,
                }

                if (newItem.y > 0) {
                    taskCompletionAndDate.push(newItem);
                }
            }
         });

         return taskCompletionAndDate;
    }
    
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
        data={generatePieValuesForBreakdownLastXDays(30)}
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
        data={generatePieValuesForBreakdownLastXDays(7)}
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
          data={generateChartValuesLast7Days()}
          style={{
            data: {
              fill: ({ datum }) => datum.x === 3 ? "#000000" : "#c43a31",
            },
          }}
          range={{y: [1, 10]}}
        />
      </VictoryChart>
</span>
        </Box>
        </div>;
}
