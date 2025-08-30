import { Card, Chip, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { TimerDay, TimerState } from "./Timecharging";
import { timersMapAtom } from "../../recoil/Atoms";
import { useRecoilState, useRecoilValue } from "recoil";

interface TimerProps {
    name: string;
    id: string;
    day: TimerDay;
    onTick: (mapKey: string, seconds: number) => void;
}

export default function Timer(props: TimerProps): JSX.Element {
    const [timersMap, setTimersMap] = useRecoilState<string | undefined>(timersMapAtom);
    const timersMapObj = timersMap ? new Map(JSON.parse(timersMap)) : new Map<string, number>();

    const getTimeForTimer = (): number => {
        if (timersMapObj.has(`${props.id}${props.day}`)) {
            return timersMapObj.get(`${props.id}${props.day}`) as number;
        }

        return 0;
    };

    // Store this in atom with key being name
    const [timeSecondsState, setTimeSecondsState] = useState<number>(0);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    const handleOnChange = () => {
        setIsCounting(!isCounting);
    };

    useEffect(() => {
        setTimeSecondsState(getTimeForTimer());
    }, [timersMap]);

    useEffect(() => {
        if (isCounting) {
            setTimeout(() => {
                setTimeSecondsState(timeSecondsState + 1);
                props.onTick(`${props.id}${props.day}`, timeSecondsState + 1);
            }, 1000);
        }
    }, [isCounting, timeSecondsState]);

    return (
        <Chip checked={isCounting} onChange={handleOnChange}>
            {new Date(timeSecondsState * 1000).toISOString().slice(11, 19)} : {props.name} :{" "}
        </Chip>
    );
}
