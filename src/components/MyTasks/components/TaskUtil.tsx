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
import { QuickTickTableRow } from "../../QuickTickTable/QuickTickTable";
import TaskControls from "./TaskControls";
import { TaskListFilter } from "./TaskListCard";
import "./TaskListCard.css";

// TODO
// flag button (edit notes to store extra detail on a task)

export class TaskUtil {
    // This script is released to the public domain and may be used, modified and
    // distributed without restrictions. Attribution not necessary but appreciated.
    // Source: https://weeknumber.net/how-to/javascript

    // Returns the ISO week of the date.
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
        const now = new Date(Date.now());
        const nowWeek = TaskUtil.getWeek(now);
        const taskDueDate = new Date(task.due);
        const isTaskDueThisWeek = TaskUtil.getWeek(taskDueDate) === nowWeek;

        return isTaskDueThisWeek;
    };

    public static isTaskDueToday = (task: Task): boolean => {
        const now = new Date(Date.now());
        const taskDueDate = new Date(task.due);
        const isTaskDueToday = TaskUtil.isTaskDueThisWeek(task) && now.getDay() === taskDueDate.getDay();

        return isTaskDueToday;
    };

    public static isTaskDueTomorrow = (task: Task): boolean => {
        const now = new Date(Date.now());
        const taskDueDate = new Date(task.due);
        const isTaskDueTomorrow = TaskUtil.isTaskDueThisWeek(task) && now.getDay() + 1 === taskDueDate.getDay();

        return isTaskDueTomorrow;
    };

    public static isTaskDueNextWeek = (task: Task): boolean => {
        const now = new Date(Date.now());
        const nowWeek = TaskUtil.getWeek(now);
        const taskDueDate = new Date(task.due);
        const isTaskDueNextWeek = TaskUtil.getWeek(taskDueDate) === nowWeek + 1;

        return isTaskDueNextWeek;
    };

    public static isTaskOverDue = (task: Task): boolean => {
        const now = new Date(Date.now());
        const taskDueDate = new Date(task.due);
        const isTaskOverDue = taskDueDate.getTime() < now.getTime() && !TaskUtil.isTaskDueToday(task);

        return isTaskOverDue;
    };

    public static isTaskDueThisMonth = (task: Task): boolean => {
        const now = new Date(Date.now());
        const nowMonth = now.getMonth();
        const taskDueDate = new Date(task.due);
        const isTaskDueThisMonth =
            taskDueDate.getMonth() === nowMonth && taskDueDate.getFullYear() === now.getFullYear();

        return isTaskDueThisMonth;
    };

    public static isTaskDueThisWeekend = (task: Task): boolean => {
        const now = new Date(Date.now());
        const taskDueDate = new Date(task.due);

        // 0 is Sunday, 6 is Saturday.
        // Task must be due this week and on a weekend day.
        const isTaskDueThisWeekend =
            TaskUtil.isTaskDueThisWeek(task) && (taskDueDate.getDay() === 0 || taskDueDate.getDay() === 6);

        return isTaskDueThisWeekend;
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

    public static getTasksAsRows = (tasks: Task[], filter?: TaskListFilter): QuickTickTableRow[] => {
        const rows: QuickTickTableRow[] = [];
        if (tasks?.length ?? 0 > 0) {
            tasks!.forEach((task) => {
                if (filter) {
                    if (filter === TaskListFilter.OVERDUE && !TaskUtil.isTaskOverDue(task)) {
                        // Skip tasks that aren't overdue.
                        return;
                    }

                    if (
                        filter === TaskListFilter.TODAY &&
                        !TaskUtil.isTaskDueToday(task) &&
                        !TaskUtil.isTaskOverDue(task)
                    ) {
                        // Skip tasks that aren't due today, if the filter is applied.
                        return;
                    }

                    if (
                        filter === TaskListFilter.WEEKLY &&
                        !TaskUtil.isTaskDueThisWeek(task) &&
                        !TaskUtil.isTaskDueToday(task) &&
                        !TaskUtil.isTaskDueTomorrow(task) &&
                        !TaskUtil.isTaskOverDue(task)
                    ) {
                        // Skip tasks that aren't due this week, if the filter is applied.
                        return;
                    }

                    if (filter === TaskListFilter.WEEKEND && !TaskUtil.isTaskDueThisWeekend(task)) {
                        // Skip tasks that aren't due this weekend, if the filter is applied.
                        return;
                    }
                }

                if (!task.completed) {
                    rows.push({
                        rowData: [
                            <span>
                                {task.title} {TaskUtil.generateShardsForTask(task)}
                            </span>,
                            new Date(task.due).toDateString(),
                            <TaskControls targetTask={task} />,
                        ],
                    });
                }
            });
        }

        const sortedRows = rows.sort((row1, row2) => {
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
}
