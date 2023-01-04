import React from "react";
import { useRecoilValue } from "recoil";
import "./App.css";
import QuickTickAppShell from "./components/AppShell/QuickTickAppShell";
import DataLoader from "./components/DataLoader/DataLoader";
import { dataLoadingAtom } from "./recoil/Atoms";

function App(): JSX.Element {
    return (
        <QuickTickAppShell />
    );
}

export default App;
