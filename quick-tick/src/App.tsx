import React from "react";
import "./App.css";
import QuickTickAppShell from "./components/AppShell/QuickTickAppShell";
import DataLoader from "./components/DataLoader/DataLoader";

function App(): JSX.Element {
    return (
    <>
    <DataLoader/>
    <QuickTickAppShell />
    </>);
}

export default App;
