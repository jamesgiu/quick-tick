import { Badge, Tooltip } from "@mantine/core";
import {
    IconAlarm,
    IconCalendar,
    IconClock,
    IconConfetti,
    IconHourglassHigh,
    IconMoodSad,
    IconUrgent,
} from "@tabler/icons";
import { Task } from "../../../api/Types";
import "./TaskListCard.css";

// TODO
// flag button (edit notes to store extra detail on a task)

export class TaskUtil {
    // This script is released to the public domain and may be used, modified and
    // distributed without restrictions. Attribution not necessary but appreciated.
    // Source: https://weeknumber.net/how-to/javascript

    public static getTaskDueDate = (task: Task): Date | undefined => {
        if (!task.due) return undefined;
        const calendarDate = task.due.match(/^(\d{4})-(\d{2})-(\d{2})/);
        const date = calendarDate
            ? new Date(Number(calendarDate[1]), Number(calendarDate[2]) - 1, Number(calendarDate[3]))
            : new Date(task.due);
        return Number.isNaN(date.getTime()) ? undefined : date;
    };

    private static startOfDay = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    private static startOfWeek = (date: Date): Date => {
        const start = TaskUtil.startOfDay(date);
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        return start;
    };

    private static sameDay = (first: Date, second: Date): boolean => {
        return (
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate()
        );
    };

    // Returns the ISO week number; using the Thursday also keeps year boundaries correct.
    public static getWeek = (givenDate: Date): number => {
        const date = new Date(givenDate.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    };

    public static isTaskDueThisWeek = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        if (!dueDate) return false;
        const start = TaskUtil.startOfWeek(new Date());
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return dueDate >= start && dueDate < end;
    };

    public static isTaskDueToday = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        return dueDate ? TaskUtil.sameDay(dueDate, new Date()) : false;
    };

    public static isTaskDueTomorrow = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        if (!dueDate) return false;
        const tomorrow = TaskUtil.startOfDay(new Date());
        tomorrow.setDate(tomorrow.getDate() + 1);
        return TaskUtil.sameDay(dueDate, tomorrow);
    };

    public static isTaskDueNextWeek = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        if (!dueDate) return false;
        const start = TaskUtil.startOfWeek(new Date());
        start.setDate(start.getDate() + 7);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return dueDate >= start && dueDate < end;
    };

    public static isTaskOverDue = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        return dueDate ? TaskUtil.startOfDay(dueDate) < TaskUtil.startOfDay(new Date()) : false;
    };

    public static isTaskDueThisMonth = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        const now = new Date();
        return dueDate ? dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear() : false;
    };

    public static isTaskDueThisWeekend = (task: Task): boolean => {
        const dueDate = TaskUtil.getTaskDueDate(task);
        return Boolean(
            dueDate && TaskUtil.isTaskDueThisWeek(task) && (dueDate.getDay() === 0 || dueDate.getDay() === 6)
        );
    };

    public static generateShardsForTask = (task: Task): JSX.Element => {
        if (TaskUtil.isTaskOverDue(task)) {
            return (
                <Tooltip label="Task is overdue!">
                    <Badge color="red" variant="light">
                        Overdue <IconMoodSad size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        if (TaskUtil.isTaskDueToday(task)) {
            return (
                <Tooltip label="Task is due today!">
                    <Badge color="orange" variant="light">
                        Today <IconUrgent size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        if (TaskUtil.isTaskDueTomorrow(task)) {
            return (
                <Tooltip label="Task is due tomorrow!">
                    <Badge color="yellow" variant="light">
                        Tomorrow <IconHourglassHigh size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        if (TaskUtil.isTaskDueThisWeekend(task)) {
            return (
                <Tooltip label="Task is due this weekend!">
                    <Badge color="lime" variant="light">
                        This weekend <IconConfetti size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        if (TaskUtil.isTaskDueThisWeek(task)) {
            return (
                <Tooltip label="Task is due this week!">
                    <Badge color="yellow" variant="light">
                        This week <IconAlarm size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        if (TaskUtil.isTaskDueNextWeek(task)) {
            return (
                <Tooltip label="Task is due next week!">
                    <Badge color="cyan" variant="light">
                        Next week <IconClock size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        if (TaskUtil.isTaskDueThisMonth(task)) {
            return (
                <Tooltip label="Task is due this month!">
                    <Badge color="green" variant="light">
                        This month <IconCalendar size={13} />
                    </Badge>
                </Tooltip>
            );
        }

        return <></>;
    };
}
