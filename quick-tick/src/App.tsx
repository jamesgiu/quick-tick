import React from 'react'
import './App.css'
import {AppShell, Header, Navbar} from "@mantine/core";
import QuickTickAppShell from "./components/AppShell/QuickTickAppShell";
import { Route, Routes } from "react-router";
import {BASE_PATH, QuickTickPage} from "./components/AppShell/util/QuickTickPage";
import Home from "./components/Home/Home";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
      <QuickTickAppShell/>
  )
}

export default App
