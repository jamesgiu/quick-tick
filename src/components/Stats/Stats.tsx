import { Badge, Box, Grid, Group, Paper, Progress, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { IconAward, IconChartBar, IconChecklist, IconFlame } from "@tabler/icons";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryPie, VictoryTheme } from "victory";
import { Task } from "../../api/Types";
import { taskListsMapAtom } from "../../recoil/Atoms";
import "./Stats.css";

interface ChartValueItem {
    x: string | Date;
    y: number;
}

export const generatePieValuesForBreakdownLastXDays = (
    taskListMap: Map<string, Task[]>,
    days: number
): ChartValueItem[] => {
    const taskListNamesAndCount: ChartValueItem[] = [];
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (days - 1));
    taskListMap.forEach((tasks, tasklist) => {
        const completedTasks = tasks.filter(
            (task) => task.completed && !task.deleted && new Date(task.completed).getTime() >= cutoff.getTime()
        );

        if (completedTasks.length > 0) {
            const newItem = {
                x: JSON.parse(tasklist).title + `(${completedTasks.length})`,
                y: completedTasks.length,
            };

            taskListNamesAndCount.push(newItem);
        }
    });
    return taskListNamesAndCount.sort((first, second) => String(first.x).localeCompare(String(second.x)));
};

export const generateChartValuesLastXDays = (taskListMap: Map<string, Task[]>, days: number): ChartValueItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const counts = new Map<string, number>();
    for (let offset = days - 1; offset >= 0; offset--) {
        const date = new Date(today);
        date.setDate(date.getDate() - offset);
        counts.set(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, 0);
    }

    taskListMap.forEach((tasks) => {
        tasks.forEach((task) => {
            if (!task.completed || task.deleted) return;
            const completedAt = new Date(task.completed);
            if (Number.isNaN(completedAt.getTime())) return;
            const key = `${completedAt.getFullYear()}-${completedAt.getMonth()}-${completedAt.getDate()}`;
            if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
        });
    });

    return Array.from(counts, ([key, y]) => {
        const [year, month, day] = key.split("-").map(Number);
        return { x: new Date(year, month, day), y };
    });
};

export const RPG_LEVELS = [
    { level: 1, title: "Novice", xp: 0 },
    { level: 2, title: "Apprentice", xp: 500 },
    { level: 3, title: "Task Tactician", xp: 1500 },
    { level: 4, title: "Quest Keeper", xp: 3000 },
    { level: 5, title: "Productivity Hero", xp: 5000 },
    { level: 6, title: "QuickTick Legend", xp: 8000 },
];

export const getRpgProgress = (xp: number): { level: number; title: string; progress: number; nextXp?: number } => {
    const currentIndex = RPG_LEVELS.reduce(
        (index, level, candidateIndex) => (xp >= level.xp ? candidateIndex : index),
        0
    );
    const current = RPG_LEVELS[currentIndex];
    const next = RPG_LEVELS[currentIndex + 1];
    return {
        level: current.level,
        title: current.title,
        progress: next ? ((xp - current.xp) / (next.xp - current.xp)) * 100 : 100,
        nextXp: next?.xp,
    };
};

const getTaskTotals = (taskListMap: Map<string, Task[]>): { completed: number; active: number } => {
    let completed = 0;
    let active = 0;
    taskListMap.forEach((tasks) =>
        tasks.forEach((task) => {
            if (task.deleted) return;
            if (task.completed) completed++;
            else active++;
        })
    );
    return { completed, active };
};

const StatSummary = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: number | string;
    icon: JSX.Element;
}): JSX.Element => (
    <Paper className="stats-summary-card" p="md" radius="md" withBorder>
        <Group position="apart" noWrap>
            <Stack spacing={4}>
                <Text size="sm" color="dimmed">
                    {label}
                </Text>
                <Title order={3}>{value}</Title>
            </Stack>
            <span className="stats-summary-icon">{icon}</span>
        </Group>
    </Paper>
);

export default function Stats(): JSX.Element {
    const taskListMap = useRecoilValue(taskListsMapAtom);
    const totals = getTaskTotals(taskListMap);
    const totalXp = totals.completed * 100;
    const progression = getRpgProgress(totalXp);
    const recentDays = generateChartValuesLastXDays(taskListMap, 7);
    const completedLast7Days = recentDays.reduce((total, item) => total + item.y, 0);
    const completedLast30Days = generateChartValuesLastXDays(taskListMap, 30).reduce(
        (total, item) => total + item.y,
        0
    );
    const breakdown30Days = generatePieValuesForBreakdownLastXDays(taskListMap, 30);
    const breakdown7Days = generatePieValuesForBreakdownLastXDays(taskListMap, 7);
    const progressToNextLevel =
        progression.nextXp !== undefined
            ? `${(progression.nextXp - totalXp).toLocaleString()} XP to Level ${progression.level + 1}`
            : "Maximum level reached — keep earning XP!";

    return (
        <div className="stats">
            <Stack spacing="lg">
                <Box>
                    <Title order={2}>Your stats</Title>
                    <Text color="dimmed">A clearer picture of the progress you are making.</Text>
                </Box>

                <SimpleGrid cols={3} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                    <StatSummary
                        label="Completed all-time"
                        value={totals.completed}
                        icon={<IconChecklist size={24} />}
                    />
                    <StatSummary
                        label="Completed in the last 30 days"
                        value={completedLast30Days}
                        icon={<IconChartBar size={24} />}
                    />
                    <StatSummary label="Active tasks" value={totals.active} icon={<IconFlame size={24} />} />
                </SimpleGrid>
                <Text size="xs" color="dimmed">
                    All-time counts completed tasks Google currently returns across your task lists and pages; Google
                    does not provide a separate aggregate count.
                </Text>

                <Paper className="rpg-card" p="lg" radius="md" withBorder>
                    <Group position="apart" align="flex-start">
                        <Group align="flex-start" noWrap>
                            <span className="stats-summary-icon">
                                <IconAward size={30} />
                            </span>
                            <Box>
                                <Text size="sm" color="dimmed">
                                    Your adventure
                                </Text>
                                <Title order={3}>
                                    Level {progression.level}: {progression.title}
                                </Title>
                            </Box>
                        </Group>
                        <Badge color="teal" size="lg" variant="light">
                            {totalXp.toLocaleString()} XP
                        </Badge>
                    </Group>
                    <Progress
                        className="rpg-progress"
                        value={progression.progress}
                        size="lg"
                        radius="xl"
                        color="teal"
                    />
                    <Group position="apart">
                        <Text size="sm" color="dimmed">
                            {progressToNextLevel}
                        </Text>
                        <Text size="sm" color="dimmed">
                            100 XP per completed task
                        </Text>
                    </Group>
                    <Group className="rpg-level-titles" spacing="xs">
                        {RPG_LEVELS.map((level) => (
                            <Badge
                                key={level.level}
                                color={level.level <= progression.level ? "teal" : "gray"}
                                variant={level.level === progression.level ? "filled" : "light"}
                            >
                                Lv {level.level} · {level.title}
                            </Badge>
                        ))}
                    </Group>
                </Paper>

                <Paper className="stats-panel" p="md" radius="md" withBorder>
                    <Title order={4}>Completed tasks by list</Title>
                    <Grid className="pie-grid" columns={10}>
                        <Grid.Col span={5}>
                            <Text weight={500}>Last 30 days</Text>
                            {breakdown30Days.length ? (
                                <span className="tasks-breakdown-pie">
                                    <VictoryPie data={breakdown30Days} theme={VictoryTheme.material} />
                                </span>
                            ) : (
                                <Text color="dimmed" size="sm">
                                    No tasks completed in this period.
                                </Text>
                            )}
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <Text weight={500}>Last 7 days</Text>
                            {breakdown7Days.length ? (
                                <span className="tasks-breakdown-pie">
                                    <VictoryPie data={breakdown7Days} theme={VictoryTheme.material} />
                                </span>
                            ) : (
                                <Text color="dimmed" size="sm">
                                    No tasks completed in this period.
                                </Text>
                            )}
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* <Paper className="stats-panel" p="md" radius="md" withBorder>
                    <Title order={4}>Completions per day · last 7 days</Title>
                    {completedLast7Days ? (
                        <span className="tasks-breakdown-chart">
                            <VictoryChart domainPadding={{ x: 18 }} theme={VictoryTheme.material}>
                                <VictoryAxis
                                    tickFormat={(date: Date): string =>
                                        date.toLocaleDateString(undefined, { weekday: "short" })
                                    }
                                />
                                <VictoryAxis dependentAxis tickFormat={(tick: number): number => Math.round(tick)} />
                                <VictoryBar
                                    data={recentDays}
                                    style={{ data: { fill: "#40c4cf" } }}
                                    animate={{ duration: 500 }}
                                />
                            </VictoryChart>
                        </span>
                    ) : (
                        <Text color="dimmed" size="sm">
                            Complete a task and your weekly activity will appear here.
                        </Text>
                    )}
                </Paper> */}
            </Stack>
        </div>
    );
}
