import {Button, Header} from "@mantine/core";
import React from "react";
import "./QuickTickHeader.css";
import {Link} from "react-router-dom";
import {QuickTickPage} from "../../util/QuickTickPage";
export default function QuickTickHeader(): JSX.Element {
    return (
        <Link to={QuickTickPage.HOME}>
            <Header height={60} p="xs">QuickTick</Header>
        </Link>
    )
}