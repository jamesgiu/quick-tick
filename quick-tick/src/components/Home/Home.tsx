import React from "react";
import "./Home.css";
import { Avatar, Center, Text } from "@mantine/core";
import { IconBrandGithub, IconChecks } from "@tabler/icons";
import { LOGO } from "../AppShell/components/Header/QuickTickHeader";

const SVG_WAVE = (
    <svg viewBox="0 -30 500 80" width="100%" height="50" preserveAspectRatio="none" className={"svg-wave"}>
        <path
            transform="translate(0, -15)"
            d="M0,2 c30,-22 240,0 350,18 c90,17 230,7.5 350,-20 v50 h-700"
            fill="#007180C1"
        />
        <path d="M0,2 c30,-18 230,-12 350,7 c80,13 230,17 350,-5 v100 h-700z" fill="#1b1c1d" />
    </svg>
);

const SVG_WAVE_BOTTOM = (
    <svg viewBox="0 -30 80 500" width="100%" height="50" preserveAspectRatio="none" className={"svg-wave-bottom"}>
        <path d="M0,5 c60,-18 230,-12 350,7 c80,13 230,17 120,-10 v100 h-700z" fill="#1b1c1d" />
        <path
            transform="translate(0, -30)"
            d="M0,5 c100,-22 100,0 180,18 c90,3 80,3 180,-20 v50 h-700"
            fill=" #007180C1"
        />
    </svg>
);

export default function Home(): JSX.Element {
    return (
        <div className={"home"}>
            <Center>
                <Avatar radius={"xl"}>
                    <IconChecks size={30} />
                </Avatar>
            </Center>
            <h2>Welcome to {LOGO}</h2>
            <i>A task-management application</i>
            {SVG_WAVE}
            <div className={"home-content-area"}>
                <IconBrandGithub />
                <Text size={"sm"}>
                    QuickTick is an open source project, have a{" "}
                    <a href={"https://github.com/jamesgiu/quick-tick"}>gander</a>.
                </Text>
            </div>
            {SVG_WAVE_BOTTOM}
        </div>
    );
}
