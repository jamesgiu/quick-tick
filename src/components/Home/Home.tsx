import React, { useEffect, useState } from "react";
import "./Home.css";
import { Alert, Avatar, Blockquote, Card, Center, Divider, Text, Title } from "@mantine/core";
import { IconBrandGithub, IconChecks, IconBulb, IconMoodSad } from "@tabler/icons";
import { LOGO } from "../AppShell/components/Header/QuickTickHeader";
import { taskListsMapAtom, userInfoAtom } from "../../recoil/Atoms";
import { useRecoilValue } from "recoil";
import Quote from "inspirational-quotes";
import { TaskUtil } from "../MyTasks/components/TaskUtil";

const SVG_WAVE = (
    <svg viewBox="0 -30 500 80" width="100%" height="50" preserveAspectRatio="none" className={"svg-wave"}>
        <path
            transform="translate(0, -15)"
            d="M0,2 c30,-22 240,0 350,18 c90,17 230,7.5 350,-20 v50 h-700"
            fill="#007180C1"
        />
        <path d="M0,2 c30,-18 230,-12 350,7 c80,13 230,17 350,-5 v100 h-700z" fill="#1b1c1d" />
    </svg>
);

const SVG_WAVE_BOTTOM = (
    <svg viewBox="0 -30 80 500" width="100%" height="50" preserveAspectRatio="none" className={"svg-wave-bottom"}>
        <path d="M0,5 c60,-18 230,-12 350,7 c80,13 230,17 120,-10 v100 h-700z" fill="#1b1c1d" />
        <path
            transform="translate(0, -30)"
            d="M0,5 c100,-22 100,0 180,18 c90,3 80,3 180,-20 v50 h-700"
            fill=" #007180C1"
        />
    </svg>
);

export default function Home(): JSX.Element {
    const userInfo = useRecoilValue(userInfoAtom);
    const taskListMap = useRecoilValue(taskListsMapAtom);
    const [inspirationalQuote, setInspirationalQuote] = useState<{text: string, author: string}>();

    const [numberTasksDueToday, setNumberTasksDueToday] = useState<number>(0);
    const [numberTasksDueTomorrow, setNumberTasksDueTomorrow] = useState<number>(0);
    const [numberTasksDueThisWeek, setNumberTasksDueThisWeek] = useState<number>(0);
    const [numberTasksOverdue, setNumberTasksOverdue] = useState<number>(0);

    useEffect(()=> {
        setInspirationalQuote(Quote.getQuote());
        setLiveTaskStats();
    }, []);

    function getCompletedTasksToday(): number {
        const now = new Date(Date.now());
        const nowWeek = TaskUtil.getWeek(now);

        const completedTasksToday = [];
        taskListMap.forEach((tasks) => {
 
        const completedTasks =        tasks.filter((task) => {
            const taskCompletionDate = new Date(task.completed);
            const wasTaskCompletedThisWeek = TaskUtil.getWeek(taskCompletionDate) === nowWeek;
            return wasTaskCompletedThisWeek && now.getDay() === taskCompletionDate.getDay();
        });

        completedTasksToday.push(...completedTasks);
       });

       return completedTasksToday.length;
    }

    const completedTasksToday = getCompletedTasksToday();

    function setLiveTaskStats() : void {
        let numberTasksOverdue = 0;
        let numberTasksDueToday = 0;
        let numberTasksDueTomorrow = 0;
        let numberTasksDueThisWeek = 0;

        taskListMap.forEach((tasks) => {
            tasks.forEach((task) => {
                if (!task.completed) {
                    if (TaskUtil.isTaskOverDue(task)) {
                        numberTasksOverdue++;
                    }
                    
                    if (TaskUtil.isTaskDueToday(task)) {
                        numberTasksDueToday++
                    }
    
                    if (TaskUtil.isTaskDueTomorrow(task)) {
                        numberTasksDueTomorrow++;
                    }
    
                    if (TaskUtil.isTaskDueThisWeek(task) || TaskUtil.isTaskDueToday(task) || TaskUtil.isTaskDueTomorrow(task)) {
                        numberTasksDueThisWeek++;
                    }
                } 
            })
        });

        setNumberTasksOverdue(numberTasksOverdue);
        setNumberTasksDueToday(numberTasksDueToday);
        setNumberTasksDueTomorrow(numberTasksDueTomorrow);
        setNumberTasksDueThisWeek(numberTasksDueThisWeek);
    }

    return (
        <div className={"home"}>
            <Center>
                <Avatar radius={"xl"}>
                    <IconChecks size={30} />
                </Avatar>
            </Center>
            <h2>Welcome to {LOGO}</h2>
            <i>A task-management application</i>
            {userInfo && inspirationalQuote &&
            <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={3}>G'day, {userInfo.given_name}</Title>
                <Blockquote cite={inspirationalQuote.author}>{inspirationalQuote.text}</Blockquote>
                <Alert icon={<IconBulb size={16} />} title="Today at a glance" color="cyan">
                    So far, you have completed {completedTasksToday} task{completedTasksToday === 1 ? "" : "s"} today.

                    There's {numberTasksDueToday} task{numberTasksDueToday === 1 ? "" : "s"} due today. {numberTasksDueTomorrow} task{numberTasksDueTomorrow === 1 ? "" : "s"} due for tomorrow.

                    In total, {numberTasksDueThisWeek} task{numberTasksDueThisWeek === 1 ? "" : "s"} due this week.
                </Alert>
                {numberTasksOverdue > 0 && 
                <Alert icon={<IconMoodSad size={16} />} title="Tasks overdue" color="red">
                    {numberTasksOverdue} task{numberTasksOverdue === 1 ? "" : "s"} overdue.
                </Alert>
                }
            </Card>
            }
            <Divider my="sm" />
            {SVG_WAVE}
            <div className={"home-content-area"}>
                <IconBrandGithub />
                <Text size={"sm"}>
                    QuickTick is an open source project, have a{" "}
                    <a href={"https://github.com/jamesgiu/quick-tick"}>gander</a>.
                </Text>
            </div>
            {SVG_WAVE_BOTTOM}
        </div>
    );
}
