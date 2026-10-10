import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { taskCelebrationAtom } from "../../../../recoil/Atoms";
import "./TaskCelebration.css";

const CONFETTI_PIECES = Array.from({ length: 42 }, (_, index) => index);

export default function TaskCelebration(): JSX.Element | null {
    const celebration = useRecoilValue(taskCelebrationAtom);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (celebration === 0) return;
        setVisible(true);
        const timeout = window.setTimeout(() => setVisible(false), 2600);
        return () => window.clearTimeout(timeout);
    }, [celebration]);

    if (!visible) return null;

    return (
        <div className="task-celebration" aria-hidden="true">
            {CONFETTI_PIECES.map((piece) => (
                <span
                    className="confetti-piece"
                    key={`${celebration}-${piece}`}
                    style={{
                        left: `${(piece * 37 + 11) % 100}%`,
                        animationDelay: `${(piece % 9) * 0.06}s`,
                        animationDuration: `${1.6 + (piece % 5) * 0.18}s`,
                    }}
                />
            ))}
        </div>
    );
}
