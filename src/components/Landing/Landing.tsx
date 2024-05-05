import { Alert, Blockquote, MediaQuery, Title } from "@mantine/core";
import { IconBulb, IconMoodSad } from "@tabler/icons";
import Quote from "inspirational-quotes";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { taskListsMapAtom, taskNumbersAtom, userInfoAtom } from "../../recoil/Atoms";
import { TaskUtil } from "../MyTasks/components/TaskUtil";
import "./Landing.css";
import { MOTIVATIONAL_IMAGES } from "./images";
import { Pipeline, PipelineIcons, PipelineIntent, PipelineSize } from "quick-cyc";
import { useViewportSize } from '@mantine/hooks';


export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export default function Landing(): JSX.Element {
    const userInfo = useRecoilValue(userInfoAtom);
    const taskListMap = useRecoilValue(taskListsMapAtom);
    const taskNumbers = useRecoilValue(taskNumbersAtom);
    const [time, setTime] = useState<string>();
    const [bgImage, setBgImage] = useState<string>();
    const { height } = useViewportSize();

    const [inspirationalQuote, setInspirationalQuote] = useState<{ text: string; author: string }>();

    function getPipelineView(): JSX.Element {
        const tasksDueToday = taskNumbers.dueToday;
        const tasksCompletedToday = getCompletedTasksToday();
        const tasksDueThisWeek = taskNumbers.dueThisWeek;
        const tasksCompletedThisWeek = getCompletedTasksThisWeek();

        const overdueTasks = taskNumbers.overdue;
        const completedOverdueTasksToday = getCompletedOverdueTasksToday();
        let nodeSize = height < 1280 ? PipelineSize.XS : PipelineSize.M;
        return (
            <Pipeline
                label="Pipeline"
                schema={[
                    {
                        active: overdueTasks > 0,
                        attempts: overdueTasks,
                        icon: PipelineIcons.IconExclamationMark,
                        intent:
                            completedOverdueTasksToday === overdueTasks
                                ? PipelineIntent.SUCCESS
                                : overdueTasks === 0
                                ? PipelineIntent.NONE
                                : PipelineIntent.FAILURE,
                        size: nodeSize,
                        percentComplete: (completedOverdueTasksToday / overdueTasks) * 100,
                        className: "overdueTasksNode",
                        outerLabel: "Overdue",
                    },
                    {
                        active: overdueTasks > 0,
                        intent:
                            completedOverdueTasksToday === overdueTasks
                                ? PipelineIntent.SUCCESS
                                : overdueTasks === 0
                                ? PipelineIntent.NONE
                                : PipelineIntent.FAILURE,
                        size: PipelineSize.S,
                    },
                    {
                        active: tasksDueToday > 0,
                        attempts: tasksDueToday,
                        icon: PipelineIcons.IconCalendarBolt,
                        intent:
                            tasksCompletedToday === tasksDueToday
                                ? PipelineIntent.SUCCESS
                                : tasksDueToday === 0
                                ? PipelineIntent.NONE
                                : PipelineIntent.WARNING,
                        size: nodeSize,
                        percentComplete: (tasksCompletedToday / tasksDueToday) * 100,
                        className: "todayTasksNode",
                        outerLabel: "Today",
                    },
                    {
                        active: tasksDueToday > 0,
                        intent:
                            tasksCompletedToday === tasksDueToday
                                ? PipelineIntent.SUCCESS
                                : tasksDueToday === 0
                                ? PipelineIntent.NONE
                                : PipelineIntent.IN_PROGRESS,
                        size: PipelineSize.S,
                    },
                    {
                        active: tasksDueThisWeek > 0,
                        attempts: tasksDueThisWeek,
                        icon: PipelineIcons.IconCalendarDue,
                        intent:
                            tasksCompletedThisWeek === tasksDueThisWeek
                                ? PipelineIntent.SUCCESS
                                : tasksDueThisWeek === 0
                                ? PipelineIntent.NONE
                                : PipelineIntent.IN_PROGRESS,
                        size: nodeSize,
                        percentComplete: (tasksCompletedThisWeek / tasksDueThisWeek) * 100,
                        className: "weekTasksNode",
                        outerLabel: "Week",
                    },
                ]}
            />
        );
    }

    const getDateStr = (): string => {
        const nowDate = new Date(Date.now());
        const timeString = `${nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours()}:${
            nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes()
        }:${nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds()}`;

        return timeString;
    };

    useEffect(() => {
        setTimeout(() => setTime(getDateStr), 1000);
    }, [time]);

    useEffect(() => {
        setBgImage(MOTIVATIONAL_IMAGES[getRandomInt(0, MOTIVATIONAL_IMAGES.length)].url);
        setInspirationalQuote(Quote.getQuote());
    }, []);

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

    function getCompletedTasksThisWeek(): number {
        const now = new Date(Date.now());
        const nowWeek = TaskUtil.getWeek(now);

        const completedTasksWeek = [];
        taskListMap.forEach((tasks) => {
            const completedTasks = tasks.filter((task) => {
                const taskCompletionDate = new Date(task.completed);
                const wasTaskCompletedThisWeek = TaskUtil.getWeek(taskCompletionDate) === nowWeek;
                return wasTaskCompletedThisWeek;
            });

            completedTasksWeek.push(...completedTasks);
        });

        return completedTasksWeek.length;
    }

    function getCompletedOverdueTasksToday(): number {
        const now = new Date(Date.now());
        const nowWeek = TaskUtil.getWeek(now);

        const completedTasksToday = [];
        taskListMap.forEach((tasks) => {
            const completedTasks = tasks.filter((task) => {
                const taskCompletionDate = new Date(task.completed);
                const wasTaskCompletedThisWeek = TaskUtil.getWeek(taskCompletionDate) === nowWeek;
                return (
                    wasTaskCompletedThisWeek &&
                    now.getDay() === taskCompletionDate.getDay() &&
                    new Date(task.due).getTime() < new Date(task.completed).getTime()
                );
            });

            completedTasksToday.push(...completedTasks);
        });

        return completedTasksToday.length;
    }

    const completedTasksToday = getCompletedTasksToday();

    return (
        <div className={"landing"}>
            {userInfo && inspirationalQuote && (
                <div
                    className="landing-wrapper"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="landing-inner">
                        <div className="today-at-a-glance">
                            <Alert icon={<IconBulb size={32} />} title="Today at a glance">
                                So far, you have completed {completedTasksToday} task
                                {completedTasksToday === 1 ? "" : "s"} today. There's {taskNumbers.dueToday} task
                                {taskNumbers.dueToday === 1 ? "" : "s"} left for today. {taskNumbers.dueTomorrow} task
                                {taskNumbers.dueTomorrow === 1 ? "" : "s"} due for tomorrow. In total,{" "}
                                {taskNumbers.dueThisWeek} task{taskNumbers.dueThisWeek === 1 ? "" : "s"} left this week.
                            </Alert>
                            {taskNumbers.overdue > 0 && (
                                <Alert icon={<IconMoodSad size={16} />} title="Tasks overdue" color="red">
                                    {taskNumbers.overdue} task{taskNumbers.overdue === 1 ? "" : "s"} overdue.
                                </Alert>
                            )}
                        </div>
                        <Title className={"clock"}>{time}</Title>
                        <Title className={"welcome"} order={3}>
                            G'day, {userInfo.given_name}
                            <div className="pipeline">{getPipelineView()}</div>
                        </Title>
                        <div className="quote">
                            <Blockquote cite={inspirationalQuote.author}>{inspirationalQuote.text}</Blockquote>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

