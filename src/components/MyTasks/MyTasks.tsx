import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { TaskList } from "../../api/Types";
import { taskListLayoutAtom, taskListsAtom } from "../../recoil/Atoms";
import NewTask from "../Tasks/NewTask/NewTask";
import NewTaskList from "../Tasks/NewTasklist/NewTasklist";
import TaskListCard, { TaskListFilter } from "./components/TaskListCard";
import "./MyTasks.css";
const ResponsiveGridLayout = WidthProvider(Responsive);

// TODO
// ** Create Task - maybe use "notes" to extend functionality?
// dropdown for Filtered by

export default function MyTasks(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const taskLists = useRecoilValue<TaskList[]>(taskListsAtom);

    const whenParam: TaskListFilter | null = searchParams.get("when") as unknown as TaskListFilter;

    const [layout, setLayout] = useRecoilState<Layout[]>(taskListLayoutAtom);

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
                    <TaskListCard
                        taskList={taskListIdTitle}
                        filter={whenParam ? (whenParam as TaskListFilter) : undefined}
                    />
                </div>
            );

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
            {searchParams.get("when") && <div>Filtered by: {whenParam}</div>}
            <NewTaskList />
            <NewTask />
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                draggableHandle=".draggable-area"
                onDragStop={(layout) => setLayout(layout)}
                onResizeStop={(layout) => setLayout(layout)}
                rowHeight={5}
                cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            >
                {getTaskListPanels()}
            </ResponsiveGridLayout>
        </div>
    );
}
