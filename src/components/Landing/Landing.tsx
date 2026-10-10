import { Alert, Blockquote, Title } from "@mantine/core";
import { IconBulb, IconMoodSad } from "@tabler/icons";
import Quote from "inspirational-quotes";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { taskListsMapAtom, taskNumbersAtom, userInfoAtom } from "../../recoil/Atoms";
import { TaskUtil } from "../MyTasks/components/TaskUtil";
import "./Landing.css";
import { MOTIVATIONAL_IMAGES } from "./images";
import { Pipeline, PipelineIcons, PipelineIntent, PipelineSize } from "quick-cyc";
import { useViewportSize } from "@mantine/hooks";

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const getDateStr = (): string => new Date().toLocaleTimeString(undefined, { hour12: false });

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfWeek = (date: Date): Date => {
    const start = startOfDay(date);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start;
};

const getPipelineIntent = (
    total: number,
    remaining: number,
    successIntent: PipelineIntent,
    incompleteIntent: PipelineIntent
): PipelineIntent => {
    if (total === 0) return PipelineIntent.NONE;
    return remaining === 0 ? successIntent : incompleteIntent;
};

export default function Landing(): JSX.Element {
    const userInfo = useRecoilValue(userInfoAtom);
    const taskListMap = useRecoilValue(taskListsMapAtom);
    const taskNumbers = useRecoilValue(taskNumbersAtom);
    const [time, setTime] = useState<string>(getDateStr);
    const [bgImage, setBgImage] = useState<string>();
    const { height } = useViewportSize();

    const [inspirationalQuote, setInspirationalQuote] = useState<{ text: string; author: string }>();

    function getPipelineView(): JSX.Element {
        const tasksDueToday = taskNumbers.dueToday;
        const tasksCompletedToday = getCompletedTasksDueToday();
        const tasksDueThisWeek = taskNumbers.dueThisWeek;
        const tasksCompletedThisWeek = getCompletedTasksThisWeek();

        const overdueTasks = taskNumbers.overdue;
        const completedOverdueTasksToday = getCompletedOverdueTasksToday();
        const overdueTotal = overdueTasks + completedOverdueTasksToday;
        const todayTotal = tasksDueToday + tasksCompletedToday;
        const weekTotal = tasksDueThisWeek + tasksCompletedThisWeek;
        const overdueIntent = getPipelineIntent(
            overdueTotal,
            overdueTasks,
            PipelineIntent.SUCCESS,
            PipelineIntent.FAILURE
        );
        const todayIntent = getPipelineIntent(
            todayTotal,
            tasksDueToday,
            PipelineIntent.SUCCESS,
            PipelineIntent.WARNING
        );
        const weekIntent = getPipelineIntent(
            weekTotal,
            tasksDueThisWeek,
            PipelineIntent.SUCCESS,
            PipelineIntent.IN_PROGRESS
        );
        const nodeSize = height < 1280 ? PipelineSize.M : PipelineSize.L;
        return (
            <Pipeline
                label="Pipeline"
                schema={[
                    {
                        active: overdueTasks > 0,
                        attempts: overdueTotal,
                        icon: PipelineIcons.IconExclamationMark,
                        intent: overdueIntent,
                        size: nodeSize,
                        percentComplete: overdueTotal ? (completedOverdueTasksToday / overdueTotal) * 100 : 0,
                        className: "overdueTasksNode",
                        outerLabel: "Overdue",
                    },
                    {
                        active: tasksDueToday > 0,
                        attempts: todayTotal,
                        icon: PipelineIcons.IconCalendarBolt,
                        intent: todayIntent,
                        size: nodeSize,
                        percentComplete: todayTotal ? (tasksCompletedToday / todayTotal) * 100 : 0,
                        className: "todayTasksNode",
                        outerLabel: "Today",
                    },
                    {
                        active: tasksDueThisWeek > 0,
                        attempts: weekTotal,
                        icon: PipelineIcons.IconCalendarDue,
                        intent: weekIntent,
                        size: nodeSize,
                        percentComplete: weekTotal ? (tasksCompletedThisWeek / weekTotal) * 100 : 0,
                        className: "weekTasksNode",
                        outerLabel: "Week",
                    },
                ]}
            />
        );
    }

    useEffect(() => {
        const interval = window.setInterval(() => setTime(getDateStr()), 1000);
        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        setBgImage(MOTIVATIONAL_IMAGES[getRandomInt(0, MOTIVATIONAL_IMAGES.length)].url);
        setInspirationalQuote(Quote.getQuote());
    }, []);

    function getCompletedTasksToday(): number {
        const today = startOfDay(new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let count = 0;
        taskListMap.forEach((tasks) =>
            tasks.forEach((task) => {
                const completedAt = task.completed ? new Date(task.completed) : undefined;
                if (completedAt && completedAt >= today && completedAt < tomorrow) count++;
            })
        );
        return count;
    }

    function getCompletedTasksThisWeek(): number {
        const weekStart = startOfWeek(new Date());
        const nextWeek = new Date(weekStart);
        nextWeek.setDate(nextWeek.getDate() + 7);
        let count = 0;
        taskListMap.forEach((tasks) =>
            tasks.forEach((task) => {
                const dueDate = TaskUtil.getTaskDueDate(task);
                if (task.completed && dueDate && dueDate >= weekStart && dueDate < nextWeek) count++;
            })
        );
        return count;
    }

    function getCompletedTasksDueToday(): number {
        const today = startOfDay(new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let count = 0;
        taskListMap.forEach((tasks) =>
            tasks.forEach((task) => {
                const dueDate = TaskUtil.getTaskDueDate(task);
                if (task.completed && dueDate && dueDate >= today && dueDate < tomorrow) count++;
            })
        );
        return count;
    }

    function getCompletedOverdueTasksToday(): number {
        const today = startOfDay(new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let count = 0;
        taskListMap.forEach((tasks) =>
            tasks.forEach((task) => {
                const dueDate = TaskUtil.getTaskDueDate(task);
                const completedAt = task.completed ? new Date(task.completed) : undefined;
                if (
                    dueDate &&
                    completedAt &&
                    startOfDay(dueDate) < today &&
                    completedAt >= today &&
                    completedAt < tomorrow
                ) {
                    count++;
                }
            })
        );
        return count;
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
