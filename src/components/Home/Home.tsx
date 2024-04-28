import { Alert, Center, List, Text } from "@mantine/core";
import {
    IconBackhoe,
    IconBrandGithub,
    IconBulldozer,
    IconGlassFull,
    IconInfoCircle,
    IconLogout,
    IconWreckingBall,
} from "@tabler/icons";
import { LOGO } from "../AppShell/components/Header/QuickTickHeader";
import "./Home.css";

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
                <img src={import.meta.env.VITE_BASE_PATH + "/qtlogo_bulb.png"} />
                <span className="splash-dot-1" />
                <span className="splash-dot-2" />
                <span className="splash-dot-3" />
                <span className="splash-dot-4" />
                <span className="splash-dot-5" />
                <span className="splash-dot-6" />
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
            <Alert icon={<IconInfoCircle size={32} />} title="Whoa there!" color="teal">
                Thanks for playing! QuickTick is a work in progress - you may experience some turbulence.
                <h4>
                    <IconBackhoe /> For recurring tasks...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        you'll have to set them in <a href="https://calendar.google.com/calendar">Google Tasks</a> (also
                        accessible via the "Calendar" link in the navbar).
                    </List.Item>
                </List>
                <h4>
                    <IconBulldozer /> For Android widgets...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        Download the{" "}
                        <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.tasks">
                            Google Tasks Android Application
                        </a>
                    </List.Item>
                    <i>This site is mobile-friendly, but does not currently provide widgets.</i>
                </List>
                <h4>
                    <IconWreckingBall /> Help! I can't load my tasks...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        Try signing out and back in again using the logout buttons located either in the top-right (
                        <IconLogout size={20} />) or via selecting the profile in the navbar.
                    </List.Item>
                </List>
                <h4>
                    <IconGlassFull /> Pairing notes...
                </h4>
                <List spacing="xs" size="xs" center icon={<IconInfoCircle size={16} />}>
                    <List.Item>
                        Whilst useable standalone, QuickTick is designed to be paired with{" "}
                        <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.tasks">
                            Google Tasks
                        </a>
                        . Anything you do here will be replicated in Google Tasks and in your{" "}
                        <a href="https://calendar.google.com/calendar">Google Calendar</a>.
                    </List.Item>
                </List>
            </Alert>
            {SVG_WAVE_BOTTOM}
        </div>
    );
}
