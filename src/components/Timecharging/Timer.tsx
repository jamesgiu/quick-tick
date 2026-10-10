import { Chip } from "@mantine/core";
import { useEffect, useState } from "react";
import { TimerDay } from "./Timecharging";
import { timersMapAtom } from "../../recoil/Atoms";
import { useRecoilValue } from "recoil";

interface TimerProps {
    name: string;
    id: string;
    day: TimerDay;
    onTick: (mapKey: string, seconds: number) => void;
}

export default function Timer(props: TimerProps): JSX.Element {
    const timersMap = useRecoilValue<string | undefined>(timersMapAtom);
    const { name, id, day, onTick } = props;
    const mapKey = JSON.stringify([id, day]);

    // Store this in atom with key being name
    const [timeSecondsState, setTimeSecondsState] = useState<number>(0);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    const handleOnChange = (): void => {
        setIsCounting((counting) => !counting);
    };

    useEffect(() => {
        if (timersMap === undefined) {
            setTimeSecondsState(0);
            setIsCounting(false);
        } else {
            const savedTimers = new Map<string, number>(JSON.parse(timersMap));
            setTimeSecondsState(savedTimers.get(mapKey) ?? 0);
        }
    }, [timersMap, mapKey]);

    useEffect(() => {
        if (isCounting) {
            const timeout = window.setTimeout(() => {
                const nextTime = timeSecondsState + 1;
                setTimeSecondsState(nextTime);
                onTick(mapKey, nextTime);
            }, 1000);
            return () => window.clearTimeout(timeout);
        }
        return undefined;
    }, [isCounting, mapKey, onTick, timeSecondsState]);

    return (
        <Chip checked={isCounting} onChange={handleOnChange}>
            {new Date(timeSecondsState * 1000).toISOString().slice(11, 19)} : {name} :{" "}
        </Chip>
    );
}
