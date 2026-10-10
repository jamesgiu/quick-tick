import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { TaskList } from "../../api/Types";
import { taskListLayoutAtom, taskListsAtom } from "../../recoil/Atoms";
import NewTaskList from "../Tasks/NewTasklist/NewTasklist";
import TaskForm from "../Tasks/TaskForm/TaskForm";
import "./MyTasks.css";
import TaskListCard, { TaskListFilter } from "./components/TaskListCard";
const ResponsiveGridLayout = WidthProvider(Responsive);

// TODO
// ** Create Task - maybe use "notes" to extend functionality?
// dropdown for Filtered by

export default function MyTasks(): JSX.Element {
    const [searchParams] = useSearchParams();
    const taskLists = useRecoilValue<TaskList[]>(taskListsAtom);

    const [filter, setFilter] = useState<TaskListFilter | undefined>(searchParams.get("when") as TaskListFilter);
    const [listFilter, setListFilter] = useState<string | null>(searchParams.get("listFilter"));
    const [layout, setLayout] = useRecoilState<Layout[]>(taskListLayoutAtom);
    const [ephemeralLayout, setEphemeralLayout] = useState<Layout[]>([]);

    // Reset the filter when searchParams is changed.
    useEffect(() => {
        setFilter(searchParams.get("when") as TaskListFilter);
        setListFilter(searchParams.get("listFilter"));
    }, [searchParams]);

    useEffect(() => {
        if (listFilter) {
            const selectedList = taskLists.find((taskList) => taskList.id === listFilter);
            const focusedLayout = selectedList ? [{ i: selectedList.id, x: 0, y: 0, h: 50, w: 50 }] : [];
            setEphemeralLayout((current) =>
                JSON.stringify(current) === JSON.stringify(focusedLayout) ? current : focusedLayout
            );
            return;
        }

        setEphemeralLayout((current) => (current.length ? [] : current));
        const existingLayout = new Map(layout.map((item) => [item.i, item]));
        const nextLayout = taskLists.map(
            (taskList, index) => existingLayout.get(taskList.id) ?? { i: taskList.id, x: 0, y: index, h: 15, w: 5 }
        );
        if (JSON.stringify(layout) !== JSON.stringify(nextLayout)) setLayout(nextLayout);
    }, [layout, listFilter, setLayout, taskLists]);

    const getTaskListPanels = (): JSX.Element[] => {
        return taskLists
            .filter((taskList) => !listFilter || listFilter === taskList.id)
            .map((taskList) => (
                <div key={taskList.id} className="panel">
                    <TaskListCard taskList={{ id: taskList.id, title: taskList.title }} filter={filter} />
                </div>
            ));
    };
    return (
        <div className={"my-tasks"}>
            <div>My Tasks</div>
            <div className="task-filter-select-wrapper">
                <Select
                    className="task-filter-select"
                    label="Filtered by:"
                    placeholder={filter ?? "Select..."}
                    value={filter ?? ""}
                    data={[
                        { value: "", label: "All" },
                        { value: TaskListFilter.TODAY, label: "today" },
                        { value: TaskListFilter.WEEKLY, label: "weekly" },
                        { value: TaskListFilter.WEEKEND, label: "weekend" },
                        { value: TaskListFilter.OVERDUE, label: "overdue" },
                    ]}
                    onChange={(newValue): void => {
                        // Set filter off if "All" is selected.
                        setFilter(newValue ? (newValue as TaskListFilter) : undefined);
                    }}
                />
            </div>
            <NewTaskList />
            <TaskForm />
            <ResponsiveGridLayout
                className="layout"
                layouts={{
                    lg: listFilter ? ephemeralLayout : layout,
                    md: listFilter ? ephemeralLayout : layout,
                    sm: listFilter ? ephemeralLayout : layout,
                    xs: listFilter ? ephemeralLayout : layout,
                    xxs: listFilter ? ephemeralLayout : layout,
                }}
                draggableHandle=".draggable-area"
                draggableCancel=".draggable-cancel"
                onDragStop={(layout): void => setLayout(layout)}
                onResizeStop={(layout): void => setLayout(layout)}
                rowHeight={5}
                cols={{ lg: 32, md: 32, sm: 24, xs: 12, xxs: 12 }}
            >
                {getTaskListPanels()}
            </ResponsiveGridLayout>
        </div>
    );
}
