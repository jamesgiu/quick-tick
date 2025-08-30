import { Button, Table } from "@mantine/core";
import Timer from "./Timer";
import { useRecoilState, useRecoilValue } from "recoil";
import { TaskList } from "../../api/Types";
import { taskListsAtom, timersMapAtom } from "../../recoil/Atoms";
import "./Timecharging.css";
import { IconArrowBackUp } from "@tabler/icons";

export enum TimerDay {
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
    Saturday = 5,
    Sunday = 6,
}

export interface TimerState {
    day: TimerDay;
    listName: string;
    listId: string;
    timeSeconds: number;
}

export default function Timecharging(): JSX.Element {
    const taskLists = useRecoilValue<TaskList[]>(taskListsAtom);
    const [timersMap, setTimersMap] = useRecoilState<string | undefined>(timersMapAtom);

    const buildRows = (): JSX.Element[] => {
        const rows: JSX.Element[] = [];

        for (let i = 0; i < 7; i++) {
            rows.push(<td>{buildRowFromTaskLists(i)}</td>);
        }

        return rows;
    };

    const onTick = (mapKey: string, seconds: number) => {
        const newTimers = timersMap ? new Map(JSON.parse(timersMap!)) : new Map<string, number>();
        newTimers.set(mapKey, seconds);
        setTimersMap(JSON.stringify([...newTimers]));
    };

    const onReset = () => {
        setTimersMap(undefined);
    };

    const buildRowFromTaskLists = (timerDay: TimerDay): JSX.Element[] => {
        const timers: JSX.Element[] = [];
        taskLists.forEach((list) => {
            timers.push(<Timer name={list.title} id={list.id} day={timerDay} onTick={onTick} />);
        });

        return timers;
    };

    return (
        <div className={"timecharging"}>
            Timecharging
            <Table width={10}>
                <thead>
                    <tr>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                </thead>
                <tbody>{buildRows()}</tbody>
            </Table>
            <Button leftIcon={<IconArrowBackUp />} onClick={onReset}>
                Reset
            </Button>
        </div>
    );
}
