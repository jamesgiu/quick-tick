import { Alert, Avatar, Blockquote, Card, Center, Divider, List, Text, ThemeIcon, Title } from "@mantine/core";
import {
    IconBrandGithub,
    IconBulb,
    IconInfoCircle,
    IconLogout,
    IconWreckingBall,
    IconBackhoe,
    IconBulldozer,
    IconMoodSad,
} from "@tabler/icons";
import Quote from "inspirational-quotes";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { taskListsMapAtom, userInfoAtom } from "../../recoil/Atoms";
import { LOGO } from "../AppShell/components/Header/QuickTickHeader";
import { TaskUtil } from "../MyTasks/components/TaskUtil";
import "./Home.css";

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
    const [inspirationalQuote, setInspirationalQuote] = useState<{ text: string; author: string }>();

    const [numberTasksDueToday, setNumberTasksDueToday] = useState<number>(0);
    const [numberTasksDueTomorrow, setNumberTasksDueTomorrow] = useState<number>(0);
    const [numberTasksDueThisWeek, setNumberTasksDueThisWeek] = useState<number>(0);
    const [numberTasksOverdue, setNumberTasksOverdue] = useState<number>(0);

    useEffect(() => {
        setInspirationalQuote(Quote.getQuote());
    }, []);

    useEffect(() => {
        setLiveTaskStats();
    }, [taskListMap]);

    function getCompletedTasksToday(): number {
        const now = new Date(Date.now());
        const nowWeek = TaskUtil.getWeek(now);

        const completedTasksToday = [];
        taskListMap.forEach((tasks) => {
            const completedTasks = tasks.filter((task) => {
                const taskCompletionDate = new Date(task.completed);
                const wasTaskCompletedThisWeek = TaskUtil.getWeek(taskCompletionDate) === nowWeek;
                return wasTaskCompletedThisWeek && now.getDay() === taskCompletionDate.getDay();
            });

            completedTasksToday.push(...completedTasks);
        });

        return completedTasksToday.length;
    }

    const completedTasksToday = getCompletedTasksToday();

    function setLiveTaskStats(): void {
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
                        numberTasksDueToday++;
                    }

                    if (TaskUtil.isTaskDueTomorrow(task)) {
                        numberTasksDueTomorrow++;
                    }

                    if (
                        TaskUtil.isTaskDueThisWeek(task) ||
                        TaskUtil.isTaskDueToday(task) ||
                        TaskUtil.isTaskDueTomorrow(task)
                    ) {
                        numberTasksDueThisWeek++;
                    }
                }
            });
        });

        setNumberTasksOverdue(numberTasksOverdue);
        setNumberTasksDueToday(numberTasksDueToday);
        setNumberTasksDueTomorrow(numberTasksDueTomorrow);
        setNumberTasksDueThisWeek(numberTasksDueThisWeek);
    }

    return (
        <div className={"home"}>
            <Center>
                <img src={import.meta.env.VITE_BASE_PATH + "/qtlogo_bulb.png"} />
            </Center>
            <h2>Welcome to {LOGO}</h2>
            <i>A task-management application</i>
            {userInfo && inspirationalQuote && (
                <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={3}>G'day, {userInfo.given_name}</Title>
                    <Blockquote cite={inspirationalQuote.author}>{inspirationalQuote.text}</Blockquote>
                    <Alert icon={<IconBulb size={32} />} title="Today at a glance" color="cyan">
                        So far, you have completed {completedTasksToday} task{completedTasksToday === 1 ? "" : "s"}{" "}
                        today. There's {numberTasksDueToday} task{numberTasksDueToday === 1 ? "" : "s"} left for today.{" "}
                        {numberTasksDueTomorrow} task{numberTasksDueTomorrow === 1 ? "" : "s"} due for tomorrow. In
                        total, {numberTasksDueThisWeek} task{numberTasksDueThisWeek === 1 ? "" : "s"} left this week.
                    </Alert>
                    {numberTasksOverdue > 0 && (
                        <Alert icon={<IconMoodSad size={16} />} title="Tasks overdue" color="red">
                            {numberTasksOverdue} task{numberTasksOverdue === 1 ? "" : "s"} overdue.
                        </Alert>
                    )}
                </Card>
            )}
            <Divider my="sm" />
            {SVG_WAVE}
            <div className={"home-content-area"}>
                <IconBrandGithub />
                <Text size={"sm"}>
                    QuickTick is an open source project, have a{" "}
                    <a href={"https://github.com/jamesgiu/quick-tick"}>gander</a>.
                </Text>
            </div>
            <Alert icon={<IconInfoCircle size={32} />} title="Whoa there!" color="teal">
                Thanks for playing! QuickTick is a work in progress - you may experience some turbulence.
                <h4>
                    <IconBackhoe /> For recurring tasks...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        you'll have to set them in <a href="https://calendar.google.com/calendar">Google Tasks</a> (also
                        accessible via the "Calendar" link in the navbar)
                    </List.Item>
                </List>
                <h4>
                    <IconBulldozer /> For Android widgets...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        Download the{" "}
                        <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.tasks">
                            Google Tasks Android Application
                        </a>
                    </List.Item>
                    <i>This site is mobile-friendly, but does not currently provide widgets.</i>
                </List>
                <h4>
                    <IconWreckingBall /> Help! I can't load my tasks...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        Try signing out and back in again using the logout buttons located either in the top-right (
                        <IconLogout size={20} />) or via selecting the profile in the navbar.
                    </List.Item>
                </List>
            </Alert>
            {SVG_WAVE_BOTTOM}
        </div>
    );
}
