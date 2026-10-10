import { Button, Table } from "@mantine/core";
import Timer from "./Timer";
import { useCallback } from "react";
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
    const [, setTimersMap] = useRecoilState<string | undefined>(timersMapAtom);

    const buildRows = (): JSX.Element[] => [
        <tr key="timer-days">
            {Array.from({ length: 7 }, (_, day) => (
                <td key={day}>{buildRowFromTaskLists(day as TimerDay)}</td>
            ))}
        </tr>,
    ];

    const onTick = useCallback(
        (mapKey: string, seconds: number): void => {
            setTimersMap((currentTimers) => {
                const newTimers = currentTimers
                    ? new Map<string, number>(JSON.parse(currentTimers))
                    : new Map<string, number>();
                newTimers.set(mapKey, seconds);
                return JSON.stringify([...newTimers]);
            });
        },
        [setTimersMap]
    );

    const onReset = (): void => {
        setTimersMap(undefined);
    };

    const buildRowFromTaskLists = (timerDay: TimerDay): JSX.Element[] =>
        taskLists.map((list) => (
            <Timer key={`${list.id}-${timerDay}`} name={list.title} id={list.id} day={timerDay} onTick={onTick} />
        ));

    return (
        <div className={"timecharging"}>
            Timecharging
            <Table>
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
