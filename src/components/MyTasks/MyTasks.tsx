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
    const [layout, setLayout] = useRecoilState<Layout[]>(taskListLayoutAtom);

    // Reset the filter when searchParams is changed.
    useEffect(() => {
        setFilter(searchParams.get("when") as TaskListFilter);
    }, [searchParams]);

    const getTaskListPanels = (): JSX.Element[] => {
        const taskListPanels: JSX.Element[] = [];
        const layoutIds = layout.map((layoutItem) => layoutItem.i).sort();
        const taskListIds = taskLists.map((taskList) => taskList.id).sort();
        const newLayout: Layout[] = [...layout];

        for (let i = 0; i < taskLists.length; i++) {
            const taskList = taskLists.at(i)!;
            const taskListIdTitle = {
                id: taskList.id,
                title: taskList.title,
            };

            taskListPanels.push(
                <div key={taskList.id} className="panel">
                    <TaskListCard taskList={taskListIdTitle} filter={filter} />
                </div>
            );

            // FIXME should this be a contains?
            if (JSON.stringify(layoutIds) !== JSON.stringify(taskListIds)) {
                // If we haven't seen this tasklist id before, add it to our layouts array.
                if (!layoutIds.includes(taskList.id)) {
                    const layoutItem = { i: taskList.id, x: 0, y: i, h: 15, w: 5 };
                    newLayout.push(layoutItem);
                }

                if (i === taskLists.length - 1 && JSON.stringify(layout) !== JSON.stringify(newLayout)) {
                    setLayout(newLayout);
                }
            }
        }

        return taskListPanels;
    };

    return (
        <div className={"my-tasks"}>
            <div>My Tasks</div>
            <div className="task-filter-select-wrapper">
                <Select
                    className="task-filter-select"
                    label="Filtered by:"
                    placeholder={filter ?? "Select..."}
                    data={[
                        { value: "", label: "All" },
                        { value: TaskListFilter.TODAY, label: "today" },
                        { value: TaskListFilter.WEEKLY, label: "weekly" },
                        { value: TaskListFilter.OVERDUE, label: "overdue" },
                    ]}
                    onChange={(newValue): void => {
                        // Set filter off if "All" is selected.
                        setFilter(newValue === "" ? undefined : (newValue as TaskListFilter));
                    }}
                />
            </div>
            <NewTaskList />
            <TaskForm />
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
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
